from marshmallow import Schema, fields, validate


class AdvertiserCreateSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True, load_only=True, validate=validate.Length(min=8))
    is_verified = fields.Boolean(required=False, load_default=False)
    is_verification_requested = fields.Boolean(required=False, load_default=False)
    is_verification_rejected = fields.Boolean(required=False, load_default=False)


class AdvertiserUpdateSchema(Schema):
    email = fields.Email(required=False)
    password = fields.String(required=False, load_only=True, validate=validate.Length(min=8))
    is_verified = fields.Boolean(required=False)
    is_verification_requested = fields.Boolean(required=False)
    is_verification_rejected = fields.Boolean(required=False)


class AdvertiserSchema(Schema):
    id = fields.Integer(dump_only=True)
    email = fields.Email(required=True)
    role = fields.String(dump_only=True)
    is_verified = fields.Boolean(dump_only=True)
    is_verification_requested = fields.Boolean(dump_only=True)
    is_verification_rejected = fields.Boolean(dump_only=True)
    has_used_free_trial = fields.Boolean(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
