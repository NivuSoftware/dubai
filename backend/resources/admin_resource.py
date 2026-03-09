from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required
from flask_smorest import Blueprint, abort

from extensions import db
from models.user import User

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin", description="Panel admin")


@admin_bp.route("/me", methods=["GET"])
@jwt_required()
def admin_me():
    claims = get_jwt()
    if claims.get("role") != "admin":
        abort(403, message="No tienes permisos de administrador")

    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    if not user:
        abort(404, message="Usuario no encontrado")

    return {
        "message": "Acceso admin autorizado",
        "user": user.to_dict(),
    }
