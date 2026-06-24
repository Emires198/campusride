"""Student model - Extended User with student-specific attributes"""

from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class Student(db.Model):
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    registration_number = db.Column(db.String(50), unique=True, nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    password_hash = db.Column(db.String(255), nullable=False)
    
    # Student-specific fields
    level = db.Column(db.String(20), nullable=False)  # 100, 200, 300, 400, 500, 600
    hostel = db.Column(db.String(50), nullable=False)  # A, B, C, D, E
    admission_year = db.Column(db.Integer)
    department = db.Column(db.String(100))
    
    # Wallet/Payment
    wallet_balance = db.Column(db.Float, default=0.0)
    total_spent = db.Column(db.Float, default=0.0)
    
    # Account status
    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # Relationships
    bookings = db.relationship('Booking', backref='student', foreign_keys='Booking.student_id', lazy=True)
    wallet_transactions = db.relationship('WalletTransaction', backref='student', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def add_to_wallet(self, amount, transaction_type='credit', description=''):
        """Add money to wallet"""
        if amount <= 0:
            return False
        
        self.wallet_balance += amount
        transaction = WalletTransaction(
            student_id=self.id,
            amount=amount,
            transaction_type=transaction_type,
            description=description,
            balance_after=self.wallet_balance
        )
        db.session.add(transaction)
        return True
    
    def deduct_from_wallet(self, amount, transaction_type='debit', description=''):
        """Deduct money from wallet"""
        if amount <= 0 or amount > self.wallet_balance:
            return False
        
        self.wallet_balance -= amount
        self.total_spent += amount
        transaction = WalletTransaction(
            student_id=self.id,
            amount=amount,
            transaction_type=transaction_type,
            description=description,
            balance_after=self.wallet_balance
        )
        db.session.add(transaction)
        return True
    
    def to_dict(self):
        return {
            'id': self.id,
            'registration_number': self.registration_number,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'level': self.level,
            'hostel': self.hostel,
            'admission_year': self.admission_year,
            'department': self.department,
            'wallet_balance': self.wallet_balance,
            'total_spent': self.total_spent,
            'is_active': self.is_active,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat(),
            'last_login': self.last_login.isoformat() if self.last_login else None
        }
    
    def to_dict_public(self):
        """Public profile - limited info"""
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'level': self.level,
            'hostel': self.hostel,
            'registration_number': self.registration_number
        }


class WalletTransaction(db.Model):
    __tablename__ = 'wallet_transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    transaction_type = db.Column(db.String(20), nullable=False)  # credit, debit
    description = db.Column(db.Text)
    balance_after = db.Column(db.Float, nullable=False)
    reference_number = db.Column(db.String(100), unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'amount': self.amount,
            'transaction_type': self.transaction_type,
            'description': self.description,
            'balance_after': self.balance_after,
            'reference_number': self.reference_number,
            'created_at': self.created_at.isoformat()
        }
