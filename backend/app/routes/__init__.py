"""API routes"""

from flask import Blueprint

student_bp = Blueprint('students', __name__)
buses_bp = Blueprint('buses', __name__)
routes_bp = Blueprint('routes', __name__)
bookings_bp = Blueprint('bookings', __name__)
wallet_bp = Blueprint('wallet', __name__)

from app.routes import student, buses, routes, bookings, wallet
