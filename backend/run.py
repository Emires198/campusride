#!/usr/bin/env python
"""Entry point for CampusRide API Server"""

from app import create_app, db
import os

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    
    debug = os.getenv('FLASK_DEBUG', 'True') == 'True'
    port = int(os.getenv('FLASK_PORT', 5000))
    
    print("\n🚌 CampusRide API Server Starting...")
    print(f"📍 Running on http://localhost:{port}")
    print("Press CTRL+C to quit\n")
    
    app.run(debug=debug, port=port, host='0.0.0.0')
