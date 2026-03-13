import os
from datetime import date
from pathlib import Path
from uuid import uuid4

from flask import current_app, request
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required
from flask_smorest import Blueprint, abort
from werkzeug.utils import secure_filename

from extensions import db
from models.user import User
from models.verification_request import VerificationRequest

advertiser_bp = Blueprint(
    "advertiser",
    __name__,
    url_prefix="/api/advertiser",
    description="Panel anunciante",
)


@advertiser_bp.route("/me", methods=["GET"])
@jwt_required()
def advertiser_me():
    claims = get_jwt()
    if claims.get("role") != "advertiser":
        abort(403, message="No tienes permisos de anunciante")

    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    if not user:
        abort(404, message="Usuario no encontrado")

    return {
        "message": "Acceso anunciante autorizado",
        "user": user.to_dict(),
    }


@advertiser_bp.route("/request-verification", methods=["POST"])
@jwt_required()
def request_verification():
    claims = get_jwt()
    if claims.get("role") != "advertiser":
        abort(403, message="No tienes permisos de anunciante")

    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    if not user:
        abort(404, message="Usuario no encontrado")

    if user.is_verified:
        return {"message": "Tu cuenta ya está verificada", "is_verification_requested": False}

    existing_pending_request = VerificationRequest.query.filter_by(
        user_id=user.id, status="pending"
    ).first()
    if existing_pending_request or user.is_verification_requested:
        return {
            "message": "Tu solicitud de verificación ya está en revisión",
            "is_verification_requested": True,
        }

    full_name = (request.form.get("full_name") or "").strip()
    document_number = (request.form.get("document_number") or "").strip()
    birth_date_raw = (request.form.get("birth_date") or "").strip()

    if not full_name or not document_number or not birth_date_raw:
        abort(
            400,
            message=(
                "Debes completar nombre, número de cédula/pasaporte y fecha de nacimiento."
            ),
        )

    try:
        birth_date = date.fromisoformat(birth_date_raw)
    except ValueError:
        abort(400, message="Fecha de nacimiento inválida. Usa formato YYYY-MM-DD.")

    document_image = request.files.get("document_image")
    portrait_image = request.files.get("portrait_image")

    if not document_image or not portrait_image:
        abort(
            400,
            message=(
                "Debes enviar dos fotos: documento de identidad y foto tipo carnet de la persona."
            ),
        )

    upload_root = _verification_upload_root()
    user_folder = upload_root / str(user.id)
    user_folder.mkdir(parents=True, exist_ok=True)

    document_relative_path = _save_verification_file(document_image, user_folder, "document")
    portrait_relative_path = _save_verification_file(portrait_image, user_folder, "portrait")

    verification_request = VerificationRequest(
        user_id=user.id,
        full_name=full_name,
        document_number=document_number,
        birth_date=birth_date,
        document_image_path=document_relative_path,
        portrait_image_path=portrait_relative_path,
        status="pending",
    )
    db.session.add(verification_request)

    user.is_verification_requested = True
    user.is_verification_rejected = False
    db.session.commit()

    return {
        "message": "Solicitud de verificación enviada correctamente",
        "is_verification_requested": True,
        "request_id": verification_request.id,
    }


def _verification_upload_root() -> Path:
    upload_dir = current_app.config.get("VERIFICATION_UPLOAD_DIR", "verification_requests")
    root = Path(current_app.root_path) / upload_dir
    root.mkdir(parents=True, exist_ok=True)
    return root


def _allowed_file(filename: str) -> bool:
    allowed = current_app.config.get(
        "ALLOWED_IMAGE_EXTENSIONS", {"png", "jpg", "jpeg", "webp", "avif"}
    )
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed


def _save_verification_file(file_storage, user_folder: Path, prefix: str) -> str:
    original_name = file_storage.filename or ""
    if not original_name:
        abort(400, message="Archivo de verificación inválido.")
    if not _allowed_file(original_name):
        abort(400, message=f"Formato no permitido: {original_name}")

    safe_name = secure_filename(original_name)
    extension = safe_name.rsplit(".", 1)[1].lower()
    final_name = f"{prefix}_{uuid4().hex}.{extension}"
    absolute_path = user_folder / final_name
    file_storage.save(absolute_path)

    return os.path.join("verification_requests", user_folder.name, final_name)
