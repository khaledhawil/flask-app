from flask import Blueprint

routes = Blueprint('routes', __name__)

from . import main_routes  # Import your route handlers here
