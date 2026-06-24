"""Bus routes"""

from flask import request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models.bus import Bus
from app.routes import buses_bp

@buses_bp.route('', methods=['GET'])
def get_buses():
    """Get all active buses"""
    buses = Bus.query.filter_by(is_active=True).all()
    return jsonify([bus.to_dict() for bus in buses]), 200

@buses_bp.route('/<int:bus_id>', methods=['GET'])
def get_bus(bus_id):
    """Get bus by ID"""
    bus = Bus.query.get(bus_id)
    
    if not bus:
        return jsonify({'error': 'Bus not found'}), 404
    
    return jsonify(bus.to_dict()), 200

@buses_bp.route('', methods=['POST'])
@jwt_required()
def create_bus():
    """Create a new bus (admin only)"""
    data = request.get_json()
    
    if not data or not data.get('registration_number') or not data.get('capacity'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if Bus.query.filter_by(registration_number=data['registration_number']).first():
        return jsonify({'error': 'Bus already exists'}), 409
    
    bus = Bus(
        registration_number=data['registration_number'],
        capacity=data['capacity'],
        current_location=data.get('current_location'),
        latitude=data.get('latitude'),
        longitude=data.get('longitude')
    )
    
    db.session.add(bus)
    db.session.commit()
    
    return jsonify({
        'message': 'Bus created successfully',
        'bus': bus.to_dict()
    }), 201

@buses_bp.route('/<int:bus_id>/location', methods=['PUT'])
@jwt_required()
def update_bus_location(bus_id):
    """Update bus location"""
    bus = Bus.query.get(bus_id)
    
    if not bus:
        return jsonify({'error': 'Bus not found'}), 404
    
    data = request.get_json()
    bus.latitude = data.get('latitude', bus.latitude)
    bus.longitude = data.get('longitude', bus.longitude)
    bus.current_location = data.get('current_location', bus.current_location)
    bus.status = data.get('status', bus.status)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Bus location updated',
        'bus': bus.to_dict()
    }), 200
