from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

app = FastAPI(title="TODO API", version="1.0.0")

# Mount static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

class Todo(TodoBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# In-memory storage
todos: dict[str, dict] = {}

# API endpoints
@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    """Serve the main TODO web application"""
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/api")
async def api_root():
    return {"message": "TODO API - visit /docs for API documentation"}

@app.post("/todos", response_model=Todo, status_code=201)
async def create_todo(todo: TodoCreate):
    """Create a new TODO item"""
    todo_id = str(uuid.uuid4())
    now = datetime.now()

    todo_data = {
        "id": todo_id,
        "title": todo.title,
        "description": todo.description,
        "completed": todo.completed,
        "created_at": now,
        "updated_at": now
    }

    todos[todo_id] = todo_data
    return todo_data

@app.get("/todos", response_model=List[Todo])
async def get_todos(completed: Optional[bool] = None):
    """Get all TODO items, optionally filtered by completion status"""
    result = list(todos.values())

    if completed is not None:
        result = [todo for todo in result if todo["completed"] == completed]

    return result

@app.get("/todos/{todo_id}", response_model=Todo)
async def get_todo(todo_id: str):
    """Get a specific TODO item by ID"""
    if todo_id not in todos:
        raise HTTPException(status_code=404, detail="TODO not found")

    return todos[todo_id]

@app.put("/todos/{todo_id}", response_model=Todo)
async def update_todo(todo_id: str, todo_update: TodoUpdate):
    """Update a TODO item"""
    if todo_id not in todos:
        raise HTTPException(status_code=404, detail="TODO not found")

    todo = todos[todo_id]

    # Update fields if provided
    if todo_update.title is not None:
        todo["title"] = todo_update.title
    if todo_update.description is not None:
        todo["description"] = todo_update.description
    if todo_update.completed is not None:
        todo["completed"] = todo_update.completed

    todo["updated_at"] = datetime.now()

    return todo

@app.delete("/todos/{todo_id}", status_code=204)
async def delete_todo(todo_id: str):
    """Delete a TODO item"""
    if todo_id not in todos:
        raise HTTPException(status_code=404, detail="TODO not found")

    del todos[todo_id]
    return None

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "total_todos": len(todos)}
