#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Build the React project
echo "Building React project..."
cd ./pkg/httpserver/react/
npm install
npm run build

# Build the Go project
echo "Building Go project..."
cd /Users/isaacramon/Projects/MinhaConexao/go-app
go build -o app

# Build the Docker container
echo "Building Docker container..."
cd /Users/isaacramon/Projects/MinhaConexao
docker build -t minha-conexao:latest .

# Push the Docker container to the repository
echo "Pushing Docker container..."
docker tag minha-conexao:latest your-docker-repo/minha-conexao:latest
docker push your-docker-repo/minha-conexao:latest

echo "Build and push completed successfully."