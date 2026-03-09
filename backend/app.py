import os
import time

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_smorest import Api
from dotenv import load_dotenv

from extensions import db, migrate
import models  # noqa: F401
from resources.admin_resource import admin_bp
from resources.auth_resource import auth_bp
from resources.mail_resource import mail_bp
from resources.modelo_resource import modelo_bp, public_modelo_bp
from seed import seed_admin_user

load_dotenv()


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config["API_TITLE"] = "Dubai API"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_URL_PREFIX"] = "/"
    app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger-ui"
    app.config["OPENAPI_SWAGGER_UI_URL"] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://dubai_user:dubai_password@postgres:5432/dubai_db",
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "change-this-in-production")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", "86400"))
    app.config["MODEL_UPLOAD_DIR"] = os.getenv("MODEL_UPLOAD_DIR", "modelos")

    db.init_app(app)
    migrate.init_app(app, db)
    JWTManager(app)

    api = Api(app)
    api.register_blueprint(mail_bp)
    api.register_blueprint(auth_bp)
    api.register_blueprint(admin_bp)
    api.register_blueprint(modelo_bp)
    api.register_blueprint(public_modelo_bp)

    with app.app_context():
        seed_admin_with_retry()

    return app


def seed_admin_with_retry(max_retries=10, wait_seconds=2):
    for attempt in range(1, max_retries + 1):
        try:
            seeded = seed_admin_user()
            if seeded:
                print("Seeder: usuario admin creado")
            else:
                print("Seeder: usuario admin ya existe")
            return
        except Exception as exc:
            if attempt == max_retries:
                print("Seeder omitido: aplica migraciones con `flask db upgrade` y reinicia.")
                return
            print(f"DB no lista para seeder (intento {attempt}/{max_retries}), reintentando...")
            time.sleep(wait_seconds)


app = create_app()


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
