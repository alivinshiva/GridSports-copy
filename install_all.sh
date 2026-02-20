#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "🚀 Installing dependencies for all projects..."

echo "--------------------------------------------------"
echo "📦 Installing admin (Frontend)..."
cd adFrontend
npm install
cd ..

echo "--------------------------------------------------"
echo "📦 Installing be-admin (Backend)..."
cd adBackend
npm install
cd ..

echo "--------------------------------------------------"
echo "📦 Installing showgrid-landing (Frontend)..."
cd frontend
npm install
cd ..

echo "--------------------------------------------------"
echo "📦 Installing showgrid-be (Backend)..."
cd backend
npm install
cd ..

echo "--------------------------------------------------"
echo "✅ All dependencies installed successfully!"