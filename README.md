# 📝 TODO Web Application

A modern, responsive TODO list web application built with **FastAPI** backend and vanilla **HTML/CSS/JavaScript** frontend.

## 🚀 Features

- ✅ Create, read, update, and delete TODO items
- 🎯 Mark tasks as complete/incomplete
- 🔍 Filter tasks by status (All, Active, Completed)
- 📱 Responsive design that works on all devices
- 🎨 Beautiful gradient UI with smooth animations
- 🔔 Toast notifications for user feedback
- 💾 RESTful API backend
- ⚡ Fast and lightweight

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **Pydantic** - Data validation using Python type annotations
- **Uvicorn** - Lightning-fast ASGI server

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations and gradients
- **Vanilla JavaScript** - No framework dependencies
- **Fetch API** - For AJAX requests

## 📁 Project Structure

```
webServer/
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
├── templates/
│   └── index.html         # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css      # Application styles
│   └── js/
│       └── app.js         # Frontend logic
└── venv/                  # Virtual environment
```

## 🏃 Getting Started

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd /home/feather/webServer
   ```

2. **Activate the virtual environment**
   ```bash
   source venv/bin/activate
   ```

3. **Install dependencies** (already done)
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

1. **Start the server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Open your browser**
   - Navigate to: `http://localhost:8000`
   - API documentation: `http://localhost:8000/docs`

## 📡 API Endpoints

### Web Interface
- `GET /` - Main web application

### API Endpoints
- `GET /api` - API information
- `POST /todos` - Create a new TODO
- `GET /todos` - Get all TODOs (optional query: `?completed=true/false`)
- `GET /todos/{todo_id}` - Get a specific TODO
- `PUT /todos/{todo_id}` - Update a TODO
- `DELETE /todos/{todo_id}` - Delete a TODO
- `GET /health` - Health check endpoint

## 📝 API Usage Examples

### Create a TODO
```bash
curl -X POST "http://localhost:8000/todos" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn FastAPI",
    "description": "Build awesome web applications",
    "completed": false
  }'
```

### Get all TODOs
```bash
curl "http://localhost:8000/todos"
```

### Get active TODOs only
```bash
curl "http://localhost:8000/todos?completed=false"
```

### Update a TODO
```bash
curl -X PUT "http://localhost:8000/todos/{todo_id}" \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
```

### Delete a TODO
```bash
curl -X DELETE "http://localhost:8000/todos/{todo_id}"
```

## 🎨 Features Explanation

### Frontend Features
- **Real-time Updates**: All changes are immediately reflected in the UI
- **Filter System**: View all tasks, only active, or only completed
- **Task Counter**: See how many active tasks you have
- **Toast Notifications**: Get feedback on every action
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Engaging slide-in and hover effects
- **Empty State**: Friendly message when no tasks exist

### Backend Features
- **CORS Enabled**: Can be accessed from any origin
- **Data Validation**: Pydantic models ensure data integrity
- **RESTful Design**: Clean and intuitive API structure
- **In-Memory Storage**: Fast operations (can be replaced with database)
- **Automatic Documentation**: Interactive API docs at `/docs`

## 🔧 Configuration

### Change Server Port
Edit the uvicorn command:
```bash
uvicorn main:app --reload --port 3000
```

### Enable/Disable CORS
In `main.py`, modify the CORS middleware settings:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🚀 Future Enhancements

Potential improvements for this project:
- [ ] Add database persistence (PostgreSQL, MongoDB)
- [ ] User authentication and authorization
- [ ] Task categories and tags
- [ ] Due dates and reminders
- [ ] Task priority levels
- [ ] Search functionality
- [ ] Dark/light theme toggle
- [ ] Drag-and-drop task reordering
- [ ] Task editing inline
- [ ] Export/import tasks

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements!

---

**Built with ❤️ using FastAPI**
