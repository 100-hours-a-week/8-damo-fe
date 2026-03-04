#!/bin/bash
set -e

echo "ApplicationStart: Starting containers..."
cd /home/ubuntu/app

if [ -f scripts/image.env ]; then
  export $(grep -v '^#' scripts/image.env | xargs)
fi

sudo -E docker compose pull

sudo -E docker compose up -d

echo "Waiting for services to be healthy..."
sleep 30

sudo -E docker compose ps
