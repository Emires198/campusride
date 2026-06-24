"""Wallet and payment routes"""

from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.student import Student, WalletTransaction
from app.routes import wallet_bp
import uuid
from datetime import datetime

@wallet_bp.route('/balance', methods=['GET'])
@jwt_required()
def get_balance():
    """Get current wallet balance"""
    student_id = get_jwt_identity()
    student = Student.query.get(student_id)
    
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    return jsonify({
        'student_id': student.id,
        'balance': student.wallet_balance,
        'total_spent': student.total_spent,
        'updated_at': student.updated_at.isoformat()
    }), 200

@wallet_bp.route('/add-money', methods=['POST'])
@jwt_required()
def add_money():
    """Add money to wallet"""
    student_id = get_jwt_identity()
    student = Student.query.get(student_id)
    
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    data = request.get_json()
    
    if not data or 'amount' not in data:
        return jsonify({'error': 'Amount is required'}), 400
    
    try:
        amount = float(data['amount'])
        if amount <= 0:
            return jsonify({'error': 'Amount must be positive'}), 400
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid amount'}), 400
    
    # Add money to wallet
    success = student.add_to_wallet(
        amount=amount,
        transaction_type='credit',
        description=data.get('description', 'Money added to wallet')
    )
    
    if not success:
        return jsonify({'error': 'Failed to add money'}), 400
    
    db.session.commit()
    
    return jsonify({
        'message': 'Money added successfully',
        'new_balance': student.wallet_balance,
        'transaction': WalletTransaction.query.filter_by(
            student_id=student_id
        ).order_by(WalletTransaction.created_at.desc()).first().to_dict()
    }), 201

@wallet_bp.route('/deduct', methods=['POST'])
@jwt_required()
def deduct_money():
    """Deduct money from wallet (internal use for booking)"""
    student_id = get_jwt_identity()
    student = Student.query.get(student_id)
    
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    data = request.get_json()
    
    if not data or 'amount' not in data:
        return jsonify({'error': 'Amount is required'}), 400
    
    try:
        amount = float(data['amount'])
        if amount <= 0:
            return jsonify({'error': 'Amount must be positive'}), 400
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid amount'}), 400
    
    if student.wallet_balance < amount:
        return jsonify({'error': 'Insufficient wallet balance'}), 400
    
    # Deduct money from wallet
    success = student.deduct_from_wallet(
        amount=amount,
        transaction_type='debit',
        description=data.get('description', 'Payment for bus fare')
    )
    
    if not success:
        return jsonify({'error': 'Failed to process payment'}), 400
    
    db.session.commit()
    
    return jsonify({
        'message': 'Payment processed successfully',
        'new_balance': student.wallet_balance,
        'amount_deducted': amount
    }), 200

@wallet_bp.route('/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    """Get wallet transaction history"""
    student_id = get_jwt_identity()
    student = Student.query.get(student_id)
    
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    # Get pagination parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    # Get transactions
    transactions = WalletTransaction.query.filter_by(
        student_id=student_id
    ).order_by(WalletTransaction.created_at.desc()).paginate(
        page=page, per_page=per_page
    )
    
    return jsonify({
        'student_id': student_id,
        'total': transactions.total,
        'pages': transactions.pages,
        'current_page': page,
        'transactions': [t.to_dict() for t in transactions.items]
    }), 200

@wallet_bp.route('/transactions/<int:transaction_id>', methods=['GET'])
@jwt_required()
def get_transaction(transaction_id):
    """Get single transaction details"""
    student_id = get_jwt_identity()
    transaction = WalletTransaction.query.get(transaction_id)
    
    if not transaction:
        return jsonify({'error': 'Transaction not found'}), 404
    
    if transaction.student_id != student_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify(transaction.to_dict()), 200

@wallet_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_summary():
    """Get wallet summary"""
    student_id = get_jwt_identity()
    student = Student.query.get(student_id)
    
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    # Get transaction statistics
    transactions = WalletTransaction.query.filter_by(student_id=student_id).all()
    
    total_credited = sum(t.amount for t in transactions if t.transaction_type == 'credit')
    total_debited = sum(t.amount for t in transactions if t.transaction_type == 'debit')
    
    summary = {
        'student_id': student_id,
        'current_balance': student.wallet_balance,
        'total_credited': total_credited,
        'total_debited': total_debited,
        'total_transactions': len(transactions),
        'last_transaction': transactions[-1].to_dict() if transactions else None
    }
    
    return jsonify(summary), 200
