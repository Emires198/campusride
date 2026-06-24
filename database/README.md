# Database Setup

## PostgreSQL Installation

### Windows
1. Download from https://www.postgresql.org/download/windows/
2. Run installer
3. Note the password for postgres user

### macOS
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Database Creation

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE campusride;

# Create user
CREATE USER campusride_user WITH PASSWORD 'secure_password';

# Grant privileges
ALTER ROLE campusride_user SET client_encoding TO 'utf8';
ALTER ROLE campusride_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE campusride_user SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE campusride TO campusride_user;

# Exit
\q
```

## Connection String

```
postgresql://campusride_user:secure_password@localhost:5432/campusride
```

## Schema

Tables:
- `students` - Student accounts with wallet
- `buses` - Minibus fleet information
- `routes` - Transportation routes
- `stops` - Route stops/stations
- `bookings` - Student reservations
- `wallet_transactions` - Payment transaction history

## Tables Description

### Students Table
- registration_number: Unique student ID
- first_name, last_name: Student name
- email: University email
- level: Academic level (100-600)
- hostel: Assigned hostel (A-E)
- wallet_balance: Current account balance
- total_spent: Cumulative spending

### Wallet Transactions Table
- student_id: Reference to student
- amount: Transaction amount
- transaction_type: 'credit' or 'debit'
- description: Transaction details
- balance_after: Wallet balance after transaction
