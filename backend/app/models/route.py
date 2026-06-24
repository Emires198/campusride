"""Route model"""

from app import db
from datetime import datetime

class Route(db.Model):
    __tablename__ = 'routes'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    start_point = db.Column(db.String(100), nullable=False)
    end_point = db.Column(db.String(100), nullable=False)
    distance_km = db.Column(db.Float)
    estimated_time_minutes = db.Column(db.Integer)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    stops = db.relationship('Stop', backref='route', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'start_point': self.start_point,
            'end_point': self.end_point,
            'distance_km': self.distance_km,
            'estimated_time_minutes': self.estimated_time_minutes,
            'is_active': self.is_active,
            'stops': [stop.to_dict() for stop in self.stops]
        }
