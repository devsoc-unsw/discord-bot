#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
# Get the project root directory (one level up from scripts)
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="$PROJECT_ROOT/compose.dev.yaml"

echo "Using compose file: $COMPOSE_FILE"
echo "Stopping containers and removing volumes..."
docker compose -f "$COMPOSE_FILE" down -v

echo "Rebuilding containers..."
docker compose -f "$COMPOSE_FILE" build --no-cache

echo "Starting containers..."
docker compose -f "$COMPOSE_FILE" up 