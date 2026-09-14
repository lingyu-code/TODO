# 📝 TODO Web Application with MySQL & Authentication

A full-stack TODO list web application with **user authentication**, **MySQL database**, and a modern responsive interface. Built with **FastAPI** backend and vanilla **HTML/CSS/JavaScript** frontend.

## 🚀 Features

### Authentication & Security
- 🔐 User registration and login
- 🔑 JWT (JSON Web Token) authentication
- 🔒 Password hashing with bcrypt
- 👤 User-specific todo lists
- 🚪 Secure logout functionality

### Todo Management
- ✅ Create, read, update, and delete TODO items
- 🎯 Mark tasks as complete/incomplete
- 🔍 Filter tasks by status (All, Active, Completed)
- 💾 Persistent storage in MySQL database
- 👥 Each user has their own private todo list

### User Interface
- 📱 Responsive design that works on all devices
- 🎨 Beautiful gradient UI with smooth animations
- 🔔 Toast notifications for user feedback
- 🎭 Login/Register modal with smooth transitions
- ⚡ Fast and lightweight

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **MySQL** - Relational database
- **PyMySQL** - MySQL driver for Python
- **Pydantic** - Data validation
- **python-jose** - JWT token creation and validation
- **passlib** - Password hashing with bcrypt
- **Uvicorn** - Lightning-fast ASGI server

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **Vanilla JavaScript** - No framework dependencies
- **Fetch API** - For AJAX requests with JWT tokens
- **LocalStorage** - Client-side session management

### Database Schema
```sql
-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Todos table
CREATE TABLE todos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    user_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 📁 Project Structure

```
webServer/
├── main.py                 # FastAPI application with auth
├── database.py             # SQLAlchemy models and DB setup
├── auth.py                 # Authentication utilities (JWT, password hashing)
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables (DB config, secrets)
├── .env.example            # Example environment file
├── setup_db.sh            # Database setup script
├── start.sh               # Quick start script
├── templates/
│   └── index.html         # Main HTML template with auth UI
├── static/
│   ├── css/
│   │   └── style.css      # Application styles with modal
│   └── js/
│       └── app.js         # Frontend logic with JWT handling
└── venv/                  # Virtual environment
```

## 🏃 Getting Started

### Prerequisites
- Python 3.8 or higher
- MySQL 5.7 or higher (or MariaDB)
- pip (Python package manager)

### Installation

1. **Navigate to the project directory**
   ```bash
   cd /home/feather/webServer
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   nano .env  # Edit with your MySQL credentials
   ```

   Update the following in `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=todo_app
   
   SECRET_KEY=your-secret-key-change-this-in-production
   ```

3. **Create MySQL database**
   ```bash
   ./setup_db.sh
   ```

   Or manually:
   ```bash
   mysql -u root -p
   CREATE DATABASE todo_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

4. **Activate virtual environment**
   ```bash
   source venv/bin/activate
   ```

5. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

**Option 1: Using the start script**
```bash
./start.sh
```

**Option 2: Manual start**
```bash
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Access the application:**
- Web App: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

## 📡 API Endpoints

### Authentication Endpoints

#### Register
```bash
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "full_name": "John Doe"  // optional
}

Response: {
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": { "id": 1, "username": "johndoe", ... }
}
```

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword123"
}

Response: {
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": { "id": 1, "username": "johndoe", ... }
}
```

#### Get Current User
```bash
GET /auth/me
Authorization: Bearer <token>

Response: {
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00"
}
```

### Todo Endpoints (All require authentication)

#### Create Todo
```bash
POST /todos
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Learn FastAPI",
  "description": "Build awesome web applications",
  "completed": false
}
```

#### Get All Todos
```bash
GET /todos
Authorization: Bearer <token>

# Filter by completion status
GET /todos?completed=false
GET /todos?completed=true
```

#### Get Single Todo
```bash
GET /todos/{todo_id}
Authorization: Bearer <token>
```

#### Update Todo
```bash
PUT /todos/{todo_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

#### Delete Todo
```bash
DELETE /todos/{todo_id}
Authorization: Bearer <token>
```

## 🎨 Features in Detail

### User Authentication Flow
1. **Registration**: New users create an account with username, email, and password
2. **Login**: Existing users authenticate with username and password
3. **Token Storage**: JWT token is stored in browser localStorage
4. **Auto-login**: Users stay logged in across browser sessions
5. **Secure Logout**: Token is removed from localStorage

### Security Features
- **Password Hashing**: Passwords are hashed using bcrypt before storage
- **JWT Tokens**: Stateless authentication with configurable expiration
- **Token Validation**: Every protected endpoint validates the JWT token
- **SQL Injection Protection**: SQLAlchemy ORM prevents SQL injection
- **XSS Protection**: HTML escaping on frontend prevents XSS attacks
- **User Isolation**: Users can only access their own todos

### Database Features
- **Foreign Key Relationships**: Todos linked to users with CASCADE delete
- **Timestamps**: Automatic created_at and updated_at tracking
- **Indexes**: Optimized queries with indexes on username and email
- **UTF-8 Support**: Full Unicode support for international characters

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | (empty) |
| `DB_NAME` | Database name | `todo_app` |
| `SECRET_KEY` | JWT secret key | (must be changed!) |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration | `30` |

### Generate a Secure Secret Key

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

## 🐛 Troubleshooting

### MySQL Connection Issues

**Error: "Can't connect to MySQL server"**
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL
sudo systemctl start mysql

# Check connection
mysql -u root -p
```

**Error: "Access denied for user"**
- Verify credentials in `.env` file
- Reset MySQL password if needed
- Check user privileges

### Database Not Created

```bash
# Create manually
mysql -u root -p
CREATE DATABASE todo_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Tables Not Created

The tables are created automatically when the app starts. If they're not created:
```bash
# Check logs for errors
# Ensure database exists
# Verify DB credentials in .env
```

## 🚀 Production Deployment

### Important Security Steps

1. **Change the SECRET_KEY**
   ```bash
   python -c "import secrets; print(secrets.token_hex(32))"
   ```

2. **Use environment variables** (don't commit `.env`)
   ```bash
   echo ".env" >> .gitignore
   ```

3. **Use a strong database password**

4. **Enable HTTPS** (SSL/TLS)

5. **Restrict CORS origins**
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://yourdomain.com"],
       ...
   )
   ```

6. **Use a production ASGI server**
   ```bash
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
   ```

## 🧪 Testing

### Test User Registration
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123"}'
```

### Test Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

### Test Creating a Todo
```bash
curl -X POST http://localhost:8000/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"title":"Test task","description":"Testing API"}'
```

## 🎯 Future Enhancements

Potential improvements:
- [ ] Password reset functionality via email
- [ ] OAuth2 social login (Google, GitHub)
- [ ] Task categories and tags
- [ ] Due dates and reminders with email notifications
- [ ] Task priority levels
- [ ] Collaborative todos (share with other users)
- [ ] Task comments and attachments
- [ ] Search and advanced filtering
- [ ] Dark mode toggle
- [ ] Mobile app (React Native / Flutter)
- [ ] API rate limiting
- [ ] Redis caching for sessions
- [ ] Database migrations with Alembic

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements!

---

**Built with ❤️ using FastAPI & MySQL**

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
