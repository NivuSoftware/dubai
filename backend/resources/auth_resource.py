from flask_jwt_extended import create_access_token
from flask_smorest import Blueprint, abort
from werkzeug.security import check_password_hash

from models.user import User
from schemas.auth_schema import LoginSchema

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth", description="Autenticacion")


@auth_bp.route("/login", methods=["POST"])
@auth_bp.arguments(LoginSchema)
def login(data):
    email = data["email"].strip().lower()
    password = data["password"]

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        abort(401, message="Credenciales invalidas")

    token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role, "email": user.email},
    )

    return {
        "access_token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
        },
    }
