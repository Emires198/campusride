"""Schedule model for bus routes"""

from app import db
from datetime import datetime

class Schedule(db.Model):
    __tablename__ = 'schedules'
    
    id = db.Column(db.Integer, primary_key=True)
    route_id = db.Column(db.Integer, db.ForeignKey('routes.id'), nullable=False)
    bus_id = db.Column(db.Integer, db.ForeignKey('buses.id'), nullable=False)
    departure_time = db.Column(db.Time, nullable=False)
    arrival_time = db.Column(db.Time, nullable=False)
    day_of_week = db.Column(db.String(20))  # Monday, Tuesday, etc.
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    route = db.relationship('Route', backref='schedules')
    bus = db.relationship('Bus', backref='schedules')
    
    def to_dict(self):
        return {
            'id': self.id,
            'route_id': self.route_id,
            'bus_id': self.bus_id,
            'departure_time': self.departure_time.isoformat() if self.departure_time else None,
            'arrival_time': self.arrival_time.isoformat() if self.arrival_time else None,
            'day_of_week': self.day_of_week,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat()
        }
