import os
import smtplib
from email.message import EmailMessage


EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))


def send_email_message(message: EmailMessage):
    if not EMAIL_ADDRESS or not EMAIL_PASSWORD:
        raise RuntimeError("Falta configurar EMAIL_ADDRESS o EMAIL_PASSWORD en el entorno")

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as smtp:
        smtp.starttls()
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        smtp.send_message(message)
