#!/bin/bash
set -e

echo "AfterInstall: Setting up environment..."

# login ECR
echo "AfterInstall: Logging in to ECR..."
source /home/ubuntu/app/scripts/image.env
aws ecr get-login-password --region ap-northeast-2 | \
  sudo docker login --username AWS --password-stdin \
  "${ECR_REGISTRY}"

# Set proper permissions
sudo chown -R ubuntu:ubuntu /home/ubuntu/app
sudo chmod +x /home/ubuntu/app/scripts/*.sh
