#!/bin/bash
# One-click deployment script for GCP VM SSH terminal
echo "🚀 Starting 1-Click GCP VM Deployment..."
cd ~/ar-expression-platform || exit
echo "📥 Fetching latest code from GitHub master..."
git fetch origin && git reset --hard origin/master
echo "🐳 Building Docker container..."
docker build -t ar-platform .
echo "🔄 Restarting container..."
docker stop ar-platform-container 2>/dev/null || true
docker rm ar-platform-container 2>/dev/null || true
docker run -d --name ar-platform-container -p 61100:61100 --restart always ar-platform
echo "✅ Deployment Complete! App is live."
