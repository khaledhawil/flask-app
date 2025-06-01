from flask import Blueprint

# Create API blueprint
api_bp = Blueprint('api', __name__)

# Import route handlers
from .islamic_content import bp as islamic_content_bp

# Register sub-blueprints with the API blueprint
api_bp.register_blueprint(islamic_content_bp, url_prefix='/quran')

# Import API routes module to register the routes with blueprint decorators
from . import api