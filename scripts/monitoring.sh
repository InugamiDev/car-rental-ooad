#!/bin/bash

# Car Rental Platform Monitoring Script
# This script provides system monitoring and health checks

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}============================================${NC}"
}

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Function to check service health
check_service_health() {
    local service_name=$1
    local endpoint=$2
    local expected_status=${3:-200}
    
    if curl -f -s --max-time 10 "$endpoint" >/dev/null 2>&1; then
        print_status "$service_name is healthy"
        return 0
    else
        print_error "$service_name is not responding"
        return 1
    fi
}

# Function to check container status
check_container_status() {
    local container_name=$1
    local status=$(docker-compose ps -q $container_name 2>/dev/null)
    
    if [ -n "$status" ]; then
        local container_status=$(docker inspect --format='{{.State.Status}}' $status 2>/dev/null)
        if [ "$container_status" = "running" ]; then
            print_status "$container_name container is running"
            return 0
        else
            print_error "$container_name container is $container_status"
            return 1
        fi
    else
        print_error "$container_name container not found"
        return 1
    fi
}

# Function to check database connectivity
check_database() {
    if docker-compose exec -T db pg_isready -U postgres >/dev/null 2>&1; then
        print_status "Database is accessible"
        
        # Check database size
        local db_size=$(docker-compose exec -T db psql -U postgres -d car_rental -t -c "SELECT pg_size_pretty(pg_database_size('car_rental'));" 2>/dev/null | xargs)
        echo "  📊 Database size: $db_size"
        
        # Check active connections
        local connections=$(docker-compose exec -T db psql -U postgres -d car_rental -t -c "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';" 2>/dev/null | xargs)
        echo "  🔗 Active connections: $connections"
        
        return 0
    else
        print_error "Database is not accessible"
        return 1
    fi
}

# Function to check Redis
check_redis() {
    if docker-compose exec -T redis redis-cli ping >/dev/null 2>&1; then
        print_status "Redis is accessible"
        
        # Check Redis memory usage
        local memory_usage=$(docker-compose exec -T redis redis-cli info memory | grep used_memory_human | cut -d: -f2 | tr -d '\r')
        echo "  💾 Memory usage: $memory_usage"
        
        return 0
    else
        print_error "Redis is not accessible"
        return 1
    fi
}

# Function to check system resources
check_system_resources() {
    print_header "System Resources"
    
    # Check disk usage
    local disk_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$disk_usage" -gt 80 ]; then
        print_warning "Disk usage is high: ${disk_usage}%"
    else
        print_status "Disk usage: ${disk_usage}%"
    fi
    
    # Check memory usage
    local memory_usage=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
    if [ "${memory_usage%.*}" -gt 80 ]; then
        print_warning "Memory usage is high: ${memory_usage}%"
    else
        print_status "Memory usage: ${memory_usage}%"
    fi
    
    # Check CPU load
    local cpu_load=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
    echo "  🖥️  CPU load (1min): $cpu_load"
    
    # Check container resource usage
    echo ""
    echo "📊 Container Resource Usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" $(docker-compose ps -q) 2>/dev/null || true
}

# Function to check application logs for errors
check_application_logs() {
    print_header "Recent Application Logs"
    
    # Check for errors in the last 100 lines
    local error_count=$(docker-compose logs --tail=100 app 2>/dev/null | grep -i error | wc -l)
    if [ "$error_count" -gt 0 ]; then
        print_warning "Found $error_count error(s) in recent logs"
        echo "Recent errors:"
        docker-compose logs --tail=50 app 2>/dev/null | grep -i error | tail -5
    else
        print_status "No recent errors in application logs"
    fi
    
    # Check for warnings
    local warning_count=$(docker-compose logs --tail=100 app 2>/dev/null | grep -i warning | wc -l)
    if [ "$warning_count" -gt 0 ]; then
        print_warning "Found $warning_count warning(s) in recent logs"
    else
        print_status "No recent warnings in application logs"
    fi
}

# Function to check API endpoints
check_api_endpoints() {
    print_header "API Health Checks"
    
    # Check main endpoints
    check_service_health "Frontend" "http://localhost:3000"
    check_service_health "Cars API" "http://localhost:3000/api/cars"
    check_service_health "Health endpoint" "http://localhost:3000/api/health"
    
    # Check API response time
    local response_time=$(curl -o /dev/null -s -w '%{time_total}\n' http://localhost:3000/api/cars 2>/dev/null || echo "0")
    if (( $(echo "$response_time > 2" | bc -l) )); then
        print_warning "API response time is slow: ${response_time}s"
    else
        print_status "API response time: ${response_time}s"
    fi
}

# Function to check SSL certificate (if HTTPS is enabled)
check_ssl_certificate() {
    if [ -n "$SSL_DOMAIN" ]; then
        print_header "SSL Certificate Check"
        
        local expiry_date=$(echo | openssl s_client -servername $SSL_DOMAIN -connect $SSL_DOMAIN:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
        local expiry_epoch=$(date -d "$expiry_date" +%s 2>/dev/null || echo "0")
        local current_epoch=$(date +%s)
        local days_until_expiry=$(( ($expiry_epoch - $current_epoch) / 86400 ))
        
        if [ "$days_until_expiry" -lt 30 ]; then
            print_warning "SSL certificate expires in $days_until_expiry days"
        else
            print_status "SSL certificate is valid for $days_until_expiry days"
        fi
    fi
}

# Function to generate monitoring report
generate_report() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local report_file="monitoring_report_$(date +%Y%m%d_%H%M%S).txt"
    
    {
        echo "Car Rental Platform Monitoring Report"
        echo "Generated: $timestamp"
        echo "========================================"
        echo ""
        
        # Run all checks and capture output
        check_container_status "app"
        echo ""
        check_container_status "db"
        echo ""
        check_container_status "redis"
        echo ""
        check_database
        echo ""
        check_redis
        echo ""
        check_api_endpoints
        echo ""
        check_system_resources
        echo ""
        check_application_logs
        
    } | tee "$report_file"
    
    echo ""
    print_status "Monitoring report saved to: $report_file"
}

# Main execution
main() {
    case "${1:-status}" in
        "status"|"")
            print_header "Car Rental Platform Health Check"
            echo "Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
            echo ""
            
            # Run all health checks
            check_container_status "app"
            check_container_status "db"
            check_container_status "redis"
            echo ""
            check_database
            check_redis
            echo ""
            check_api_endpoints
            ;;
        "resources")
            check_system_resources
            ;;
        "logs")
            check_application_logs
            ;;
        "report")
            generate_report
            ;;
        "help")
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  status     - Check service health (default)"
            echo "  resources  - Check system resources"
            echo "  logs       - Check application logs"
            echo "  report     - Generate full monitoring report"
            echo "  help       - Show this help message"
            ;;
        *)
            print_error "Unknown command: $1"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"