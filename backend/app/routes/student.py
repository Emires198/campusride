"""Student authentication and profile routes"""

from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models.student import Student
from app.routes import student_bp
from datetime import datetime

@student_bp.route('/register', methods=['POST'])
def register():
    """Register a new student"""
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['registration_number', 'first_name', 'last_name', 'email', 'password', 'level', 'hostel']
    if not data or not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields', 'required': required_fields}), 400
    
    # Check if student already exists
    if Student.query.filter_by(registration_number=data['registration_number']).first():
        return jsonify({'error': 'Registration number already exists'}), 409
    
    if Student.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 409
    
    # Validate level
    valid_levels = ['100', '200', '300', '400', '500', '600']
    if data['level'] not in valid_levels:
        return jsonify({'error': f'Invalid level. Must be one of: {valid_levels}'}), 400
    
    # Validate hostel
    valid_hostels = ['A', 'B', 'C', 'D', 'E']
    if data['hostel'].upper() not in valid_hostels:
        return jsonify({'error': f'Invalid hostel. Must be one of: {valid_hostels}'}), 400
    
    # Create new student
    student = Student(
        registration_number=data['registration_number'],
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        phone=data.get('phone'),
        level=data['level'],
        hostel=data['hostel'].upper(),
        admission_year=data.get('admission_year'),
        department=data.get('department'),
        is_verified=False
    )
    student.set_password(data['password'])
    
    db.session.add(student)
    db.session.commit()
    
    return jsonify({
        'message': 'Student registered successfully',
        'student': student.to_dict()
    }), 201

@student_bp.route('/login', methods=['POST'])
def login():
    """Login student"""
    data = request.get_json()
    
    if not data or not data.get('registration_number') or not data.get('password'):
        return jsonify({'error': 'Missing registration_number or password'}), 400
    
    student = Student.query.filter_by(registration_number=data['registration_number']).first()
    
    if not student or not student.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    if not student.is_active:
        return jsonify({'error': 'Account is inactive'}), 403
    
    # Update last login
    student.last_login = datetime.utcnow()
    db.session.commit()
    
    # Create JWT token
    access_token = create_access_token(identity=student.id)
    
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'student': student.to_dict()
    }), 200

@student_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current student profile"""
    student_id = get_jwt_identity()
    student = Student.query.get(student_id)
    
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    return jsonify(student.to_dict()), 200

@student_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update student profile"""
    student_id = get_jwt_identity()
    student = Student.query.get(student_id)
    
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    data = request.get_json()
    
    # Update allowed fields
    allowed_fields = ['first_name', 'last_name', 'phone', 'department']
    for field in allowed_fields:
        if field in data:
            setattr(student, field, data[field])
    
    # Hostel change (validate)
    if 'hostel' in data:
        valid_hostels = ['A', 'B', 'C', 'D', 'E']
        if data['hostel'].upper() not in valid_hostels:
            return jsonify({'error': f'Invalid hostel'}), 400
        student.hostel = data['hostel'].upper()
    
    db.session.commit()
    
    return jsonify({
        'message': 'Profile updated successfully',
        'student': student.to_dict()
    }), 200

@student_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    """Get student dashboard with summary info"""
    student_id = get_jwt_identity()
    student = Student.query.get(student_id)
    
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    # Get booking statistics
    from app.models.booking import Booking
    total_bookings = Booking.query.filter_by(student_id=student_id).count()
    completed_bookings = Booking.query.filter_by(student_id=student_id, status='completed').count()
    pending_bookings = Booking.query.filter_by(student_id=student_id, status='pending').count()
    
    dashboard_data = {
        'student': student.to_dict(),
        'wallet': {
            'balance': student.wallet_balance,
            'total_spent': student.total_spent
        },
        'bookings': {
            'total': total_bookings,
            'completed': completed_bookings,
            'pending': pending_bookings
        },
        'recent_transactions': [
            t.to_dict() for t in student.wallet_transactions[-5:]
        ]
    }
    
    return jsonify(dashboard_data), 200

@student_bp.route('/<int:student_id>/public', methods=['GET'])
def get_student_public(student_id):
    """Get public student profile"""
    student = Student.query.get(student_id)
    
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    return jsonify(student.to_dict_public()), 200
