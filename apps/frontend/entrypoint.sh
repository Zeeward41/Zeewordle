#!/bin/sh

sed -i "s|\${VITE_API_URL}|$VITE_API_URL|g" dist/config.js
sed -i "s|\${VITE_GOOGLE_CLIENT_ID}|$VITE_GOOGLE_CLIENT_ID|g" dist/config.js

npx serve -s dist
