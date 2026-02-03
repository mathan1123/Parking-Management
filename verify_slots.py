import urllib.request
import json
import time

# 1. Create a Booking (Status=Pending)
print("Creating Booking...")
url = 'http://127.0.0.1:8000/api/bookings/'
payload = {
    "office": "bangalore",
    "user_type": "employee",
    "name": "Slot Tester",
    "email": "slot@tester.com",
    "phone": "9998887776",
    "vehicle_type": "car",
    "vehicle_no": "SLOT-50",
    "booking_date": "Apr 15, 2026",
    "time_slot": "9:00 AM"
}
data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

booking_id = None
try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        booking_id = result['id']
        print(f"Created Booking #{booking_id}, Status: {result['status']}")
except Exception as e:
    print(f"Creation Error: {e}")
    exit()

# 2. Approve Booking (Requirement for allocation in frontend logic)
print(f"Approving Booking #{booking_id}...")
update_url = f'http://127.0.0.1:8000/api/bookings/{booking_id}/'
approve_payload = {"status": "Approved"}
req_approve = urllib.request.Request(update_url, data=json.dumps(approve_payload).encode('utf-8'), headers={'Content-Type': 'application/json'}, method='PATCH')
try:
    with urllib.request.urlopen(req_approve) as response:
        print("Booking Approved.")
except Exception as e:
    print(f"Approval Error: {e}")
    exit()

# 3. Allocate Slot 42
print(f"Allocating Slot 42 to Booking #{booking_id}...")
alloc_payload = {"allocated_slot": "42"}
req_alloc = urllib.request.Request(update_url, data=json.dumps(alloc_payload).encode('utf-8'), headers={'Content-Type': 'application/json'}, method='PATCH')

try:
    with urllib.request.urlopen(req_alloc) as response:
        result = json.loads(response.read().decode('utf-8'))
        print(f"Update Result - Slot: {result.get('allocated_slot')}")
        if result.get('allocated_slot') == '42':
            print("VERIFICATION SUCCESS: Slot allocated.")
        else:
            print("VERIFICATION FAILED: Slot not set.")
except Exception as e:
    print(f"Allocation Error: {e}")
