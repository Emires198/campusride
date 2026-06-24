# CampusRide 🚌

A comprehensive minibus transportation system for campus shuttle services connecting hotels, lecture halls, and hostels.

## System Overview

**Routes:**
- **Hotel ↔ Lecture Hall** - Primary shuttle route
- **Hostels A-E ↔ Hostels E-A** - Circular hostel route

## Key Features

✅ **Student Management** - Registration, login, profiles, levels
✅ **Wallet System** - Add money, track spending, transaction history
✅ **Real-time Bus Tracking** - Live location updates and GPS tracking
✅ **Schedule Management** - Route planning and timetable management
✅ **Booking System** - Passenger reservations and seat management
✅ **Driver Management** - Driver assignment and tracking
✅ **Pickup/Dropoff Tracking** - Real-time passenger status
✅ **Admin Dashboard** - Operations and reporting

## Tech Stack

- **Backend:** Python (Flask)
- **Frontend:** React.js
- **Database:** PostgreSQL
- **Real-time:** WebSockets
- **Maps:** Google Maps API
- **Authentication:** JWT

## Project Structure

```
campusride/
├── backend/              # Python API server
│   ├── app/
│   │   ├── models/       # Database models
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   └── config.py     # Configuration
│   ├── requirements.txt   # Python dependencies
│   └── run.py            # Entry point
├── frontend/             # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
├── database/             # Database setup
│   └── migrations/
├── docs/                 # Documentation
└── .gitignore
```

## Quick Start

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
python run.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Database Setup

Follow the guide in `database/README.md` to set up PostgreSQL.

## License

GNU General Public License v3.0
