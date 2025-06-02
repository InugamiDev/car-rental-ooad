#!/bin/bash

# Car Rental Platform Deployment Script
# Usage: ./scripts/deploy.sh [environment]
# Environments: development, staging, production

set -e

ENVIRONMENT=${1:-development}
PROJECT_NAME="car-rental-platform"

echo "🚀 Starting deployment for environment: $ENVIRONMENT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Copying from .env.example"
    cp .env.example .env
    print_warning "Please update .env file with your configuration before running again."
    exit 1
fi

# Validate environment
case $ENVIRONMENT in
    development|staging|production)
        print_status "Deploying to $ENVIRONMENT environment"
        ;;
    *)
        print_error "Invalid environment: $ENVIRONMENT"
        print_error "Valid environments: development, staging, production"
        exit 1
        ;;
esac

# Pre-deployment checks
print_status "Running pre-deployment checks..."

# Check if ports are available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Port $port is already in use"
        return 1
    fi
    return 0
}

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down --remove-orphans || true

# Clean up old images (optional)
if [ "$ENVIRONMENT" = "production" ]; then
    print_status "Cleaning up old Docker images..."
    docker image prune -f
fi

# Build and start services
print_status "Building and starting services..."

case $ENVIRONMENT in
    development)
        # Development environment
        export NODE_ENV=development
        docker-compose up --build -d
        ;;
    staging)
        # Staging environment
        export NODE_ENV=staging
        docker-compose -f docker-compose.yml -f docker-compose.staging.yml up --build -d
        ;;
    production)
        # Production environment
        export NODE_ENV=production
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
        ;;
esac

# Wait for services to start
print_status "Waiting for services to start..."
sleep 10

# Health checks
print_status "Running health checks..."

# Check if database is ready
print_status "Checking database connection..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker-compose exec -T db pg_isready -U postgres >/dev/null 2>&1; then
        print_status "Database is ready"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        print_error "Database failed to start after $max_attempts attempts"
        exit 1
    fi
    
    print_warning "Waiting for database... (attempt $attempt/$max_attempts)"
    sleep 5
    ((attempt++))
done

# Run database migrations
print_status "Running database migrations..."
docker-compose exec -T app npx prisma migrate deploy || {
    print_error "Database migration failed"
    exit 1
}

# Check if application is responding
print_status "Checking application health..."
attempt=1
while [ $attempt -le 20 ]; do
    if curl -f http://localhost:3000/health >/dev/null 2>&1; then
        print_status "Application is responding"
        break
    fi
    
    if [ $attempt -eq 20 ]; then
        print_error "Application failed to respond after 20 attempts"
        docker-compose logs app
        exit 1
    fi
    
    print_warning "Waiting for application... (attempt $attempt/20)"
    sleep 5
    ((attempt++))
done

# Show running containers
print_status "Deployment completed successfully!"
echo ""
print_status "Running containers:"
docker-compose ps

echo ""
print_status "Application URLs:"
echo "  🌐 Frontend: http://localhost:3000"
echo "  📊 API: http://localhost:3000/api"
echo "  🗄️  Database: localhost:5432"
echo "  🔴 Redis: localhost:6379"

echo ""
print_status "Useful commands:"
echo "  📋 View logs: docker-compose logs -f"
echo "  🔧 Shell access: docker-compose exec app sh"
echo "  🛑 Stop services: docker-compose down"
echo "  🔄 Restart: docker-compose restart"

echo ""
print_status "Environment: $ENVIRONMENT"
print_status "Deployment completed at: $(date)"

# Optional: Send deployment notification
if [ "$ENVIRONMENT" = "production" ] && [ -n "$SLACK_WEBHOOK_URL" ]; then
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"🚀 Car Rental Platform deployed to production successfully!\"}" \
        "$SLACK_WEBHOOK_URL" || true
fi