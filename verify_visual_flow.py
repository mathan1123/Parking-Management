import urllib.request
import json
import time

# 1. Create a Pending Booking
print("Creating Pending Booking...")
url = 'http://127.0.0.1:8000/api/bookings/'
timestamp = int(time.time())
payload = {
    "name": f"Visual Test {timestamp}",
    "email": "visual@vdartinc.com",
    "phone": "5556667777",
    "user_type": "visitor",
    "purpose": "Visual Selection Test",
    "vehicle_type": "Car",
    "vehicle_no": "TN-VIS-01",
    "booking_date": "2026-01-10",
    "time_slot": "10:00 AM - 12:00 PM",
    "office": "Test Office"
}
data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

booking_id = None
try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        booking_id = result['id']
        print(f"Booking Created: #{booking_id} (Status: {result['status']})")
except Exception as e:
    print(f"Creation Error: {e}")
    exit()

# 2. Approve Booking (No Slot) - Simulating Approval Page Action
print(f"Approving Booking #{booking_id} (No Slot)...")
patch_url = f'http://127.0.0.1:8000/api/bookings/{booking_id}/'
patch_payload_approve = {
    "status": "Approved"
    # allocated_slot is intentionally omitted/null here, waiting for Slot Page
}
req_patch_approve = urllib.request.Request(patch_url, data=json.dumps(patch_payload_approve).encode('utf-8'), headers={'Content-Type': 'application/json'}, method='PATCH')

try:
    with urllib.request.urlopen(req_patch_approve) as response:
        result = json.loads(response.read().decode('utf-8'))
        print(f"Booking Status: {result['status']}")
        print(f"Allocated Slot: {result['allocated_slot']} (Should be None/Null)")
except Exception as e:
    print(f"Approval Error: {e}")
    exit()

# 3. Allocating Slot - Simulating Slot Page Action
print(f"Allocating Slot 25 to Booking #{booking_id}...")
patch_payload_slot = {
    "allocated_slot": "25"
}
req_patch_slot = urllib.request.Request(patch_url, data=json.dumps(patch_payload_slot).encode('utf-8'), headers={'Content-Type': 'application/json'}, method='PATCH')

try:
    with urllib.request.urlopen(req_patch_slot) as response:
        result = json.loads(response.read().decode('utf-8'))
        print(f"Final Status: {result['status']}")
        print(f"Final Slot: {result['allocated_slot']}")
        
        if result['allocated_slot'] == "25":
            print("SUCCESS: Visual Slot Flow API steps verified.")
        else:
            print("FAILURE: Slot not assigned.")

except Exception as e:
    print(f"Allocation Error: {e}")
