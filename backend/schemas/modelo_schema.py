from marshmallow import Schema, fields, validate


class ModeloCreateSchema(Schema):
    nombre = fields.String(required=True, validate=validate.Length(min=2, max=120))
    edad = fields.Integer(required=True, validate=validate.Range(min=18, max=99))
    descripcion = fields.String(required=True, validate=validate.Length(min=10))
    disponibilidad = fields.String(required=True, validate=validate.Length(min=2, max=120))
    ubicacion = fields.String(required=True, validate=validate.Length(min=2, max=150))
    categoria = fields.String(required=True, validate=validate.Length(min=2, max=120))
    precio = fields.Float(required=True, validate=validate.Range(min=0))


class ModeloImageSchema(Schema):
    id = fields.Integer(dump_only=True)
    path = fields.String(dump_only=True)
    url = fields.String(dump_only=True)


class ModeloSchema(Schema):
    id = fields.Integer(dump_only=True)
    owner_id = fields.Integer(dump_only=True, allow_none=True)
    nombre = fields.String(required=True)
    edad = fields.Integer(required=True)
    descripcion = fields.String(required=True)
    disponibilidad = fields.String(required=True)
    ubicacion = fields.String(required=True)
    categoria = fields.String(required=True)
    precio = fields.Float(required=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    images = fields.List(fields.Nested(ModeloImageSchema), dump_only=True)
