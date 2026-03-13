import calendar
import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional
from uuid import uuid4

from flask import current_app, request, send_from_directory, url_for
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required
from flask_smorest import Blueprint, abort
from sqlalchemy import or_
from werkzeug.utils import secure_filename

from extensions import db
from models.anuncio import Anuncio, AnuncioImage
from models.user import User
from schemas.anuncio_schema import AnuncioSchema, AnuncioUpdateSchema

advertiser_anuncio_bp = Blueprint(
    "advertiser_anuncios",
    __name__,
    url_prefix="/api/advertiser/anuncios",
    description="CRUD de anuncios del anunciante",
)
public_anuncio_bp = Blueprint(
    "public_anuncios",
    __name__,
    url_prefix="/api/anuncios",
    description="Listado publico de anuncios activos",
)

MAX_IMAGES_PER_ANUNCIO = 5
PLAN_CONFIG = {
    "executive": {"hours": 24},
    "nena": {"days": 7},
    "dama": {"months": 1},
    "princesa": {"months": 3},
}


def _require_verified_advertiser() -> User:
    claims = get_jwt()
    if claims.get("role") != "advertiser":
        abort(403, message="No tienes permisos de anunciante")

    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    if not user:
        abort(404, message="Usuario no encontrado")
    if not user.is_verified:
        abort(403, message="Debes verificar tu cuenta para crear anuncios")

    return user


def _upload_root() -> Path:
    upload_dir = current_app.config.get("ANUNCIO_UPLOAD_DIR", "anuncios")
    root = Path(current_app.root_path) / upload_dir
    root.mkdir(parents=True, exist_ok=True)
    return root


def _allowed_file(filename: str) -> bool:
    allowed = current_app.config.get(
        "ALLOWED_IMAGE_EXTENSIONS", {"png", "jpg", "jpeg", "webp", "avif"}
    )
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed


def _add_months(current_datetime: datetime, months: int) -> datetime:
    month_index = current_datetime.month - 1 + months
    year = current_datetime.year + month_index // 12
    month = month_index % 12 + 1
    day = min(current_datetime.day, calendar.monthrange(year, month)[1])
    return current_datetime.replace(year=year, month=month, day=day)


def _calculate_expiration(plan: str, now: Optional[datetime] = None) -> datetime:
    current_time = now or datetime.utcnow()
    config = PLAN_CONFIG[plan]

    if "hours" in config:
        return current_time + timedelta(hours=config["hours"])
    if "days" in config:
        return current_time + timedelta(days=config["days"])
    if "months" in config:
        return _add_months(current_time, config["months"])

    raise ValueError(f"Plan no soportado: {plan}")


def _save_file(file_storage, target_folder: Path, prefix: str) -> str:
    original_name = file_storage.filename or ""
    if not original_name:
        abort(400, message="Archivo inválido.")
    if not _allowed_file(original_name):
        abort(400, message=f"Formato no permitido: {original_name}")

    safe_name = secure_filename(original_name)
    extension = safe_name.rsplit(".", 1)[1].lower()
    final_name = f"{prefix}_{uuid4().hex}.{extension}"
    absolute_path = target_folder / final_name
    file_storage.save(absolute_path)
    return os.path.join("anuncios", target_folder.name, final_name)


def _serialize_anuncio(anuncio: Anuncio):
    payload = AnuncioSchema().dump(anuncio)
    contact_raw = f"{anuncio.contact_country_code or ''}{anuncio.contact_number or ''}"
    whatsapp_digits = "".join(char for char in contact_raw if char.isdigit())
    payload["whatsapp_url"] = f"https://wa.me/{whatsapp_digits}" if whatsapp_digits else ""
    payload["imagen_comprobante_pago_url"] = url_for(
        "advertiser_anuncios.get_anuncio_file",
        file_path=anuncio.imagen_comprobante_pago,
        _external=True,
    )
    payload["images"] = [
        {
            "id": image.id,
            "path": image.path,
            "url": url_for("advertiser_anuncios.get_anuncio_file", file_path=image.path, _external=True),
        }
        for image in anuncio.images
    ]
    return payload


def _require_owner(ad: Anuncio, advertiser_id: int):
    if ad.owner_id != advertiser_id:
        abort(403, message="No tienes permisos sobre este anuncio")


def _validate_anuncio_completion(anuncio: Anuncio):
    if not (anuncio.titulo or "").strip():
        abort(400, message="Completa el título del anuncio.")
    if not (anuncio.descripcion or "").strip():
        abort(400, message="Completa la descripción del anuncio.")
    if not (anuncio.ubicacion or "").strip():
        abort(400, message="Completa la ubicación del anuncio.")
    if anuncio.precio is None or float(anuncio.precio) < 0:
        abort(400, message="Precio inválido.")

    country_digits = "".join(char for char in (anuncio.contact_country_code or "") if char.isdigit())
    phone_digits = "".join(char for char in (anuncio.contact_number or "") if char.isdigit()).lstrip("0")
    if not country_digits or len(country_digits) < 1 or len(country_digits) > 4:
        abort(400, message="Código de país inválido.")
    if not phone_digits or len(phone_digits) < 6 or len(phone_digits) > 15:
        abort(400, message="Número de contacto inválido.")


def _expire_outdated_ads(owner_id: Optional[int] = None):
    now = datetime.utcnow()
    query = Anuncio.query.filter(
        Anuncio.fecha_hasta < now,
        or_(Anuncio.estado != "INACTIVO", Anuncio.pago != "PENDIENTE"),
    )
    if owner_id is not None:
        query = query.filter(Anuncio.owner_id == owner_id)

    expired_ads = query.all()

    if not expired_ads:
        return

    for ad in expired_ads:
        ad.estado = "INACTIVO"
        ad.pago = "PENDIENTE"

    db.session.commit()


@advertiser_anuncio_bp.route("", methods=["GET"])
@jwt_required()
def list_advertiser_anuncios():
    claims = get_jwt()
    if claims.get("role") != "advertiser":
        abort(403, message="No tienes permisos de anunciante")

    advertiser_id = int(get_jwt_identity())
    _expire_outdated_ads(advertiser_id)
    anuncios = (
        Anuncio.query.filter_by(owner_id=advertiser_id).order_by(Anuncio.created_at.desc()).all()
    )
    return {"items": [_serialize_anuncio(anuncio) for anuncio in anuncios]}


@advertiser_anuncio_bp.route("", methods=["POST"])
@jwt_required()
def create_advertiser_anuncio():
    advertiser = _require_verified_advertiser()

    titulo = (request.form.get("titulo") or "").strip()
    descripcion = (request.form.get("descripcion") or "").strip()
    ubicacion = (request.form.get("ubicacion") or "").strip()
    plan = (request.form.get("plan") or "").strip().lower()
    precio_raw = (request.form.get("precio") or "").strip()
    contact_country_code = (request.form.get("contact_country_code") or "").strip()
    contact_number = (request.form.get("contact_number") or "").strip()

    if (
        not titulo
        or not descripcion
        or not ubicacion
        or not plan
        or not precio_raw
        or not contact_country_code
        or not contact_number
    ):
        abort(400, message="Completa todos los campos del anuncio.")

    contact_country_code = (
        contact_country_code if contact_country_code.startswith("+") else f"+{contact_country_code}"
    )
    country_digits = "".join(char for char in contact_country_code if char.isdigit())
    phone_digits = "".join(char for char in contact_number if char.isdigit())
    phone_digits = phone_digits.lstrip("0")
    if not country_digits or len(country_digits) < 1 or len(country_digits) > 4:
        abort(400, message="Código de país inválido.")
    if not phone_digits or len(phone_digits) < 6 or len(phone_digits) > 15:
        abort(400, message="Número de contacto inválido.")

    contact_country_code = f"+{country_digits}"
    contact_number = phone_digits

    if plan not in PLAN_CONFIG:
        abort(400, message="Plan inválido. Usa executive, nena, dama o princesa.")

    try:
        precio = float(precio_raw)
    except ValueError:
        abort(400, message="Precio inválido.")
    if precio < 0:
        abort(400, message="Precio inválido.")

    payment_receipt = request.files.get("payment_receipt_image")
    if not payment_receipt:
        abort(400, message="Debes cargar la foto de la transferencia.")

    ad_images = [file for file in request.files.getlist("images") if file and file.filename]
    if len(ad_images) > MAX_IMAGES_PER_ANUNCIO:
        abort(400, message=f"Máximo {MAX_IMAGES_PER_ANUNCIO} imágenes por anuncio.")

    expiration_date = _calculate_expiration(plan)

    anuncio = Anuncio(
        owner_id=advertiser.id,
        titulo=titulo,
        descripcion=descripcion,
        precio=precio,
        ubicacion=ubicacion,
        contact_country_code=contact_country_code,
        contact_number=contact_number,
        plan=plan,
        estado="PENDIENTE",
        pago="PENDIENTE",
        fecha_hasta=expiration_date,
        imagen_comprobante_pago="",
    )
    db.session.add(anuncio)
    db.session.flush()

    upload_root = _upload_root()
    ad_folder = upload_root / str(anuncio.id)
    ad_folder.mkdir(parents=True, exist_ok=True)

    anuncio.imagen_comprobante_pago = _save_file(payment_receipt, ad_folder, "payment")

    for file in ad_images:
        image_path = _save_file(file, ad_folder, "ad")
        db.session.add(AnuncioImage(anuncio_id=anuncio.id, path=image_path))

    db.session.commit()

    return {
        "message": (
            "Anuncio creado, tu anuncio empezará a estar en circulación en 24h aprox o antes."
        ),
        "item": _serialize_anuncio(anuncio),
    }, 201


@advertiser_anuncio_bp.route("/draft", methods=["POST"])
@jwt_required()
def create_advertiser_anuncio_draft():
    advertiser = _require_verified_advertiser()

    plan = (request.form.get("plan") or "").strip().lower()
    if plan not in PLAN_CONFIG:
        abort(400, message="Plan inválido. Usa executive, nena, dama o princesa.")

    payment_receipt = request.files.get("payment_receipt_image")
    if not payment_receipt:
        abort(400, message="Debes cargar la foto de la transferencia.")

    anuncio = Anuncio(
        owner_id=advertiser.id,
        titulo="",
        descripcion="",
        precio=0,
        ubicacion="",
        contact_country_code="+593",
        contact_number="",
        plan=plan,
        estado="PENDIENTE",
        pago="PENDIENTE",
        is_draft=True,
        fecha_hasta=_calculate_expiration(plan),
        imagen_comprobante_pago="",
    )
    db.session.add(anuncio)
    db.session.flush()

    upload_root = _upload_root()
    ad_folder = upload_root / str(anuncio.id)
    ad_folder.mkdir(parents=True, exist_ok=True)
    anuncio.imagen_comprobante_pago = _save_file(payment_receipt, ad_folder, "payment")

    db.session.commit()
    return {
        "message": "Borrador creado correctamente.",
        "item": _serialize_anuncio(anuncio),
    }, 201


@advertiser_anuncio_bp.route("/<int:anuncio_id>/reactivate", methods=["POST"])
@jwt_required()
def reactivate_advertiser_anuncio(anuncio_id):
    advertiser = _require_verified_advertiser()

    anuncio = db.session.get(Anuncio, anuncio_id)
    if not anuncio:
        abort(404, message="Anuncio no encontrado")
    _require_owner(anuncio, advertiser.id)

    if str(anuncio.estado).upper() != "INACTIVO" or str(anuncio.pago).upper() != "PENDIENTE":
        abort(400, message="Solo puedes activar anuncios inactivos y con pago pendiente.")

    plan = (request.form.get("plan") or "").strip().lower()
    if plan not in PLAN_CONFIG:
        abort(400, message="Plan inválido. Usa executive, nena, dama o princesa.")

    payment_receipt = request.files.get("payment_receipt_image")
    if not payment_receipt:
        abort(400, message="Debes cargar la foto de la transferencia.")

    ad_folder = _upload_root() / str(anuncio.id)
    ad_folder.mkdir(parents=True, exist_ok=True)

    if anuncio.imagen_comprobante_pago:
        old_receipt_path = Path(current_app.root_path) / anuncio.imagen_comprobante_pago
        if old_receipt_path.exists() and old_receipt_path.is_file():
            old_receipt_path.unlink()

    anuncio.imagen_comprobante_pago = _save_file(payment_receipt, ad_folder, "payment")
    anuncio.plan = plan
    anuncio.fecha_hasta = _calculate_expiration(plan)
    anuncio.estado = "PENDIENTE"
    anuncio.pago = "PENDIENTE"

    db.session.commit()
    return {
        "message": "Anuncio reactivado. Queda en revisión de pago y activación.",
        "item": _serialize_anuncio(anuncio),
    }


@advertiser_anuncio_bp.route("/<int:anuncio_id>", methods=["PUT"])
@jwt_required()
@advertiser_anuncio_bp.arguments(AnuncioUpdateSchema)
def update_advertiser_anuncio(data, anuncio_id):
    claims = get_jwt()
    if claims.get("role") != "advertiser":
        abort(403, message="No tienes permisos de anunciante")

    advertiser_id = int(get_jwt_identity())
    anuncio = db.session.get(Anuncio, anuncio_id)
    if not anuncio:
        abort(404, message="Anuncio no encontrado")
    _require_owner(anuncio, advertiser_id)

    if "contact_country_code" in data:
        country_code = str(data["contact_country_code"]).strip()
        if not country_code:
            abort(400, message="Código de país inválido.")
        country_code = country_code if country_code.startswith("+") else f"+{country_code}"
        country_digits = "".join(char for char in country_code if char.isdigit())
        if not country_digits or len(country_digits) < 1 or len(country_digits) > 4:
            abort(400, message="Código de país inválido.")
        data["contact_country_code"] = f"+{country_digits}"

    if "contact_number" in data:
        phone_digits = "".join(char for char in str(data["contact_number"]) if char.isdigit())
        phone_digits = phone_digits.lstrip("0")
        if not phone_digits or len(phone_digits) < 6 or len(phone_digits) > 15:
            abort(400, message="Número de contacto inválido.")
        data["contact_number"] = phone_digits

    for key, value in data.items():
        setattr(anuncio, key, value)

    db.session.commit()
    return _serialize_anuncio(anuncio)


@advertiser_anuncio_bp.route("/<int:anuncio_id>/finalize", methods=["POST"])
@jwt_required()
def finalize_advertiser_anuncio(anuncio_id):
    claims = get_jwt()
    if claims.get("role") != "advertiser":
        abort(403, message="No tienes permisos de anunciante")

    advertiser_id = int(get_jwt_identity())
    anuncio = db.session.get(Anuncio, anuncio_id)
    if not anuncio:
        abort(404, message="Anuncio no encontrado")
    _require_owner(anuncio, advertiser_id)

    _validate_anuncio_completion(anuncio)
    anuncio.is_draft = False
    anuncio.estado = "PENDIENTE"
    anuncio.pago = "PENDIENTE"

    db.session.commit()
    return {
        "message": "Anuncio finalizado y enviado a revisión.",
        "item": _serialize_anuncio(anuncio),
    }


@advertiser_anuncio_bp.route("/<int:anuncio_id>", methods=["DELETE"])
@jwt_required()
def delete_advertiser_anuncio(anuncio_id):
    claims = get_jwt()
    if claims.get("role") != "advertiser":
        abort(403, message="No tienes permisos de anunciante")

    advertiser_id = int(get_jwt_identity())
    anuncio = db.session.get(Anuncio, anuncio_id)
    if not anuncio:
        abort(404, message="Anuncio no encontrado")
    _require_owner(anuncio, advertiser_id)

    ad_folder = _upload_root() / str(anuncio.id)
    if ad_folder.exists():
        for file_path in ad_folder.glob("*"):
            if file_path.is_file():
                file_path.unlink()
        ad_folder.rmdir()

    db.session.delete(anuncio)
    db.session.commit()
    return {"message": "Anuncio eliminado"}


@advertiser_anuncio_bp.route("/<int:anuncio_id>/images", methods=["POST"])
@jwt_required()
def upload_advertiser_anuncio_images(anuncio_id):
    claims = get_jwt()
    if claims.get("role") != "advertiser":
        abort(403, message="No tienes permisos de anunciante")

    advertiser_id = int(get_jwt_identity())
    anuncio = db.session.get(Anuncio, anuncio_id)
    if not anuncio:
        abort(404, message="Anuncio no encontrado")
    _require_owner(anuncio, advertiser_id)

    files = [file for file in request.files.getlist("images") if file and file.filename]
    if not files:
        abort(400, message="No se recibieron imágenes")

    if len(anuncio.images) + len(files) > MAX_IMAGES_PER_ANUNCIO:
        abort(400, message=f"Máximo {MAX_IMAGES_PER_ANUNCIO} imágenes por anuncio.")

    ad_folder = _upload_root() / str(anuncio.id)
    ad_folder.mkdir(parents=True, exist_ok=True)

    for file in files:
        image_path = _save_file(file, ad_folder, "ad")
        db.session.add(AnuncioImage(anuncio_id=anuncio.id, path=image_path))

    db.session.commit()
    return {"message": "Imágenes cargadas correctamente", "item": _serialize_anuncio(anuncio)}


@advertiser_anuncio_bp.route("/<int:anuncio_id>/images/<int:image_id>", methods=["DELETE"])
@jwt_required()
def delete_advertiser_anuncio_image(anuncio_id, image_id):
    claims = get_jwt()
    if claims.get("role") != "advertiser":
        abort(403, message="No tienes permisos de anunciante")

    advertiser_id = int(get_jwt_identity())
    anuncio = db.session.get(Anuncio, anuncio_id)
    if not anuncio:
        abort(404, message="Anuncio no encontrado")
    _require_owner(anuncio, advertiser_id)

    image = db.session.get(AnuncioImage, image_id)
    if not image or image.anuncio_id != anuncio_id:
        abort(404, message="Imagen no encontrada para este anuncio")

    absolute_path = Path(current_app.root_path) / image.path
    if absolute_path.exists() and absolute_path.is_file():
        absolute_path.unlink()

    db.session.delete(image)
    db.session.commit()
    return {"message": "Imagen eliminada correctamente"}


@advertiser_anuncio_bp.route("/files/<path:file_path>", methods=["GET"])
def get_anuncio_file(file_path):
    upload_root = _upload_root()
    normalized = Path(file_path)
    if not normalized.parts or normalized.parts[0] != "anuncios":
        abort(404, message="Archivo no encontrado")

    relative_in_upload = Path(*normalized.parts[1:])
    directory = upload_root / relative_in_upload.parent
    filename = relative_in_upload.name
    if not directory.exists():
        abort(404, message="Archivo no encontrado")

    return send_from_directory(directory, filename)


@public_anuncio_bp.route("", methods=["GET"])
def list_public_anuncios():
    _expire_outdated_ads()
    now = datetime.utcnow()
    anuncios = (
        Anuncio.query.filter_by(estado="ACTIVO", pago="PAGADO")
        .filter(Anuncio.fecha_hasta >= now)
        .order_by(Anuncio.created_at.desc())
        .all()
    )
    return {"items": [_serialize_anuncio(anuncio) for anuncio in anuncios]}


@public_anuncio_bp.route("/<int:anuncio_id>", methods=["GET"])
def get_public_anuncio(anuncio_id):
    _expire_outdated_ads()
    now = datetime.utcnow()
    anuncio = Anuncio.query.filter_by(id=anuncio_id, estado="ACTIVO", pago="PAGADO").first()
    if not anuncio or anuncio.fecha_hasta < now:
        abort(404, message="Anuncio no encontrado")
    return _serialize_anuncio(anuncio)
