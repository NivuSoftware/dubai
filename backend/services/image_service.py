from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from flask_smorest import abort
from PIL import Image, ImageOps, UnidentifiedImageError
from werkzeug.datastructures import FileStorage


def save_normalized_image(file_storage: FileStorage, target_folder: Path, prefix: str) -> str:
    original_name = file_storage.filename or ""
    if not original_name:
        abort(400, message="Archivo de imagen invalido.")

    try:
        file_storage.stream.seek(0)
        with Image.open(file_storage.stream) as image:
            normalized = ImageOps.exif_transpose(image)
            output_format, extension = _select_output_format(normalized)

            if output_format == "JPEG":
                normalized = normalized.convert("RGB")
            elif normalized.mode not in ("RGB", "RGBA"):
                normalized = normalized.convert("RGBA")

            final_name = f"{prefix}_{uuid4().hex}.{extension}"
            absolute_path = target_folder / final_name

            save_kwargs = {"format": output_format}
            if output_format == "JPEG":
                save_kwargs.update({"quality": 90, "optimize": True})
            elif output_format == "PNG":
                save_kwargs.update({"optimize": True})
            elif output_format == "WEBP":
                save_kwargs.update({"quality": 90, "method": 6})

            normalized.save(absolute_path, **save_kwargs)
            return final_name
    except UnidentifiedImageError:
        abort(400, message="El archivo subido no es una imagen valida.")
    except OSError:
        abort(400, message="No se pudo procesar la imagen subida.")
    finally:
        file_storage.stream.seek(0)


def _select_output_format(image: Image.Image) -> tuple[str, str]:
    has_alpha = "A" in image.getbands()
    if has_alpha:
        return "PNG", "png"

    image_format = (image.format or "").upper()
    if image_format == "WEBP":
        return "WEBP", "webp"

    return "JPEG", "jpg"
