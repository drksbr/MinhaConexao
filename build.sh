#!/bin/sh

# Build the frontend
echo "Building the project..."
cd frontend/
bun install
bun run build
cd ..
# Build the backend
echo "Building the backend..."
cd backend/
GO_ENABLED=0 GOOS=linux go build -ldflags="-s -w"
cd ..

# Build the docker image
echo "Building the docker image..."
docker build -t drks/minhaconexao:latest .

# Push the docker image
echo "Pushing the docker image..."
docker push drks/minhaconexao:latest

# Bye bye
echo "Done!"