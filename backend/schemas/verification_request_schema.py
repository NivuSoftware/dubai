from marshmallow import Schema, fields


class VerificationRequestSchema(Schema):
    id = fields.Integer(dump_only=True)
    user_id = fields.Integer(dump_only=True)
    advertiser_email = fields.Email(dump_only=True)
    full_name = fields.String(dump_only=True)
    document_number = fields.String(dump_only=True)
    birth_date = fields.Date(dump_only=True)
    document_image_path = fields.String(dump_only=True)
    portrait_image_path = fields.String(dump_only=True)
    status = fields.String(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
