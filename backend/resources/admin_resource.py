from datetime import datetime
from pathlib import Path

from flask import current_app, send_from_directory, url_for
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required
from flask_smorest import Blueprint, abort
from sqlalchemy import or_
from werkzeug.security import generate_password_hash

from extensions import db
from models.anuncio import Anuncio
from models.user import User
from models.verification_request import VerificationRequest
from schemas.advertiser_schema import (
    AdvertiserCreateSchema,
    AdvertiserSchema,
    AdvertiserUpdateSchema,
)
from schemas.verification_request_schema import VerificationRequestSchema

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin", description="Panel admin")


@admin_bp.route("/me", methods=["GET"])
@jwt_required()
def admin_me():
    claims = get_jwt()
    if claims.get("role") != "admin":
        abort(403, message="No tienes permisos de administrador")

    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    if not user:
        abort(404, message="Usuario no encontrado")

    return {
        "message": "Acceso admin autorizado",
        "user": user.to_dict(),
    }


@admin_bp.route("/advertisers", methods=["GET"])
@jwt_required()
def list_advertisers():
    claims = get_jwt()
    if claims.get("role") != "admin":
        abort(403, message="No tienes permisos de administrador")

    advertisers = User.query.filter_by(role="advertiser").order_by(User.created_at.desc()).all()
    return {"items": [AdvertiserSchema().dump(advertiser) for advertiser in advertisers]}


@admin_bp.route("/advertisers", methods=["POST"])
@jwt_required()
@admin_bp.arguments(AdvertiserCreateSchema)
def create_advertiser(data):
    claims = get_jwt()
    if claims.get("role") != "admin":
        abort(403, message="No tienes permisos de administrador")

    email = data["email"].strip().lower()
    existing = User.query.filter_by(email=email).first()
    if existing:
        abort(409, message="El correo ya esta registrado")

    advertiser = User(
        email=email,
        password_hash=generate_password_hash(data["password"]),
        role="advertiser",
        is_verified=data.get("is_verified", False),
        is_verification_requested=data.get("is_verification_requested", False),
        is_verification_rejected=data.get("is_verification_rejected", False),
    )
    db.session.add(advertiser)
    db.session.commit()
    return AdvertiserSchema().dump(advertiser), 201


@admin_bp.route("/advertisers/<int:advertiser_id>", methods=["PUT"])
@jwt_required()
@admin_bp.arguments(AdvertiserUpdateSchema)
def update_advertiser(data, advertiser_id):
    claims = get_jwt()
    if claims.get("role") != "admin":
        abort(403, message="No tienes permisos de administrador")

    advertiser = db.session.get(User, advertiser_id)
    if not advertiser or advertiser.role != "advertiser":
        abort(404, message="Anunciante no encontrado")

    if "email" in data:
        new_email = data["email"].strip().lower()
        email_owner = User.query.filter_by(email=new_email).first()
        if email_owner and email_owner.id != advertiser.id:
            abort(409, message="El correo ya esta registrado")
        advertiser.email = new_email

    if "password" in data and data["password"]:
        advertiser.password_hash = generate_password_hash(data["password"])

    if "is_verified" in data:
        advertiser.is_verified = data["is_verified"]
        if data["is_verified"]:
            advertiser.is_verification_requested = False
            advertiser.is_verification_rejected = False

    if "is_verification_requested" in data:
        advertiser.is_verification_requested = data["is_verification_requested"]
        if data["is_verification_requested"]:
            advertiser.is_verification_rejected = False

    if "is_verification_rejected" in data:
        advertiser.is_verification_rejected = data["is_verification_rejected"]
        if data["is_verification_rejected"]:
            advertiser.is_verified = False
            advertiser.is_verification_requested = False

    db.session.commit()
    return AdvertiserSchema().dump(advertiser)


@admin_bp.route("/advertisers/<int:advertiser_id>", methods=["DELETE"])
@jwt_required()
def delete_advertiser(advertiser_id):
    claims = get_jwt()
    if claims.get("role") != "admin":
        abort(403, message="No tienes permisos de administrador")

    advertiser = db.session.get(User, advertiser_id)
    if not advertiser or advertiser.role != "advertiser":
        abort(404, message="Anunciante no encontrado")

    db.session.delete(advertiser)
    db.session.commit()
    return {"message": "Anunciante eliminado"}


def _require_admin():
    claims = get_jwt()
    if claims.get("role") != "admin":
        abort(403, message="No tienes permisos de administrador")


def _expire_outdated_ads():
    now = datetime.utcnow()
    expired_ads = (
        Anuncio.query.filter(
            Anuncio.fecha_hasta < now,
            or_(Anuncio.estado != "INACTIVO", Anuncio.pago != "PENDIENTE"),
        ).all()
    )
    if not expired_ads:
        return

    for ad in expired_ads:
        ad.estado = "INACTIVO"
        ad.pago = "PENDIENTE"

    db.session.commit()


def _ad_upload_root() -> Path:
    upload_dir = current_app.config.get("ANUNCIO_UPLOAD_DIR", "anuncios")
    root = Path(current_app.root_path) / upload_dir
    root.mkdir(parents=True, exist_ok=True)
    return root


def _serialize_admin_ad(ad_request: Anuncio):
    return {
        "id": ad_request.id,
        "owner_id": ad_request.owner_id,
        "advertiser_email": ad_request.owner.email if ad_request.owner else "",
        "titulo": ad_request.titulo,
        "descripcion": ad_request.descripcion,
        "precio": ad_request.precio,
        "ubicacion": ad_request.ubicacion,
        "plan": ad_request.plan,
        "estado": ad_request.estado,
        "pago": ad_request.pago,
        "is_draft": ad_request.is_draft,
        "fecha_hasta": ad_request.fecha_hasta.isoformat(),
        "created_at": ad_request.created_at.isoformat(),
        "imagen_comprobante_pago": ad_request.imagen_comprobante_pago,
        "imagen_comprobante_pago_url": url_for(
            "advertiser_anuncios.get_anuncio_file",
            file_path=ad_request.imagen_comprobante_pago,
            _external=True,
        ),
        "images": [
            {
                "id": image.id,
                "path": image.path,
                "url": url_for(
                    "advertiser_anuncios.get_anuncio_file",
                    file_path=image.path,
                    _external=True,
                ),
            }
            for image in ad_request.images
        ],
    }


def _remove_ad_assets(ad_request: Anuncio):
    ad_folder = _ad_upload_root() / str(ad_request.id)
    if not ad_folder.exists():
        return

    for file_path in ad_folder.glob("*"):
        if file_path.is_file():
            file_path.unlink()

    ad_folder.rmdir()


@admin_bp.route("/ad-requests", methods=["GET"])
@jwt_required()
def list_ad_requests():
    _require_admin()
    _expire_outdated_ads()

    requests = (
        Anuncio.query.filter(Anuncio.estado.in_(["pending", "PENDIENTE"]), Anuncio.is_draft.is_(False))
        .order_by(Anuncio.created_at.desc())
        .all()
    )

    return {"items": [_serialize_admin_ad(ad_request) for ad_request in requests]}


@admin_bp.route("/active-ads", methods=["GET"])
@jwt_required()
def list_active_ads():
    _require_admin()
    _expire_outdated_ads()

    active_ads = (
        Anuncio.query.filter_by(estado="ACTIVO", pago="PAGADO", is_draft=False)
        .order_by(Anuncio.created_at.desc())
        .all()
    )
    return {"items": [_serialize_admin_ad(ad_request) for ad_request in active_ads]}


@admin_bp.route("/ad-requests/<int:request_id>/approve", methods=["POST"])
@jwt_required()
def approve_ad_request(request_id):
    _require_admin()

    ad_request = db.session.get(Anuncio, request_id)
    if not ad_request:
        abort(404, message="Solicitud de anuncio no encontrada")
    if ad_request.is_draft:
        abort(400, message="No puedes aprobar un borrador.")
    if str(ad_request.estado).upper() not in {"PENDIENTE", "PENDING"}:
        abort(400, message="Solo puedes aprobar anuncios pendientes.")

    ad_request.pago = "PAGADO"
    ad_request.estado = "ACTIVO"
    db.session.commit()

    return {"message": "Solicitud de anuncio aprobada correctamente"}


@admin_bp.route("/ad-requests/<int:request_id>/deactivate", methods=["POST"])
@jwt_required()
def deactivate_ad_request(request_id):
    _require_admin()

    ad_request = db.session.get(Anuncio, request_id)
    if not ad_request:
        abort(404, message="Anuncio no encontrado")
    if str(ad_request.estado).upper() != "ACTIVO" or str(ad_request.pago).upper() != "PAGADO":
        abort(400, message="Solo puedes retirar anuncios activos y pagados.")

    ad_request.estado = "INACTIVO"
    ad_request.pago = "PENDIENTE"
    db.session.commit()
    return {"message": "Anuncio retirado correctamente"}


@admin_bp.route("/ad-requests/<int:request_id>", methods=["DELETE"])
@jwt_required()
def delete_ad_request(request_id):
    _require_admin()

    ad_request = db.session.get(Anuncio, request_id)
    if not ad_request:
        abort(404, message="Anuncio no encontrado")

    _remove_ad_assets(ad_request)
    db.session.delete(ad_request)
    db.session.commit()
    return {"message": "Anuncio eliminado correctamente"}


@admin_bp.route("/verification-requests", methods=["GET"])
@jwt_required()
def list_verification_requests():
    _require_admin()
    requests = (
        VerificationRequest.query.filter_by(status="pending")
        .order_by(VerificationRequest.created_at.desc())
        .all()
    )

    items = []
    schema = VerificationRequestSchema()
    for verification_request in requests:
        dumped = schema.dump(verification_request)
        dumped["advertiser_email"] = verification_request.user.email if verification_request.user else ""
        dumped["document_image_url"] = url_for(
            "admin.get_verification_file",
            file_path=verification_request.document_image_path,
            _external=True,
        )
        dumped["portrait_image_url"] = url_for(
            "admin.get_verification_file",
            file_path=verification_request.portrait_image_path,
            _external=True,
        )
        items.append(dumped)

    return {"items": items}


@admin_bp.route("/verification-requests/<int:request_id>/approve", methods=["POST"])
@jwt_required()
def approve_verification_request(request_id):
    _require_admin()

    verification_request = db.session.get(VerificationRequest, request_id)
    if not verification_request:
        abort(404, message="Solicitud no encontrada")

    verification_request.status = "approved"
    user = verification_request.user
    if user:
        user.is_verified = True
        user.is_verification_requested = False
        user.is_verification_rejected = False

    db.session.commit()
    return {"message": "Solicitud aprobada correctamente"}


@admin_bp.route("/verification-requests/<int:request_id>/reject", methods=["POST"])
@jwt_required()
def reject_verification_request(request_id):
    _require_admin()

    verification_request = db.session.get(VerificationRequest, request_id)
    if not verification_request:
        abort(404, message="Solicitud no encontrada")

    verification_request.status = "rejected"
    user = verification_request.user
    if user:
        user.is_verified = False
        user.is_verification_requested = False
        user.is_verification_rejected = True

    db.session.commit()
    return {"message": "Solicitud rechazada"}


@admin_bp.route("/verification-files/<path:file_path>", methods=["GET"])
def get_verification_file(file_path):
    upload_root = _verification_upload_root()
    normalized = Path(file_path)
    if not normalized.parts or normalized.parts[0] != "verification_requests":
        abort(404, message="Archivo no encontrado")

    relative_in_upload = Path(*normalized.parts[1:])
    directory = upload_root / relative_in_upload.parent
    filename = relative_in_upload.name

    if not directory.exists():
        abort(404, message="Archivo no encontrado")

    return send_from_directory(directory, filename)


def _verification_upload_root() -> Path:
    upload_dir = current_app.config.get("VERIFICATION_UPLOAD_DIR", "verification_requests")
    root = Path(current_app.root_path) / upload_dir
    root.mkdir(parents=True, exist_ok=True)
    return root
