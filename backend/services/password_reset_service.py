import hashlib
import hmac
import os
from datetime import datetime
from email.message import EmailMessage
from html import escape
from urllib.parse import quote

from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

from services.email_service import send_email_message


PASSWORD_RESET_SALT = "password-reset"
PASSWORD_RESET_EXPIRATION_SECONDS = int(os.getenv("PASSWORD_RESET_TOKEN_EXPIRES", "7200"))
MAIL_SENDER = os.getenv("MAIL_SENDER", os.getenv("EMAIL_ADDRESS"))
FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL", "http://localhost:5173").rstrip("/")


def _get_secret_key():
    return os.getenv("PASSWORD_RESET_SECRET_KEY") or os.getenv(
        "JWT_SECRET_KEY", "change-this-in-production"
    )


def _get_serializer():
    return URLSafeTimedSerializer(_get_secret_key())


def _build_password_fingerprint(password_hash):
    secret_key = _get_secret_key().encode("utf-8")
    return hmac.new(secret_key, password_hash.encode("utf-8"), hashlib.sha256).hexdigest()


def generate_password_reset_token(user):
    serializer = _get_serializer()
    return serializer.dumps(
        {
            "purpose": "password-reset",
            "user_id": user.id,
            "role": user.role,
            "pwd": _build_password_fingerprint(user.password_hash),
        },
        salt=PASSWORD_RESET_SALT,
    )


def validate_password_reset_token(token, user=None):
    serializer = _get_serializer()

    try:
        payload = serializer.loads(
            token,
            salt=PASSWORD_RESET_SALT,
            max_age=PASSWORD_RESET_EXPIRATION_SECONDS,
        )
    except (BadSignature, SignatureExpired) as exc:
        raise ValueError("Token invalido o expirado") from exc

    if payload.get("purpose") != "password-reset":
        raise ValueError("Token invalido o expirado")

    if user is not None:
        expected_fingerprint = _build_password_fingerprint(user.password_hash)
        received_fingerprint = payload.get("pwd", "")
        if not hmac.compare_digest(received_fingerprint, expected_fingerprint):
            raise ValueError("Token invalido o expirado")

    return payload


def build_password_reset_url(token):
    return f"{FRONTEND_BASE_URL}/restablecer-contrasena?token={quote(token)}"


def send_password_reset_email(user):
    reset_url = build_password_reset_url(generate_password_reset_token(user))
    current_year = datetime.utcnow().year
    safe_email = escape(user.email)
    safe_url = escape(reset_url, quote=True)

    message = EmailMessage()
    message["Subject"] = "Restablece tu contraseña de DUBAI EC"
    message["From"] = MAIL_SENDER
    message["To"] = user.email

    message.set_content(
        "\n".join(
            [
                "Recibimos una solicitud para restablecer tu contraseña de DUBAI EC.",
                "",
                "Haz clic en el siguiente enlace para crear una nueva contraseña:",
                reset_url,
                "",
                "Este enlace es valido por 2 horas.",
                "Si no solicitaste este cambio, puedes ignorar este mensaje.",
            ]
        )
    )

    message.add_alternative(
        f"""
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer contraseña</title>
  </head>
  <body style="margin:0;padding:0;background:#07080d;font-family:Arial,sans-serif;color:#e5e7eb;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#07080d;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#0f1724;border:1px solid rgba(255,255,255,0.1);border-radius:24px;overflow:hidden;">
            <tr>
              <td style="padding:32px 36px;background:linear-gradient(135deg,#a83d8e 0%,#1f7fd8 100%);text-align:center;">
                <div style="display:inline-block;padding:8px 14px;border:1px solid rgba(255,255,255,0.28);border-radius:999px;font-size:12px;font-weight:700;letter-spacing:0.12em;color:#fdf2f8;">
                  DUBAI EC
                </div>
                <h1 style="margin:18px 0 8px 0;color:#ffffff;font-size:30px;line-height:1.15;">
                  Restablece tu contraseña
                </h1>
                <p style="margin:0;color:#fce7f3;font-size:15px;line-height:1.6;">
                  Recibimos una solicitud para actualizar el acceso de tu cuenta de anunciante.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 36px;">
                <p style="margin:0 0 16px 0;font-size:15px;line-height:1.7;color:#d1d5db;">
                  Se solicito un cambio de contraseña para la cuenta <strong style="color:#ffffff;">{safe_email}</strong>.
                  Si fuiste tu, usa el siguiente boton para crear una nueva contraseña.
                </p>
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px 0 24px 0;">
                  <tr>
                    <td align="center" style="border-radius:14px;background:linear-gradient(135deg,#d4af37 0%,#f5d66e 100%);">
                      <a href="{safe_url}" target="_blank" rel="noreferrer" style="display:inline-block;padding:16px 26px;font-size:15px;font-weight:700;color:#111827;text-decoration:none;">
                        Cambiar contraseña
                      </a>
                    </td>
                  </tr>
                </table>
                <div style="padding:18px 20px;border-radius:18px;background:#111827;border:1px solid rgba(255,255,255,0.08);">
                  <p style="margin:0 0 10px 0;font-size:14px;font-weight:700;color:#ffffff;">Importante</p>
                  <p style="margin:0;font-size:14px;line-height:1.7;color:#cbd5e1;">
                    Este enlace es valido por <strong style="color:#f8fafc;">2 horas</strong>.
                    Si no solicitaste este cambio, ignora este correo y tu contraseña actual seguira funcionando.
                  </p>
                </div>
                <p style="margin:24px 0 0 0;font-size:13px;line-height:1.7;color:#94a3b8;">
                  Si el boton no abre correctamente, copia y pega esta URL en tu navegador:
                </p>
                <p style="margin:10px 0 0 0;word-break:break-all;font-size:13px;line-height:1.7;color:#93c5fd;">
                  <a href="{safe_url}" target="_blank" rel="noreferrer" style="color:#93c5fd;text-decoration:none;">{safe_url}</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 36px 28px 36px;border-top:1px solid rgba(255,255,255,0.08);">
                <p style="margin:0;font-size:12px;line-height:1.6;color:#6b7280;text-align:center;">
                  &copy; {current_year} DUBAI EC. Notificacion automatica de seguridad.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
        """,
        subtype="html",
    )

    send_email_message(message)
