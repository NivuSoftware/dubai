from werkzeug.security import generate_password_hash

from extensions import db
from models.user import User


ADMIN_EMAIL = "admin@dubai.com"
ADMIN_PASSWORD = "admindubai*2026"


def seed_admin_user():
    existing_user = User.query.filter_by(email=ADMIN_EMAIL).first()
    if existing_user:
        return False

    user = User(
        email=ADMIN_EMAIL,
        password_hash=generate_password_hash(ADMIN_PASSWORD),
        role="admin",
    )
    db.session.add(user)
    db.session.commit()
    return True
