import urllib.request
import json

login_url = 'http://127.0.0.1:8000/api/admin-login/'
payload = {
    "username": "admin@vdart.in",
    "password": "admin123"
}
data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(login_url, data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        print("Login Status:", response.getcode())
        result = json.loads(response.read().decode('utf-8'))
        print("Login Result:", result)
except Exception as e:
    print(f"Login Error: {e}")

# Test invalid login
payload_invalid = {
    "username": "admin@vdart.in",
    "password": "wrongpassword"
}
data_invalid = json.dumps(payload_invalid).encode('utf-8')
req_invalid = urllib.request.Request(login_url, data=data_invalid, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req_invalid) as response:
        print("Invalid Login Status (unexpected):", response.getcode())
except urllib.error.HTTPError as e:
    print(f"Invalid Login Expected Error: {e.code}")
