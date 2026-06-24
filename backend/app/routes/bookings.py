"""Booking routes"""

from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.booking import Booking
from app.models.student import Student
from app.routes import bookings_bp
from datetime import datetime

@bookings_bp.route('', methods=['GET'])
@jwt_required()
def get_bookings():
    """Get student's bookings"""
    student_id = get_jwt_identity()
    bookings = Booking.query.filter_by(student_id=student_id).all()
    return jsonify([booking.to_dict() for booking in bookings]), 200

@bookings_bp.route('/<int:booking_id>', methods=['GET'])
@jwt_required()
def get_booking(booking_id):
    """Get booking by ID"""
    student_id = get_jwt_identity()
    booking = Booking.query.get(booking_id)
    
    if not booking:
        return jsonify({'error': 'Booking not found'}), 404
    
    if booking.student_id != student_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify(booking.to_dict()), 200

@bookings_bp.route('', methods=['POST'])
@jwt_required()
def create_booking():
    """Create a new booking"""
    student_id = get_jwt_identity()
    student = Student.query.get(student_id)
    
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    data = request.get_json()
    
    required_fields = ['bus_id', 'route_id', 'pickup_stop', 'dropoff_stop', 'booking_date']
    if not data or not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields', 'required': required_fields}), 400
    
    try:
        booking_date = datetime.fromisoformat(data['booking_date'])
    except ValueError:
        return jsonify({'error': 'Invalid booking date format. Use ISO format: YYYY-MM-DDTHH:MM:SS'}), 400
    
    # Get fare amount if provided, default to 100
    fare_amount = data.get('fare_amount', 100)
    
    # Check if student has sufficient balance
    if student.wallet_balance < fare_amount:
        return jsonify({
            'error': 'Insufficient wallet balance',
            'required': fare_amount,
            'available': student.wallet_balance
        }), 400
    
    # Create booking
    booking = Booking(
        student_id=student_id,
        bus_id=data['bus_id'],
        route_id=data['route_id'],
        pickup_stop=data['pickup_stop'],
        dropoff_stop=data['dropoff_stop'],
        booking_date=booking_date,
        seat_number=data.get('seat_number'),
        fare_amount=fare_amount,
        status='pending'
    )
    
    # Deduct fare from wallet
    student.deduct_from_wallet(
        amount=fare_amount,
        transaction_type='debit',
        description=f"Bus fare: {data['pickup_stop']} to {data['dropoff_stop']}"
    )
    
    db.session.add(booking)
    db.session.commit()
    
    return jsonify({
        'message': 'Booking created successfully',
        'booking': booking.to_dict(),
        'wallet_balance': student.wallet_balance
    }), 201

@bookings_bp.route('/<int:booking_id>/confirm', methods=['PUT'])
@jwt_required()
def confirm_booking(booking_id):
    """Confirm a booking"""
    student_id = get_jwt_identity()
    booking = Booking.query.get(booking_id)
    
    if not booking:
        return jsonify({'error': 'Booking not found'}), 404
    
    if booking.student_id != student_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    booking.status = 'confirmed'
    db.session.commit()
    
    return jsonify({
        'message': 'Booking confirmed',
        'booking': booking.to_dict()
    }), 200

@bookings_bp.route('/<int:booking_id>/cancel', methods=['PUT'])
@jwt_required()
def cancel_booking(booking_id):
    """Cancel a booking"""
    student_id = get_jwt_identity()
    booking = Booking.query.get(booking_id)
    
    if not booking:
        return jsonify({'error': 'Booking not found'}), 404
    
    if booking.student_id != student_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    if booking.status == 'cancelled':
        return jsonify({'error': 'Booking already cancelled'}), 400
    
    # Refund the fare
    student = Student.query.get(student_id)
    student.add_to_wallet(
        amount=booking.fare_amount,
        transaction_type='credit',
        description=f"Refund for cancelled booking: {booking.pickup_stop} to {booking.dropoff_stop}"
    )
    
    booking.status = 'cancelled'
    db.session.commit()
    
    return jsonify({
        'message': 'Booking cancelled successfully',
        'booking': booking.to_dict(),
        'refunded_amount': booking.fare_amount,
        'wallet_balance': student.wallet_balance
    }), 200
