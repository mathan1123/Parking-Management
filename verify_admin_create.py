import urllib.request
import json

# 1. Create Admin
print("Creating Admin 'ADM-TEST-02'...")
url = 'http://127.0.0.1:8000/api/admins/'
payload = {
    "username": "ADM-TEST-02", 
    "password": "password123", 
    "email": "testadmin2@vdart.in",
    "admin_code": "ADM-TEST-02",
    "office": "Test Office",
    "designation": "Tester",
    "mobile": "1112223333",
    "shift": "Night"
}
data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        print(f"Created Admin: {result['admin_code']}")
except Exception as e:
    print(f"Creation Error: {e}")
    exit()

# 2. Verify Login
print("Verifying Login with new credentials...")
login_url = 'http://127.0.0.1:8000/api/admin-login/'
login_payload = {
    "username": "ADM-TEST-02",
    "password": "password123"
}
login_data = json.dumps(login_payload).encode('utf-8')
req_login = urllib.request.Request(login_url, data=login_data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req_login) as response:
        result = json.loads(response.read().decode('utf-8'))
        status_code = response.getcode()
        # Note: Our simple login check in views.py checks for is_superuser. 
        # The serializer create logic simply creates a User. We might need to manually set is_superuser OR update login logic to allow is_staff.
        # But for now, let's see what happens. If it fails, we know we need to adjust permissions.
        print(f"Login Response: {result}")
        
        # If login says success, great. 
        # If not, it means the user created isn't a superuser.
        # FIX: We should probably update authentication view to check if user is in AdminProfile OR is_superuser.
except Exception as e:
    # 403 or 401 likely
    print(f"Login Error (Expected if not superuser): {e}")

