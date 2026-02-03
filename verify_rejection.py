import urllib.request
import json

# 1. Create a Booking
print("Creating Booking for Rejection Test...")
url = 'http://127.0.0.1:8000/api/bookings/'
payload = {
    "name": "Reject Test User",
    "email": "reject@vdartinc.com",
    "phone": "9998887777",
    "user_type": "employee",
    "employee_id": "EMP-REJ-01",
    "vehicle_type": "Car",
    "vehicle_no": "TN-REJ-01",
    "booking_date": "2026-01-08",
    "time_slot": "09:00 AM - 06:00 PM",
    "office": "Test Office"
}
data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

booking_id = None
try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        booking_id = result['id']
        print(f"Booking Created: #{booking_id}")
except Exception as e:
    print(f"Creation Error: {e}")
    exit()

# 2. Reject the Booking with a Reason
print(f"Rejecting Booking #{booking_id}...")
patch_url = f'http://127.0.0.1:8000/api/bookings/{booking_id}/'
patch_payload = {
    "status": "Rejected",
    "rejection_reason": "Invalid ID Proof"
}
# Note: urllib doesn't support PATCH natively easily without method arg in recent versions or Request object modification
req_patch = urllib.request.Request(patch_url, data=json.dumps(patch_payload).encode('utf-8'), headers={'Content-Type': 'application/json'}, method='PATCH')

try:
    with urllib.request.urlopen(req_patch) as response:
        result = json.loads(response.read().decode('utf-8'))
        print(f"Booking Rejected. Status: {result['status']}")
        print(f"Reason: {result['rejection_reason']}")
        
        if result['rejection_reason'] == "Invalid ID Proof":
            print("SUCCESS: Rejection reason persisted.")
        else:
            print("FAILURE: Reason mismatch.")

except Exception as e:
    print(f"Rejection Error: {e}")
