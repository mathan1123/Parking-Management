import urllib.request
import json

# Create a booking with the new time range format
print("Creating Booking with Time Range...")
url = 'http://127.0.0.1:8000/api/bookings/'
payload = {
    "name": "Time Test User",
    "email": "timetest@vdart.in",
    "phone": "9998887777",
    "user_type": "visitor",
    "vehicle_type": "Car",
    "vehicle_no": "TN-TIME-01",
    "purpose": "Testing Time Range",
    "booking_date": "2026-01-06",
    "time_slot": "09:15 AM - 06:45 PM", # The new format
    "office": "Time Office"
}
data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        print(f"Booking Created ID: {result['id']}")
        print(f"Time Slot Saved: {result['time_slot']}")
        
        if result['time_slot'] == "09:15 AM - 06:45 PM":
            print("SUCCESS: Time Range persisted correctly.")
        else:
            print("FAILURE: Time Range mismatch.")

except Exception as e:
    print(f"Booking Error: {e}")
