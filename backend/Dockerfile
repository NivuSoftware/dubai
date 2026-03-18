# Imagen base configurable.
# Por defecto usa una imagen oficial de Python para evitar depender
# de una etiqueta local inexistente.
ARG PYTHON_BASE_IMAGE=python:3.11-slim
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
