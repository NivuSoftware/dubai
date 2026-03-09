import os
from pathlib import Path
from uuid import uuid4

from flask import current_app, request, send_from_directory, url_for
from flask_jwt_extended import get_jwt, jwt_required
from flask_smorest import Blueprint, abort
from werkzeug.utils import secure_filename

from extensions import db
from models.modelo import Modelo, ModeloImage
from schemas.modelo_schema import ModeloCreateSchema, ModeloSchema

modelo_bp = Blueprint(
    "modelos",
    __name__,
    url_prefix="/api/admin/modelos",
    description="CRUD de modelos y carga de imagenes",
)

public_modelo_bp = Blueprint(
    "public_modelos",
    __name__,
    url_prefix="/api/modelos",
    description="Listado publico de modelos",
)
MAX_IMAGES_PER_MODELO = 5


def _require_admin():
    claims = get_jwt()
    if claims.get("role") != "admin":
        abort(403, message="No tienes permisos de administrador")


def _upload_root() -> Path:
    upload_dir = current_app.config.get("MODEL_UPLOAD_DIR", "modelos")
    root = Path(current_app.root_path) / upload_dir
    root.mkdir(parents=True, exist_ok=True)
    return root


def _allowed_file(filename: str) -> bool:
    allowed = current_app.config.get(
        "ALLOWED_IMAGE_EXTENSIONS", {"png", "jpg", "jpeg", "webp", "avif"}
    )
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed


def _serialize_modelo(modelo: Modelo):
    result = ModeloSchema().dump(modelo)
    result["images"] = [
        {
            "id": image.id,
            "path": image.path,
            "url": url_for("modelos.get_modelo_file", file_path=image.path, _external=True),
        }
        for image in modelo.images
    ]
    return result


@modelo_bp.route("", methods=["GET"])
@jwt_required()
def list_modelos():
    _require_admin()
    modelos = Modelo.query.order_by(Modelo.created_at.desc()).all()
    return {"items": [_serialize_modelo(modelo) for modelo in modelos]}


@modelo_bp.route("", methods=["POST"])
@jwt_required()
@modelo_bp.arguments(ModeloCreateSchema)
def create_modelo(data):
    _require_admin()
    modelo = Modelo(**data)
    db.session.add(modelo)
    db.session.commit()
    return _serialize_modelo(modelo), 201


@modelo_bp.route("/<int:modelo_id>", methods=["GET"])
@jwt_required()
def get_modelo(modelo_id):
    _require_admin()
    modelo = db.session.get(Modelo, modelo_id)
    if not modelo:
        abort(404, message="Modelo no encontrado")
    return _serialize_modelo(modelo)


@modelo_bp.route("/<int:modelo_id>", methods=["PUT"])
@jwt_required()
@modelo_bp.arguments(ModeloCreateSchema)
def update_modelo(data, modelo_id):
    _require_admin()
    modelo = db.session.get(Modelo, modelo_id)
    if not modelo:
        abort(404, message="Modelo no encontrado")

    for key, value in data.items():
        setattr(modelo, key, value)

    db.session.commit()
    return _serialize_modelo(modelo)


@modelo_bp.route("/<int:modelo_id>", methods=["DELETE"])
@jwt_required()
def delete_modelo(modelo_id):
    _require_admin()
    modelo = db.session.get(Modelo, modelo_id)
    if not modelo:
        abort(404, message="Modelo no encontrado")

    upload_root = _upload_root()
    model_folder = upload_root / str(modelo.id)
    if model_folder.exists():
        for file_path in model_folder.glob("*"):
            if file_path.is_file():
                file_path.unlink()
        model_folder.rmdir()

    db.session.delete(modelo)
    db.session.commit()
    return {"message": "Modelo eliminado"}


@modelo_bp.route("/<int:modelo_id>/images", methods=["POST"])
@jwt_required()
def upload_modelo_images(modelo_id):
    _require_admin()
    modelo = db.session.get(Modelo, modelo_id)
    if not modelo:
        abort(404, message="Modelo no encontrado")

    if "images" not in request.files:
        abort(400, message="Debes enviar archivos en el campo 'images'")

    files = request.files.getlist("images")
    if not files:
        abort(400, message="No se recibieron imagenes")

    existing_images = len(modelo.images)
    incoming_images = len([file for file in files if file.filename])
    if existing_images + incoming_images > MAX_IMAGES_PER_MODELO:
        abort(
            400,
            message=(
                f"Maximo {MAX_IMAGES_PER_MODELO} imagenes por modelo. "
                f"Actualmente tiene {existing_images}."
            ),
        )

    upload_root = _upload_root()
    model_folder = upload_root / str(modelo.id)
    model_folder.mkdir(parents=True, exist_ok=True)

    saved_images = []
    for file in files:
        original = file.filename or ""
        if not original:
            continue
        if not _allowed_file(original):
            abort(400, message=f"Formato no permitido: {original}")

        safe_name = secure_filename(original)
        ext = safe_name.rsplit(".", 1)[1].lower()
        final_name = f"{uuid4().hex}.{ext}"

        abs_path = model_folder / final_name
        file.save(abs_path)

        relative_path = os.path.join("modelos", str(modelo.id), final_name)
        image = ModeloImage(modelo_id=modelo.id, path=relative_path)
        db.session.add(image)
        saved_images.append(image)

    db.session.commit()

    return {
        "message": "Imagenes cargadas correctamente",
        "images": [
            {
                "id": image.id,
                "path": image.path,
                "url": url_for("modelos.get_modelo_file", file_path=image.path, _external=True),
            }
            for image in saved_images
        ],
    }, 201


@modelo_bp.route("/<int:modelo_id>/images/<int:image_id>", methods=["DELETE"])
@jwt_required()
def delete_modelo_image(modelo_id, image_id):
    _require_admin()
    modelo = db.session.get(Modelo, modelo_id)
    if not modelo:
        abort(404, message="Modelo no encontrado")

    image = db.session.get(ModeloImage, image_id)
    if not image or image.modelo_id != modelo_id:
        abort(404, message="Imagen no encontrada para esta modelo")

    # path guardado como: modelos/<modelo_id>/<archivo>
    abs_path = Path(current_app.root_path) / image.path
    if abs_path.exists() and abs_path.is_file():
        abs_path.unlink()

    db.session.delete(image)
    db.session.commit()
    return {"message": "Imagen eliminada correctamente"}


@modelo_bp.route("/files/<path:file_path>", methods=["GET"])
def get_modelo_file(file_path):
    # Se espera formato: modelos/<modelo_id>/<archivo>.
    upload_root = _upload_root()
    normalized = Path(file_path)
    if not normalized.parts or normalized.parts[0] != "modelos":
        abort(404, message="Archivo no encontrado")

    relative_in_upload = Path(*normalized.parts[1:])
    directory = upload_root / relative_in_upload.parent
    filename = relative_in_upload.name

    if not directory.exists():
        abort(404, message="Archivo no encontrado")

    return send_from_directory(directory, filename)


@public_modelo_bp.route("", methods=["GET"])
def list_public_modelos():
    modelos = Modelo.query.order_by(Modelo.created_at.desc()).all()
    return {"items": [_serialize_modelo(modelo) for modelo in modelos]}


@public_modelo_bp.route("/<int:modelo_id>", methods=["GET"])
def get_public_modelo(modelo_id):
    modelo = db.session.get(Modelo, modelo_id)
    if not modelo:
        abort(404, message="Modelo no encontrado")
    return _serialize_modelo(modelo)
