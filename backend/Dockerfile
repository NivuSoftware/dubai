# Imagen base configurable.
# Default local para entornos sin acceso a registries (ya existe: dubai-backend:latest).
ARG PYTHON_BASE_IMAGE=dubai-backend:latest
FROM ${PYTHON_BASE_IMAGE}

# Establecer directorio de trabajo
WORKDIR /app

# Copiar requirements y la app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del código
COPY . .

# Exponer puerto Flask
EXPOSE 5000

# Ejecutar migraciones y luego iniciar app
CMD ["sh", "-c", "flask --app app db upgrade && python app.py"]
