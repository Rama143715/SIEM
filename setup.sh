#!/bin/bash
set -e

echo "Setting up SIEM Platform..."

cp .env.example .env

docker compose up -d postgres redis

echo "Waiting for PostgreSQL to accept connections..."
sleep 8

docker compose run --rm backend npm run migrate
docker compose run --rm backend npm run seed

docker compose up -d

echo "SIEM Platform running at http://localhost:5173"
echo "Default admin: admin@siem.local / changeme123"
echo "API running at http://localhost:3001"
echo "PostgreSQL at localhost:5432"
echo "Redis at localhost:6379"
