import urllib.request
import json
import time

# Create a booking with Monthly pass
print("Creating Employee Booking with Monthly Pass...")
url = 'http://127.0.0.1:8000/api/bookings/'
timestamp = int(time.time())
payload = {
    "office": "trichy",
    "user_type": "employee",
    "employee_id": f"EMP-PASS-{timestamp}",
    "pass_type": "monthly",
    "name": "Monthly Pass User",
    "email": "monthly@vdartinc.com",
    "phone": "9876543210",
    "vehicle_type": "Car",
    "vehicle_no": "TN-PASS-01",
    "booking_date": "Jan 15, 2026",
    "time_slot": "09:00 AM - 06:00 PM"
}

data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        booking_id = result['id']
        pass_type = result.get('pass_type', 'NOT FOUND')
        print(f"Booking Created: #{booking_id}")
        print(f"Pass Type: {pass_type}")
        
        if pass_type == 'monthly':
            print("SUCCESS: Monthly pass type persisted correctly!")
        else:
            print(f"FAILURE: Expected 'monthly', got '{pass_type}'")
except Exception as e:
    print(f"Error: {e}")

# Test Yearly Pass
print("\nCreating Employee Booking with Yearly Pass...")
payload['pass_type'] = 'yearly'
payload['employee_id'] = f"EMP-YEARLY-{timestamp}"
payload['name'] = "Yearly Pass User"
payload['email'] = "yearly@vdartacademy.com"

data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        booking_id = result['id']
        pass_type = result.get('pass_type', 'NOT FOUND')
        print(f"Booking Created: #{booking_id}")
        print(f"Pass Type: {pass_type}")
        
        if pass_type == 'yearly':
            print("SUCCESS: Yearly pass type persisted correctly!")
        else:
            print(f"FAILURE: Expected 'yearly', got '{pass_type}'")
except Exception as e:
    print(f"Error: {e}")
