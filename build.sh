#!/usr/bin/env bash
# exit on error
set -o errexit

# Build frontend React app
echo "Building React frontend..."
npm install
npm run build

# Build backend Python app
echo "Installing Python dependencies..."
pip install -r backend/requirements.txt

# Run migrations
echo "Running database migrations..."
python backend/manage.py migrate

# Create superuser if it doesn't exist
echo "Setting up superuser..."
PYTHONPATH=backend python backend/create_super_user.py

# Collect static files for production serving
echo "Collecting static assets..."
python backend/manage.py collectstatic --no-input

echo "Build script completed successfully!"
