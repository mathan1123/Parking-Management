import urllib.request
import json

url = 'http://127.0.0.1:8000/api/bookings/'
payload = {
    "office": "trichy",
    "user_type": "employee",
    "employee_id": "TEST_AUTO_001",
    "name": "Validation Bot",
    "email": "bot@vdartinc.com",
    "phone": "9999999999",
    "vehicle_type": "car",
    "vehicle_no": "TEST-BOT-01",
    "purpose": "Validation",
    "booking_date": "Jan 20, 2026",
    "time_slot": "10:00 AM - 11:00 AM"
}

data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        print(f"Status Code: {response.getcode()}")
        print("Response Body:")
        print(response.read().decode('utf-8'))
except Exception as e:
    print(f"Error: {e}")
