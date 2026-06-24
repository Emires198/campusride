"""Flask application factory"""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'DATABASE_URL',
        'postgresql://user:password@localhost/campusride'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-this')
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)
    
    # Register blueprints
    from app.routes import student_bp, buses_bp, routes_bp, bookings_bp, wallet_bp
    
    app.register_blueprint(student_bp, url_prefix='/api/students')
    app.register_blueprint(buses_bp, url_prefix='/api/buses')
    app.register_blueprint(routes_bp, url_prefix='/api/routes')
    app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
    app.register_blueprint(wallet_bp, url_prefix='/api/wallet')
    
    # Health check endpoint
    @app.route('/api/health')
    def health():
        return {'status': 'ok', 'service': 'CampusRide API'}, 200
    
    return app
