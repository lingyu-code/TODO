#!/bin/bash

# MySQL Database Setup Script for TODO App

echo "🗄️  MySQL Database Setup for TODO App"
echo "======================================"
echo ""

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-3306}
DB_USER=${DB_USER:-root}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME:-todo_app}

echo "Database Configuration:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  User: $DB_USER"
echo "  Database: $DB_NAME"
echo ""

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL client not found. Please install MySQL first."
    echo ""
    echo "On Ubuntu/Debian:"
    echo "  sudo apt-get update"
    echo "  sudo apt-get install mysql-server mysql-client"
    echo ""
    echo "On macOS:"
    echo "  brew install mysql"
    echo ""
    exit 1
fi

echo "✅ MySQL client found"
echo ""

# Create database
echo "Creating database '$DB_NAME'..."

if [ -z "$DB_PASSWORD" ]; then
    # No password
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
else
    # With password
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
fi

if [ $? -eq 0 ]; then
    echo "✅ Database '$DB_NAME' created successfully (or already exists)"
else
    echo "❌ Failed to create database. Please check your MySQL credentials."
    echo ""
    echo "Try running manually:"
    echo "  mysql -u $DB_USER -p"
    echo "  CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    echo ""
    exit 1
fi

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "Next steps:"
echo "  1. Update .env file with your MySQL credentials"
echo "  2. Run: source venv/bin/activate"
echo "  3. Run: pip install -r requirements.txt"
echo "  4. Run: ./start.sh"
echo ""
echo "The application will automatically create the tables on first run."
echo ""
