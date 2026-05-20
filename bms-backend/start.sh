#!/bin/sh

echo "Running startup scripts..."

npm run seed1
npm run seed2
npm run seed3

echo "Starting backend server..."


pm2-runtime start ecosystem.config.js