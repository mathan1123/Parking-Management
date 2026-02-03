import urllib.request
import json
import time

# 1. Create a Booking
print("Creating Booking for Slot Allocation Test...")
url = 'http://127.0.0.1:8000/api/bookings/'
timestamp = int(time.time())
payload = {
    "name": f"Slot Test User {timestamp}",
    "email": "slot@vdartinc.com",
    "phone": "9998887777",
    "user_type": "employee",
    "employee_id": "EMP-SLOT-01",
    "vehicle_type": "Car",
    "vehicle_no": "TN-SL-01",
    "booking_date": "2026-01-09",
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

# 2. Approve the Booking with a Slot
print(f"Approving Booking #{booking_id} with Slot A-99...")
patch_url = f'http://127.0.0.1:8000/api/bookings/{booking_id}/'
patch_payload = {
    "status": "Approved",
    "allocated_slot": "A-99"
}
# Using custom method for PATCH
req_patch = urllib.request.Request(patch_url, data=json.dumps(patch_payload).encode('utf-8'), headers={'Content-Type': 'application/json'}, method='PATCH')

try:
    with urllib.request.urlopen(req_patch) as response:
        result = json.loads(response.read().decode('utf-8'))
        print(f"Booking Approved. Status: {result['status']}")
        print(f"Allocated Slot: {result['allocated_slot']}")
        
        if result['allocated_slot'] == "A-99":
            print("SUCCESS: Slot allocated correctly.")
        else:
            print("FAILURE: Slot mismatch.")

except Exception as e:
    print(f"Approval Error: {e}")
