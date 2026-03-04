#!/bin/sh
# Docker entrypoint script for frontend
# Replaces environment variables in JavaScript files at runtime

set -e

# Replace env vars in built files if needed
# This allows runtime configuration without rebuilding
if [ -n "$VITE_API_URL" ]; then
    echo "Setting VITE_API_URL to: $VITE_API_URL"
    find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|VITE_API_URL_PLACEHOLDER|$VITE_API_URL|g" {} +
fi

# Execute the CMD
exec "$@"
