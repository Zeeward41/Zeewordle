#!/bin/bash

sed -i "s|\${VITE_API_URL}|$VITE_API_URL|g" dist/config.js

npx serve -s dist
