#!/bin/sh
set -eu

cat > /usr/share/nginx/html/env.js <<EOF
window.__BOOKVERSE_CONFIG__ = {
  VITE_API_URL: "${VITE_API_URL:-/api}",
  VITE_GOOGLE_CLIENT_ID: "${VITE_GOOGLE_CLIENT_ID:-}",
  VITE_RAZORPAY_KEY: "${VITE_RAZORPAY_KEY:-}"
};
EOF
