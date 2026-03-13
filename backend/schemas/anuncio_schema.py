from marshmallow import Schema, fields, validate


class AnuncioCreateSchema(Schema):
    titulo = fields.String(required=True, validate=validate.Length(min=3, max=180))
    descripcion = fields.String(required=True, validate=validate.Length(min=10))
    precio = fields.Float(required=True, validate=validate.Range(min=0))
    ubicacion = fields.String(required=True, validate=validate.Length(min=2, max=150))
    contact_country_code = fields.String(required=True, validate=validate.Length(min=2, max=8))
    contact_number = fields.String(required=True, validate=validate.Length(min=6, max=20))
    plan = fields.String(
        required=True, validate=validate.OneOf(["monthly", "quarterly", "semiannual"])
    )


class AnuncioUpdateSchema(Schema):
    titulo = fields.String(required=False, validate=validate.Length(min=3, max=180))
    descripcion = fields.String(required=False, validate=validate.Length(min=10))
    precio = fields.Float(required=False, validate=validate.Range(min=0))
    ubicacion = fields.String(required=False, validate=validate.Length(min=2, max=150))
    contact_country_code = fields.String(required=False, validate=validate.Length(min=2, max=8))
    contact_number = fields.String(required=False, validate=validate.Length(min=6, max=20))


class AnuncioImageSchema(Schema):
    id = fields.Integer(dump_only=True)
    path = fields.String(dump_only=True)
    url = fields.String(dump_only=True)


class AnuncioSchema(Schema):
    id = fields.Integer(dump_only=True)
    owner_id = fields.Integer(dump_only=True)
    titulo = fields.String(required=True)
    descripcion = fields.String(required=True)
    precio = fields.Float(required=True)
    ubicacion = fields.String(required=True)
    contact_country_code = fields.String(dump_only=True)
    contact_number = fields.String(dump_only=True)
    whatsapp_url = fields.String(dump_only=True)
    estado = fields.String(dump_only=True)
    pago = fields.String(dump_only=True)
    plan = fields.String(dump_only=True)
    imagen_comprobante_pago = fields.String(dump_only=True)
    imagen_comprobante_pago_url = fields.String(dump_only=True)
    fecha_hasta = fields.Date(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    images = fields.List(fields.Nested(AnuncioImageSchema), dump_only=True)
