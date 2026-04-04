from datetime import datetime, timezone

from extensions import db


class Anuncio(db.Model):
    __tablename__ = "anuncios"

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    titulo = db.Column(db.String(180), nullable=False, index=True)
    descripcion = db.Column(db.Text, nullable=False)
    precio = db.Column(db.Numeric(10, 2, asdecimal=False), nullable=False, default=0)
    ubicacion = db.Column(db.String(150), nullable=False)
    contact_country_code = db.Column(db.String(8), nullable=True)
    contact_number = db.Column(db.String(20), nullable=True)
    estado = db.Column(db.String(30), nullable=False, default="PENDIENTE", index=True)
    pago = db.Column(db.String(30), nullable=False, default="PENDIENTE", index=True)
    is_draft = db.Column(db.Boolean, nullable=False, default=False, index=True)
    plan = db.Column(db.String(20), nullable=False)
    imagen_comprobante_pago = db.Column(db.String(500), nullable=False)
    fecha_hasta = db.Column(db.DateTime, nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc)
    )

    owner = db.relationship("User", back_populates="anuncios")
    images = db.relationship(
        "AnuncioImage",
        back_populates="anuncio",
        cascade="all, delete-orphan",
        order_by="AnuncioImage.id",
    )


class AnuncioImage(db.Model):
    __tablename__ = "anuncio_images"

    id = db.Column(db.Integer, primary_key=True)
    anuncio_id = db.Column(
        db.Integer, db.ForeignKey("anuncios.id", ondelete="CASCADE"), nullable=False, index=True
    )
    path = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    anuncio = db.relationship("Anuncio", back_populates="images")
