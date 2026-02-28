#!/bin/bash

# Function to kill all background processes on script exit
cleanup() {
    echo ""
    echo "🛑 Stopping all servers..."
    # Kill all child processes
    kill $(jobs -p)
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

echo "🚀 Starting all ShowGrid servers..."

ensure_env_file() {
    local service_dir="$1"
    if [ ! -f "$service_dir/.env" ] && [ -f "$service_dir/.env.example" ]; then
        cp "$service_dir/.env.example" "$service_dir/.env"
        echo "ℹ️  Created $service_dir/.env from .env.example"
    fi
}

ensure_env_file "backend"
ensure_env_file "adBackend"

# Start Admin Frontend
echo "Starting Admin Frontend..."
(cd adFrontend && npm run dev) &

# Start Admin Backend
echo "Starting Admin Backend..."
(cd adBackend && npm run dev) &

# Start ShowGrid Frontend
echo "Starting ShowGrid Frontend..."
(cd frontend && npm run dev) &

# Start ShowGrid Backend
echo "Starting ShowGrid Backend..."
(cd backend && npm run dev) &

echo "✨ All servers are up and running!"
echo "Press Ctrl+C to stop everything."

# Wait for all background processes
wait