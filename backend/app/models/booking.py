"""Booking model"""

from app import db
from datetime import datetime

class Booking(db.Model):
    __tablename__ = 'bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    bus_id = db.Column(db.Integer, db.ForeignKey('buses.id'), nullable=False)
    route_id = db.Column(db.Integer, db.ForeignKey('routes.id'), nullable=False)
    pickup_stop = db.Column(db.String(100), nullable=False)
    dropoff_stop = db.Column(db.String(100), nullable=False)
    booking_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, in_transit, completed, cancelled
    seat_number = db.Column(db.String(10))
    fare_amount = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    bus = db.relationship('Bus', backref='bookings')
    route = db.relationship('Route', backref='bookings')
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'bus_id': self.bus_id,
            'route_id': self.route_id,
            'pickup_stop': self.pickup_stop,
            'dropoff_stop': self.dropoff_stop,
            'booking_date': self.booking_date.isoformat(),
            'status': self.status,
            'seat_number': self.seat_number,
            'fare_amount': self.fare_amount,
            'created_at': self.created_at.isoformat()
        }
