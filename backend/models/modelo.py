from datetime import datetime

from extensions import db


class Modelo(db.Model):
    __tablename__ = "modelos"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False, index=True)
    edad = db.Column(db.Integer, nullable=False)
    descripcion = db.Column(db.Text, nullable=False)
    disponibilidad = db.Column(db.String(120), nullable=False)
    ubicacion = db.Column(db.String(150), nullable=False)
    categoria = db.Column(db.String(120), nullable=False)
    precio = db.Column(db.Numeric(10, 2, asdecimal=False), nullable=False, default=0)
    owner_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True
    )
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    images = db.relationship(
        "ModeloImage",
        back_populates="modelo",
        cascade="all, delete-orphan",
        order_by="ModeloImage.id",
    )
    owner = db.relationship("User", back_populates="modelos")


class ModeloImage(db.Model):
    __tablename__ = "modelo_images"

    id = db.Column(db.Integer, primary_key=True)
    modelo_id = db.Column(
        db.Integer, db.ForeignKey("modelos.id", ondelete="CASCADE"), nullable=False, index=True
    )
    path = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    modelo = db.relationship("Modelo", back_populates="images")
