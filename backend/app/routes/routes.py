"""Route management endpoints"""

from flask import request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models.route import Route
from app.models.stop import Stop
from app.routes import routes_bp

@routes_bp.route('', methods=['GET'])
def get_routes():
    """Get all active routes"""
    routes = Route.query.filter_by(is_active=True).all()
    return jsonify([route.to_dict() for route in routes]), 200

@routes_bp.route('/<int:route_id>', methods=['GET'])
def get_route(route_id):
    """Get route by ID"""
    route = Route.query.get(route_id)
    
    if not route:
        return jsonify({'error': 'Route not found'}), 404
    
    return jsonify(route.to_dict()), 200

@routes_bp.route('', methods=['POST'])
@jwt_required()
def create_route():
    """Create a new route (admin only)"""
    data = request.get_json()
    
    required_fields = ['name', 'start_point', 'end_point']
    if not data or not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    route = Route(
        name=data['name'],
        description=data.get('description'),
        start_point=data['start_point'],
        end_point=data['end_point'],
        distance_km=data.get('distance_km'),
        estimated_time_minutes=data.get('estimated_time_minutes')
    )
    
    db.session.add(route)
    db.session.commit()
    
    return jsonify({
        'message': 'Route created successfully',
        'route': route.to_dict()
    }), 201

@routes_bp.route('/<int:route_id>/stops', methods=['POST'])
@jwt_required()
def add_stop(route_id):
    """Add a stop to a route"""
    route = Route.query.get(route_id)
    
    if not route:
        return jsonify({'error': 'Route not found'}), 404
    
    data = request.get_json()
    required_fields = ['name', 'latitude', 'longitude', 'sequence']
    if not data or not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    stop = Stop(
        route_id=route_id,
        name=data['name'],
        latitude=data['latitude'],
        longitude=data['longitude'],
        sequence=data['sequence'],
        waiting_time_minutes=data.get('waiting_time_minutes', 5)
    )
    
    db.session.add(stop)
    db.session.commit()
    
    return jsonify({
        'message': 'Stop added successfully',
        'stop': stop.to_dict()
    }), 201
