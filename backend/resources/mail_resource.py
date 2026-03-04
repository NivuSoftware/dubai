from flask_smorest import Blueprint, abort
import smtplib
from email.message import EmailMessage
from schemas.mail_schema import MailSchema
import os
from datetime import datetime

mail_bp = Blueprint("mail", __name__, url_prefix="/api", description="Endpoints para envio de correos")

# SMTP config
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
MAIL_SENDER = os.getenv("MAIL_SENDER", EMAIL_ADDRESS)
MAIL_RECIPIENT = os.getenv("MAIL_RECIPIENT", "haylandsebastian5@gmail.com")


@mail_bp.route("/send-email", methods=["POST"])
@mail_bp.arguments(MailSchema)
@mail_bp.response(200, description="Correo enviado correctamente")
def send_email(data):
    """
    Enviar correo de contacto EFICORP-PCGerente
    """

    nombre = data.get("nombre")
    empresa = data.get("empresa") or "No especificada"
    telefono = data.get("telefono")
    email = data.get("email")
    mensaje = data.get("mensaje") or ""

    current_year = datetime.now().year

    try:
        msg = EmailMessage()
        msg["Subject"] = f"Nueva consulta web - {nombre}"
        msg["From"] = MAIL_SENDER
        msg["To"] = MAIL_RECIPIENT

        # ----------- PLAIN TEXT -----------
        msg.set_content(
            f"""
Nueva consulta recibida (EFICORP-PCGerente)

Nombre: {nombre}
Empresa: {empresa}
Telefono: {telefono}
Email: {email}
Mensaje: {mensaje}

Notificacion automatica - EFICORP-PCGerente Web
"""
        )

        # ----------- HTML PROFESIONAL -----------
        msg.add_alternative(
            f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva consulta EFICORP-PCGerente</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">

    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12); overflow: hidden;">
        <tr>
            <td style="background: linear-gradient(135deg, #0f172a, #1e3a8a); padding: 36px 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 30px; font-weight: 800; letter-spacing: -0.02em;">EFICORP-PCGerente</h1>
                <p style="color: #10b981; margin: 10px 0 0 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em;">Gestion contable y empresarial</p>
            </td>
        </tr>

        <tr>
            <td style="padding: 28px 36px 10px 36px; text-align: center;">
                <div style="background-color: #ecfeff; border: 1px solid #a7f3d0; border-radius: 12px; padding: 12px 18px; display: inline-block;">
                    <h2 style="color: #065f46; margin: 0; font-size: 18px; font-weight: 700;">Nueva consulta web</h2>
                </div>
                <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-top: 18px;">
                    Has recibido un nuevo mensaje a traves del formulario de contacto.
                </p>
            </td>
        </tr>

        <tr>
            <td style="padding: 0 36px 28px 36px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: separate; border-spacing: 0;">
                    <tr>
                        <td width="34%" style="background-color: #f8fafc; padding: 14px; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-radius: 8px 0 0 0; font-weight: 600; color: #475569; font-size: 13px;">Nombre</td>
                        <td style="background-color: #ffffff; padding: 14px; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; border-radius: 0 8px 0 0; color: #0f172a; font-weight: 600; font-size: 15px;">{nombre}</td>
                    </tr>
                    <tr>
                        <td style="background-color: #f8fafc; padding: 14px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-weight: 600; color: #475569; font-size: 13px;">Empresa</td>
                        <td style="background-color: #ffffff; padding: 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 500; font-size: 14px;">{empresa}</td>
                    </tr>
                    <tr>
                        <td style="background-color: #f8fafc; padding: 14px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-weight: 600; color: #475569; font-size: 13px;">Telefono</td>
                        <td style="background-color: #ffffff; padding: 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 500; font-size: 14px;">
                            <a href="tel:{telefono}" style="color: #0f172a; text-decoration: none;">{telefono}</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f8fafc; padding: 14px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-weight: 600; color: #475569; font-size: 13px;">Email</td>
                        <td style="background-color: #ffffff; padding: 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 500; font-size: 14px;">
                            <a href="mailto:{email}" style="color: #1e3a8a; text-decoration: none;">{email}</a>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding-top: 18px;">
                            <p style="margin: 0 0 8px 0; font-weight: 600; color: #475569; font-size: 13px;">Mensaje</p>
                            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; color: #334155; font-size: 14px; line-height: 1.6;">
                                {mensaje}
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <tr>
            <td style="background-color: #f8fafc; padding: 22px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0 0 8px 0;">Mensaje enviado desde el sitio web de EFICORP-PCGerente.</p>
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; {current_year} EFICORP-PCGerente. Todos los derechos reservados.</p>
            </td>
        </tr>
    </table>

</body>
</html>
            """,
            subtype="html",
        )

        # ----------- ENVIO DEL CORREO -----------
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as smtp:
            smtp.starttls()
            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            smtp.send_message(msg)

        return {"success": True, "message": "Correo enviado correctamente"}

    except Exception as e:
        print("Error al enviar correo:", repr(e))
        abort(500, message=f"No se pudo enviar el correo: {str(e)}")
