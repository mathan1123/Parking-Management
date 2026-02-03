import urllib.request
import json

# 1. Create a Pending Booking
print("Creating Pending Booking...")
url = 'http://127.0.0.1:8000/api/bookings/'
payload = {
    "office": "chennai",
    "user_type": "visitor",
    "name": "Approval Tester",
    "email": "approver@test.com",
    "phone": "1234567890",
    "vehicle_type": "bike",
    "vehicle_no": "TEST-APPR-01",
    "purpose": "Testing Approval Flow",
    "booking_date": "Mar 01, 2026",
    "time_slot": "10:00 AM - 12:00 PM"
}
data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
booking_id = None

try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        booking_id = result['id']
        print(f"Created Booking #{booking_id}, Status: {result.get('status')}")
except Exception as e:
    print(f"Creation Error: {e}")
    exit()

# 2. Approve the Booking
print(f"Approving Booking #{booking_id}...")
update_url = f'http://127.0.0.1:8000/api/bookings/{booking_id}/'
update_payload = {"status": "Approved"}
update_data = json.dumps(update_payload).encode('utf-8')
# METHOD PATCH
req_update = urllib.request.Request(update_url, data=update_data, headers={'Content-Type': 'application/json'}, method='PATCH')

try:
    with urllib.request.urlopen(req_update) as response:
        result = json.loads(response.read().decode('utf-8'))
        print(f"Updated Booking #{booking_id}, New Status: {result.get('status')}")
        if result.get('status') == 'Approved':
            print("VERIFICATION SUCCESS: Booking Approved.")
        else:
            print("VERIFICATION FAILED: Status did not update.")
except Exception as e:
    print(f"Update Error: {e}")
