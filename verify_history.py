import urllib.request
import json

# 1. Create a booking for specific email
create_url = 'http://127.0.0.1:8000/api/bookings/'
payload = {
    "office": "bangalore",
    "user_type": "employee",
    "employee_id": "HISTORY_TEST_001",
    "name": "History Bot",
    "email": "history_test@vdartinc.com",
    "phone": "8888888888",
    "vehicle_type": "car",
    "vehicle_no": "KA-01-HI-9999",
    "purpose": "History Check",
    "booking_date": "Feb 01, 2026",
    "time_slot": "10:00 AM - 11:00 AM"
}
data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(create_url, data=data, headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as response:
        print("Booking Created:", response.getcode())
except Exception as e:
    print(f"Creation Error: {e}")

# 2. Fetch history for that email
filter_url = 'http://127.0.0.1:8000/api/bookings/?email=history_test@vdartinc.com'
try:
    with urllib.request.urlopen(filter_url) as response:
        print("History Fetch Status:", response.getcode())
        history = json.loads(response.read().decode('utf-8'))
        print(f"Found {len(history)} bookings for history_test@vdartinc.com")
        if len(history) > 0:
            print(f"First booking ID: {history[0]['id']}")
except Exception as e:
    print(f"Fetch Error: {e}")
