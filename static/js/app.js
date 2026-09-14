// API base URL
const API_URL = '/todos';

// State
let currentFilter = 'all';
let todos = [];

// DOM elements
const todoForm = document.getElementById('todoForm');
const todoTitleInput = document.getElementById('todoTitle');
const todoDescriptionInput = document.getElementById('todoDescription');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const todoCount = document.getElementById('todoCount');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    todoForm.addEventListener('submit', handleAddTodo);

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentFilter = e.target.dataset.filter;
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderTodos();
        });
    });
}

// Load todos from API
async function loadTodos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch todos');

        todos = await response.json();
        renderTodos();
    } catch (error) {
        showToast('Failed to load todos', 'error');
        console.error('Error loading todos:', error);
    }
}

// Handle add todo
async function handleAddTodo(e) {
    e.preventDefault();

    const title = todoTitleInput.value.trim();
    const description = todoDescriptionInput.value.trim();

    if (!title) {
        showToast('Please enter a task title', 'error');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description: description || null,
                completed: false
            })
        });

        if (!response.ok) throw new Error('Failed to create todo');

        const newTodo = await response.json();
        todos.push(newTodo);

        // Clear form
        todoTitleInput.value = '';
        todoDescriptionInput.value = '';
        todoTitleInput.focus();

        renderTodos();
        showToast('Task added successfully!', 'success');
    } catch (error) {
        showToast('Failed to add task', 'error');
        console.error('Error adding todo:', error);
    }
}

// Toggle todo completion
async function toggleTodo(todoId) {
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;

    try {
        const response = await fetch(`${API_URL}/${todoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                completed: !todo.completed
            })
        });

        if (!response.ok) throw new Error('Failed to update todo');

        const updatedTodo = await response.json();
        const index = todos.findIndex(t => t.id === todoId);
        todos[index] = updatedTodo;

        renderTodos();
        showToast(updatedTodo.completed ? 'Task completed!' : 'Task reopened', 'success');
    } catch (error) {
        showToast('Failed to update task', 'error');
        console.error('Error updating todo:', error);
    }
}

// Delete todo
async function deleteTodo(todoId) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        const response = await fetch(`${API_URL}/${todoId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete todo');

        todos = todos.filter(t => t.id !== todoId);
        renderTodos();
        showToast('Task deleted', 'success');
    } catch (error) {
        showToast('Failed to delete task', 'error');
        console.error('Error deleting todo:', error);
    }
}

// Render todos
function renderTodos() {
    // Filter todos based on current filter
    let filteredTodos = todos;

    if (currentFilter === 'active') {
        filteredTodos = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(t => t.completed);
    }

    // Sort by creation date (newest first)
    filteredTodos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Update count
    const activeCount = todos.filter(t => !t.completed).length;
    todoCount.textContent = `${activeCount} ${activeCount === 1 ? 'task' : 'tasks'}`;

    // Show empty state if no todos
    if (filteredTodos.length === 0) {
        todoList.innerHTML = '';
        emptyState.classList.add('show');
        return;
    }

    emptyState.classList.remove('show');

    // Render todo items
    todoList.innerHTML = filteredTodos.map(todo => createTodoElement(todo)).join('');

    // Add event listeners
    filteredTodos.forEach(todo => {
        const todoElement = document.querySelector(`[data-id="${todo.id}"]`);
        const checkbox = todoElement.querySelector('.todo-checkbox');
        const deleteBtn = todoElement.querySelector('.btn-delete');

        checkbox.addEventListener('click', () => toggleTodo(todo.id));
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
    });
}

// Create todo element HTML
function createTodoElement(todo) {
    const createdDate = new Date(todo.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return `
        <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
            <div class="todo-checkbox ${todo.completed ? 'checked' : ''}"></div>
            <div class="todo-content">
                <div class="todo-title">${escapeHtml(todo.title)}</div>
                ${todo.description ? `<div class="todo-description">${escapeHtml(todo.description)}</div>` : ''}
                <div class="todo-meta">Created: ${createdDate}</div>
            </div>
            <div class="todo-actions">
                <button class="btn-icon btn-delete" title="Delete task">
                    🗑️
                </button>
            </div>
        </div>
    `;
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Auto-save on page unload
window.addEventListener('beforeunload', () => {
    // Nothing to do since we're using API
});