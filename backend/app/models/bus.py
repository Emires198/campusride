"""Bus model"""

from app import db
from datetime import datetime

class Bus(db.Model):
    __tablename__ = 'buses'
    
    id = db.Column(db.Integer, primary_key=True)
    registration_number = db.Column(db.String(50), unique=True, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    current_location = db.Column(db.String(255))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    status = db.Column(db.String(20), default='idle')  # idle, in_transit, maintenance
    driver_id = db.Column(db.Integer)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'registration_number': self.registration_number,
            'capacity': self.capacity,
            'current_location': self.current_location,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'status': self.status,
            'driver_id': self.driver_id,
            'is_active': self.is_active,
            'updated_at': self.updated_at.isoformat()
        }
