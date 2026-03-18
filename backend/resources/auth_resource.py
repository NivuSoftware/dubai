from flask_jwt_extended import create_access_token
from flask_smorest import Blueprint, abort
from werkzeug.security import check_password_hash, generate_password_hash

from extensions import db
from models.user import User
from schemas.auth_schema import AdvertiserRegisterSchema, LoginSchema

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth", description="Autenticacion")


@auth_bp.route("/register-advertiser", methods=["POST"])
@auth_bp.arguments(AdvertiserRegisterSchema)
def register_advertiser(data):
    email = data["email"].strip().lower()
    password = data["password"]

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        abort(409, message="El correo ya esta registrado")

    user = User(
        email=email,
        password_hash=generate_password_hash(password),
        role="advertiser",
    )
    db.session.add(user)
    db.session.commit()

    token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role, "email": user.email},
    )

    return {
        "message": "Cuenta de anunciante creada",
        "access_token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "is_verified": user.is_verified,
            "is_verification_requested": user.is_verification_requested,
            "is_verification_rejected": user.is_verification_rejected,
            "has_used_free_trial": user.has_used_free_trial,
        },
    }, 201


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
            "is_verified": user.is_verified,
            "is_verification_requested": user.is_verification_requested,
            "is_verification_rejected": user.is_verification_rejected,
            "has_used_free_trial": user.has_used_free_trial,
        },
    }
