import urllib.request
import json
import time

# 1. Create a Booking with a Slot
print("Creating Booking for Slot Action Test...")
url = 'http://127.0.0.1:8000/api/bookings/'
timestamp = int(time.time())
payload = {
    "name": f"Slot Action User {timestamp}",
    "email": "actions@vdartinc.com",
    "phone": "5551112222",
    "user_type": "employee",
    "employee_id": "EMP-ACT-01",
    "vehicle_type": "Bike",
    "vehicle_no": "TN-ACT-99",
    "booking_date": "2026-01-11",
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

# 2. Approve and Assign Slot 25
print(f"Assigning Slot 25 to Booking #{booking_id}...")
patch_url = f'http://127.0.0.1:8000/api/bookings/{booking_id}/'
patch_payload_assign = {
    "status": "Approved",
    "allocated_slot": "25"
}
req_assign = urllib.request.Request(patch_url, data=json.dumps(patch_payload_assign).encode('utf-8'), headers={'Content-Type': 'application/json'}, method='PATCH')
try:
    with urllib.request.urlopen(req_assign) as response:
        print("Assigned to Slot 25.")
except Exception as e:
    print(f"Assign Error: {e}")
    exit()

# 3. Move to Slot 26 (Simulate frontend logic: just PATCHing new slot)
print(f"Moving Booking #{booking_id} to Slot 26...")
patch_payload_move = {
    "allocated_slot": "26"
}
req_move = urllib.request.Request(patch_url, data=json.dumps(patch_payload_move).encode('utf-8'), headers={'Content-Type': 'application/json'}, method='PATCH')
try:
    with urllib.request.urlopen(req_move) as response:
        result = json.loads(response.read().decode('utf-8'))
        print(f"New Slot: {result['allocated_slot']}")
        if result['allocated_slot'] == "26":
            print("SUCCESS: Slot Moved.")
        else:
            print("FAILURE: Move failed.")
except Exception as e:
    print(f"Move Error: {e}")

# 4. Cancel Booking (Simulate Cancel action)
print(f"Cancelling Booking #{booking_id}...")
patch_payload_cancel = {
    "status": "Cancelled",
    "rejection_reason": "Admin Cancelled Test",
    "allocated_slot": None
}
# Note: JSON null translates to None in Python when loading, but for dumping we need None->null. 
# Explicitly ensuring allocated_slot is null in JSON.
req_cancel = urllib.request.Request(patch_url, data=json.dumps(patch_payload_cancel).encode('utf-8'), headers={'Content-Type': 'application/json'}, method='PATCH')

try:
    with urllib.request.urlopen(req_cancel) as response:
        result = json.loads(response.read().decode('utf-8'))
        print(f"Status: {result['status']}")
        print(f"Slot: {result['allocated_slot']}")
        print(f"Reason: {result['rejection_reason']}")
        
        if result['status'] == 'Cancelled' and result['allocated_slot'] is None:
            print("SUCCESS: Booking Cancelled and Slot Freed.")
        else:
            print("FAILURE: Cancellation state mismatch.")
except Exception as e:
    print(f"Cancel Error: {e}")
