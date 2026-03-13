from datetime import datetime

from extensions import db


class VerificationRequest(db.Model):
    __tablename__ = "verification_requests"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    full_name = db.Column(db.String(255), nullable=False)
    document_number = db.Column(db.String(50), nullable=False, index=True)
    birth_date = db.Column(db.Date, nullable=False)
    document_image_path = db.Column(db.String(500), nullable=False)
    portrait_image_path = db.Column(db.String(500), nullable=False)
    status = db.Column(db.String(30), nullable=False, default="pending", index=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    user = db.relationship("User", back_populates="verification_requests")
