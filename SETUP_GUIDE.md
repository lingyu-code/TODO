# 🚀 Quick Setup Guide

## Step-by-Step Setup Instructions

### 1️⃣ Install MySQL (if not already installed)

#### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

#### macOS
```bash
brew install mysql
brew services start mysql
```

#### Windows (WSL)
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo service mysql start
```

### 2️⃣ Secure MySQL Installation (Recommended)
```bash
sudo mysql_secure_installation
```
- Set root password
- Remove anonymous users
- Disallow remote root login
- Remove test database

### 3️⃣ Create Database

#### Option A: Using the setup script
```bash
./setup_db.sh
```

#### Option B: Manual setup
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE todo_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# (Optional) Create a dedicated user
CREATE USER 'todoapp'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON todo_app.* TO 'todoapp'@'localhost';
FLUSH PRIVILEGES;

# Exit
EXIT;
```

### 4️⃣ Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit with your credentials
nano .env
```

Update these values in `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root                    # or your MySQL user
DB_PASSWORD=your_mysql_password # your MySQL password
DB_NAME=todo_app

# Generate a secret key (see below)
SECRET_KEY=your-secret-key-here
```

**Generate a secure secret key:**
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### 5️⃣ Install Python Dependencies

```bash
# Activate virtual environment
source venv/bin/activate

# Install requirements
pip install -r requirements.txt
```

### 6️⃣ Initialize Database Tables

```bash
# Activate virtual environment (if not already)
source venv/bin/activate

# Run initialization script
python init_db.py
```

This will:
- Test database connection
- Create the `users` and `todos` tables
- Display the created tables

### 7️⃣ Start the Application

```bash
./start.sh
```

Or manually:
```bash
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 8️⃣ Access the Application

Open your browser and navigate to:
- **Web App**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

---

## 🐛 Troubleshooting

### MySQL Connection Issues

**Problem: "Can't connect to local MySQL server"**
```bash
# Check if MySQL is running
sudo systemctl status mysql       # Linux
brew services list                # macOS

# Start MySQL if not running
sudo systemctl start mysql        # Linux
brew services start mysql         # macOS
```

**Problem: "Access denied for user 'root'@'localhost'"**

This is common on Ubuntu/Debian. Try one of these solutions:

**Solution 1: Use sudo to access MySQL**
```bash
sudo mysql

# Then create a password for root
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_new_password';
FLUSH PRIVILEGES;
EXIT;
```

**Solution 2: Create a new user**
```bash
sudo mysql

CREATE USER 'todoapp'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON *.* TO 'todoapp'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT;
```

Then update `.env`:
```env
DB_USER=todoapp
DB_PASSWORD=your_password
```

**Problem: "Unknown database 'todo_app'"**
```bash
# Create the database
mysql -u root -p
CREATE DATABASE todo_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Python/Dependency Issues

**Problem: "ModuleNotFoundError: No module named 'X'"**
```bash
# Make sure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

**Problem: "No such file or directory: 'venv/bin/activate'"**
```bash
# Create virtual environment
python3 -m venv venv

# Then activate and install
source venv/bin/activate
pip install -r requirements.txt
```

### Port Already in Use

**Problem: "Address already in use: 8000"**
```bash
# Find what's using port 8000
lsof -i :8000

# Kill the process (replace PID with actual process ID)
kill -9 PID

# Or use a different port
uvicorn main:app --reload --port 8001
```

---

## ✅ Verification Checklist

Before running the app, verify:

- [ ] MySQL is installed and running
- [ ] Database `todo_app` exists
- [ ] `.env` file has correct MySQL credentials
- [ ] `.env` file has a secure SECRET_KEY
- [ ] Virtual environment is activated
- [ ] All Python dependencies are installed
- [ ] Database tables are created (`python init_db.py`)
- [ ] Port 8000 is available

---

## 🎯 Quick Test

After setup, test the application:

### 1. Test Health Endpoint
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "total_users": 0,
  "total_todos": 0
}
```

### 2. Register a User (via API)
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!",
    "full_name": "Test User"
  }'
```

### 3. Open Web Interface
Open http://localhost:8000 in your browser and:
1. Click "Sign up"
2. Create an account
3. Login
4. Add a todo item

---

## 📱 Using the Application

### Register New Account
1. Open http://localhost:8000
2. Click "Sign up" link
3. Fill in username, email, and password
4. Click "Register"

### Login
1. Enter your username and password
2. Click "Login"
3. You'll be taken to your personal todo list

### Manage Todos
- **Add**: Type a task and description, click "Add Task"
- **Complete**: Click the checkbox next to a task
- **Delete**: Click the trash icon
- **Filter**: Use "All", "Active", or "Completed" buttons

### Logout
Click the "Logout" button in the header

---

## 🔒 Security Notes

### For Development
- Default `.env` has no password (MySQL default)
- SECRET_KEY should be changed from example

### For Production
1. **Use strong MySQL password**
2. **Generate unique SECRET_KEY**
   ```bash
   python3 -c "import secrets; print(secrets.token_hex(32))"
   ```
3. **Never commit `.env` file** (already in .gitignore)
4. **Enable HTTPS**
5. **Restrict CORS origins** in `main.py`
6. **Use environment variables** instead of .env file
7. **Set up database backups**

---

## 🎉 You're Ready!

If all steps completed successfully, your TODO app is now running with:
- ✅ MySQL database with 2 tables (users, todos)
- ✅ User authentication (JWT)
- ✅ Secure password storage (bcrypt)
- ✅ Modern web interface
- ✅ RESTful API

**Start the app**: `./start.sh`  
**Access at**: http://localhost:8000

Enjoy! 🚀
