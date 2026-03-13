from datetime import datetime

from extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False, default="advertiser")
    is_verified = db.Column(db.Boolean, nullable=False, default=False)
    is_verification_requested = db.Column(db.Boolean, nullable=False, default=False)
    is_verification_rejected = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    modelos = db.relationship("Modelo", back_populates="owner")
    anuncios = db.relationship(
        "Anuncio",
        back_populates="owner",
        cascade="all, delete-orphan",
        order_by="Anuncio.created_at.desc()",
    )
    verification_requests = db.relationship(
        "VerificationRequest",
        back_populates="user",
        cascade="all, delete-orphan",
        order_by="VerificationRequest.created_at.desc()",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role,
            "is_verified": self.is_verified,
            "is_verification_requested": self.is_verification_requested,
            "is_verification_rejected": self.is_verification_rejected,
            "created_at": self.created_at.isoformat(),
        }
