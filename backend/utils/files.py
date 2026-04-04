from flask import current_app


def allowed_image_file(filename: str) -> bool:
    allowed = current_app.config.get(
        "ALLOWED_IMAGE_EXTENSIONS", {"png", "jpg", "jpeg", "webp", "avif"}
    )
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed
