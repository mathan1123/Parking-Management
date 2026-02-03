import urllib.request
import json

# 1. Create Office
print("Creating Test Office...")
url = 'http://127.0.0.1:8000/api/offices/'
payload = {
    "name": "Test Office Hub",
    "location": "Test City"
}
data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
office_id = None

try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        office_id = result['id']
        print(f"Created Office #{office_id}: {result['name']}")
except Exception as e:
    print(f"Creation Error: {e}")
    exit()

# 2. List Offices
print("Listing Offices...")
try:
    with urllib.request.urlopen(url) as response:
        result = json.loads(response.read().decode('utf-8'))
        print(f"Found {len(result)} offices.")
        found = False
        for off in result:
            if off['id'] == office_id:
                found = True
                break
        if found:
             print(f"VERIFICATION SUCCESS: New office found in list.")
        else:
             print(f"VERIFICATION FAILED: New office not found.")
except Exception as e:
    print(f"List Error: {e}")

# 3. Delete Office
print(f"Deleting Office #{office_id}...")
delete_url = f'http://127.0.0.1:8000/api/offices/{office_id}/'
req_delete = urllib.request.Request(delete_url, method='DELETE')

try:
    with urllib.request.urlopen(req_delete) as response:
        print(f"Delete Status: {response.getcode()}")
        if response.getcode() == 204:
             print("VERIFICATION SUCCESS: Office deleted.")
except Exception as e:
    print(f"Delete Error: {e}")
