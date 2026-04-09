from datetime import datetime, timezone

from flask import Blueprint, Response

from extensions import db
from models.anuncio import Anuncio
from models.modelo import Modelo

sitemap_bp = Blueprint("sitemap", __name__)

SITE_URL = "https://dubaiec.net"

STATIC_PAGES = [
    {"loc": "/", "changefreq": "daily", "priority": "1.0"},
    {"loc": "/profiles", "changefreq": "daily", "priority": "0.9"},
    {"loc": "/about", "changefreq": "monthly", "priority": "0.6"},
    {"loc": "/safety", "changefreq": "monthly", "priority": "0.6"},
    {"loc": "/contact", "changefreq": "monthly", "priority": "0.5"},
    {"loc": "/registro-anunciante", "changefreq": "weekly", "priority": "0.4"},
]


@sitemap_bp.route("/sitemap.xml", methods=["GET"])
def sitemap():
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    urls = []

    for page in STATIC_PAGES:
        urls.append(
            f"  <url>\n"
            f"    <loc>{SITE_URL}{page['loc']}</loc>\n"
            f"    <lastmod>{today}</lastmod>\n"
            f"    <changefreq>{page['changefreq']}</changefreq>\n"
            f"    <priority>{page['priority']}</priority>\n"
            f"  </url>"
        )

    now = datetime.now(timezone.utc)
    anuncios = (
        Anuncio.query.filter_by(estado="ACTIVO", pago="PAGADO")
        .filter(Anuncio.fecha_hasta >= now)
        .order_by(Anuncio.created_at.desc())
        .all()
    )
    for anuncio in anuncios:
        lastmod = anuncio.updated_at.strftime("%Y-%m-%d") if anuncio.updated_at else today
        urls.append(
            f"  <url>\n"
            f"    <loc>{SITE_URL}/profile/a-{anuncio.id}</loc>\n"
            f"    <lastmod>{lastmod}</lastmod>\n"
            f"    <changefreq>weekly</changefreq>\n"
            f"    <priority>0.8</priority>\n"
            f"  </url>"
        )

    modelos = Modelo.query.order_by(Modelo.created_at.desc()).all()
    for modelo in modelos:
        lastmod = modelo.updated_at.strftime("%Y-%m-%d") if modelo.updated_at else today
        urls.append(
            f"  <url>\n"
            f"    <loc>{SITE_URL}/profile/m-{modelo.id}</loc>\n"
            f"    <lastmod>{lastmod}</lastmod>\n"
            f"    <changefreq>weekly</changefreq>\n"
            f"    <priority>0.8</priority>\n"
            f"  </url>"
        )

    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(urls)
        + "\n</urlset>"
    )

    return Response(xml, mimetype="application/xml")
