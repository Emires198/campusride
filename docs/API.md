# CampusRide API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Use JWT tokens in the Authorization header:
```
Authorization: Bearer <token>
```

## Student Endpoints

### Register Student
```
POST /students/register
Body: {
  "registration_number": "STU/2023/001",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@university.edu",
  "password": "secure_password",
  "phone": "+1234567890",
  "level": "200",
  "hostel": "A",
  "admission_year": 2023,
  "department": "Computer Science"
}
Response: 201 Created
{
  "message": "Student registered successfully",
  "student": { ... }
}
```

### Login Student
```
POST /students/login
Body: {
  "registration_number": "STU/2023/001",
  "password": "secure_password"
}
Response: 200 OK
{
  "message": "Login successful",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "student": { ... }
}
```

### Get Student Profile
```
GET /students/profile
Headers: Authorization: Bearer <token>
Response: 200 OK - Student object
```

### Update Student Profile
```
PUT /students/profile
Headers: Authorization: Bearer <token>
Body: {
  "first_name": "John",
  "phone": "+1234567890",
  "hostel": "B",
  "department": "Engineering"
}
Response: 200 OK
```

### Get Student Dashboard
```
GET /students/dashboard
Headers: Authorization: Bearer <token>
Response: 200 OK
{
  "student": { ... },
  "wallet": {
    "balance": 5000,
    "total_spent": 1500
  },
  "bookings": {
    "total": 10,
    "completed": 8,
    "pending": 2
  },
  "recent_transactions": [ ... ]
}
```

## Wallet Endpoints

### Get Wallet Balance
```
GET /wallet/balance
Headers: Authorization: Bearer <token>
Response: 200 OK
{
  "student_id": 1,
  "balance": 5000,
  "total_spent": 1500,
  "updated_at": "2024-06-25T10:00:00"
}
```

### Add Money to Wallet
```
POST /wallet/add-money
Headers: Authorization: Bearer <token>
Body: {
  "amount": 5000,
  "description": "Top-up via card"
}
Response: 201 Created
{
  "message": "Money added successfully",
  "new_balance": 10000,
  "transaction": { ... }
}
```

### Get Wallet Transactions
```
GET /wallet/transactions?page=1&per_page=20
Headers: Authorization: Bearer <token>
Response: 200 OK
{
  "student_id": 1,
  "total": 15,
  "pages": 1,
  "current_page": 1,
  "transactions": [ ... ]
}
```

### Get Wallet Summary
```
GET /wallet/summary
Headers: Authorization: Bearer <token>
Response: 200 OK
{
  "student_id": 1,
  "current_balance": 5000,
  "total_credited": 10000,
  "total_debited": 5000,
  "total_transactions": 15,
  "last_transaction": { ... }
}
```

## Booking Endpoints

### Get All Bookings
```
GET /bookings
Headers: Authorization: Bearer <token>
Response: 200 OK - Array of booking objects
```

### Get Booking by ID
```
GET /bookings/<booking_id>
Headers: Authorization: Bearer <token>
Response: 200 OK - Booking object
```

### Create Booking
```
POST /bookings
Headers: Authorization: Bearer <token>
Body: {
  "bus_id": 1,
  "route_id": 1,
  "pickup_stop": "Hostel A",
  "dropoff_stop": "Lecture Hall",
  "booking_date": "2024-06-25T10:00:00",
  "seat_number": "A01",
  "fare_amount": 100
}
Response: 201 Created
{
  "message": "Booking created successfully",
  "booking": { ... },
  "wallet_balance": 4900
}
```

### Confirm Booking
```
PUT /bookings/<booking_id>/confirm
Headers: Authorization: Bearer <token>
Response: 200 OK
```

### Cancel Booking
```
PUT /bookings/<booking_id>/cancel
Headers: Authorization: Bearer <token>
Response: 200 OK
{
  "message": "Booking cancelled successfully",
  "refunded_amount": 100,
  "wallet_balance": 5000
}
```

## Bus Endpoints

### Get All Buses
```
GET /buses
Response: 200 OK - Array of bus objects
```

### Get Bus by ID
```
GET /buses/<bus_id>
Response: 200 OK - Bus object
```

## Route Endpoints

### Get All Routes
```
GET /routes
Response: 200 OK - Array of route objects
```

### Get Route by ID
```
GET /routes/<route_id>
Response: 200 OK - Route object with stops
```
