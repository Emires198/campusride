"""Schedule management endpoints"""

from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required
from app import db
from app.models.schedule import Schedule
from app.models.route import Route
from app.models.bus import Bus
from datetime import datetime, time

schedule_bp = Blueprint('schedules', __name__)

@schedule_bp.route('', methods=['GET'])
def get_schedules():
    """Get all schedules"""
    day = request.args.get('day')
    if day:
        schedules = Schedule.query.filter_by(day_of_week=day, is_active=True).all()
    else:
        schedules = Schedule.query.filter_by(is_active=True).all()
    return jsonify([s.to_dict() for s in schedules]), 200

@schedule_bp.route('/<int:schedule_id>', methods=['GET'])
def get_schedule(schedule_id):
    """Get schedule by ID"""
    schedule = Schedule.query.get(schedule_id)
    if not schedule:
        return jsonify({'error': 'Schedule not found'}), 404
    return jsonify(schedule.to_dict()), 200

@schedule_bp.route('', methods=['POST'])
@jwt_required()
def create_schedule():
    """Create a new schedule (admin only)"""
    data = request.get_json()
    
    required_fields = ['route_id', 'bus_id', 'departure_time', 'arrival_time']
    if not data or not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        departure = datetime.strptime(data['departure_time'], '%H:%M').time()
        arrival = datetime.strptime(data['arrival_time'], '%H:%M').time()
    except ValueError:
        return jsonify({'error': 'Invalid time format. Use HH:MM'}), 400
    
    schedule = Schedule(
        route_id=data['route_id'],
        bus_id=data['bus_id'],
        departure_time=departure,
        arrival_time=arrival,
        day_of_week=data.get('day_of_week')
    )
    
    db.session.add(schedule)
    db.session.commit()
    
    return jsonify({
        'message': 'Schedule created successfully',
        'schedule': schedule.to_dict()
    }), 201

@schedule_bp.route('/<int:schedule_id>', methods=['PUT'])
@jwt_required()
def update_schedule(schedule_id):
    """Update schedule"""
    schedule = Schedule.query.get(schedule_id)
    if not schedule:
        return jsonify({'error': 'Schedule not found'}), 404
    
    data = request.get_json()
    
    if 'departure_time' in data:
        try:
            schedule.departure_time = datetime.strptime(data['departure_time'], '%H:%M').time()
        except ValueError:
            return jsonify({'error': 'Invalid time format'}), 400
    
    if 'arrival_time' in data:
        try:
            schedule.arrival_time = datetime.strptime(data['arrival_time'], '%H:%M').time()
        except ValueError:
            return jsonify({'error': 'Invalid time format'}), 400
    
    if 'day_of_week' in data:
        schedule.day_of_week = data['day_of_week']
    
    db.session.commit()
    return jsonify(schedule.to_dict()), 200

@schedule_bp.route('/<int:schedule_id>', methods=['DELETE'])
@jwt_required()
def delete_schedule(schedule_id):
    """Delete schedule (soft delete)"""
    schedule = Schedule.query.get(schedule_id)
    if not schedule:
        return jsonify({'error': 'Schedule not found'}), 404
    
    schedule.is_active = False
    db.session.commit()
    
    return jsonify({'message': 'Schedule deleted successfully'}), 200
