#!/usr/bin/env python3
"""
Database initialization and testing script
Run this after setting up MySQL to create tables and test the connection
"""

import sys
from sqlalchemy import text

def test_connection():
    """Test database connection"""
    try:
        from database import engine, create_tables

        print("🔍 Testing database connection...")
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Database connection successful!")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print("\nPlease check:")
        print("  1. MySQL is running: sudo systemctl status mysql")
        print("  2. Database exists: mysql -u root -p -e 'SHOW DATABASES;'")
        print("  3. Credentials in .env are correct")
        return False

def create_database_tables():
    """Create database tables"""
    try:
        from database import create_tables

        print("\n📊 Creating database tables...")
        create_tables()
        print("✅ Tables created successfully!")
        return True
    except Exception as e:
        print(f"❌ Failed to create tables: {e}")
        return False

def show_tables():
    """Show created tables"""
    try:
        from database import engine

        print("\n📋 Database tables:")
        with engine.connect() as conn:
            result = conn.execute(text("SHOW TABLES"))
            tables = result.fetchall()
            for table in tables:
                print(f"  - {table[0]}")
        return True
    except Exception as e:
        print(f"❌ Failed to show tables: {e}")
        return False

def main():
    print("=" * 60)
    print("TODO App - Database Setup and Testing")
    print("=" * 60)
    print()

    # Test connection
    if not test_connection():
        sys.exit(1)

    # Create tables
    if not create_database_tables():
        sys.exit(1)

    # Show tables
    show_tables()

    print()
    print("=" * 60)
    print("✅ Database setup complete!")
    print("=" * 60)
    print()
    print("Next steps:")
    print("  1. Start the server: ./start.sh")
    print("  2. Open browser: http://localhost:8000")
    print("  3. Register a new user and start using the app!")
    print()

if __name__ == "__main__":
    main()
