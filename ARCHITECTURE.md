# 🏗️ System Architecture Diagram

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Web Browser                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Frontend (SPA)                         │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │   HTML5      │  │     CSS3     │  │  JavaScript  │  │   │
│  │  │ (Structure)  │  │  (Styling)   │  │   (Logic)    │  │   │
│  │  │              │  │              │  │              │  │   │
│  │  │ - Auth Modal │  │ - Gradients  │  │ - Fetch API  │  │   │
│  │  │ - Todo List  │  │ - Animations │  │ - JWT Handle │  │   │
│  │  │ - Filters    │  │ - Responsive │  │ - LocalStore │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP/HTTPS
                            │ JSON + JWT Token
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FastAPI Backend                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    API Endpoints                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │ Auth Routes  │  │ Todo Routes  │  │   Utility    │  │   │
│  │  │              │  │              │  │              │  │   │
│  │  │ /register    │  │ GET /todos   │  │ /health      │  │   │
│  │  │ /login       │  │ POST /todos  │  │ /docs        │  │   │
│  │  │ /me          │  │ PUT /todos   │  │ / (web)      │  │   │
│  │  │              │  │ DELETE /todos│  │              │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                     │
│  ┌─────────────────────────┴───────────────────────────────┐   │
│  │              Middleware & Security                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │     CORS     │  │     JWT      │  │  Validation  │  │   │
│  │  │ (Allow all)  │  │ (Bearer)     │  │  (Pydantic)  │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  └─────────────────────────┬───────────────────────────────┘   │
│                            │                                     │
│  ┌─────────────────────────┴───────────────────────────────┐   │
│  │               Business Logic Layer                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │   auth.py    │  │ database.py  │  │   main.py    │  │   │
│  │  │              │  │              │  │              │  │   │
│  │  │ - Hash PWD   │  │ - Models     │  │ - Routes     │  │   │
│  │  │ - Verify PWD │  │ - Session    │  │ - Handlers   │  │   │
│  │  │ - Create JWT │  │ - Connection │  │ - Logic      │  │   │
│  │  │ - Decode JWT │  │              │  │              │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  └─────────────────────────┬───────────────────────────────┘   │
└────────────────────────────┼─────────────────────────────────────┘
                             │ SQLAlchemy ORM
                             │ PyMySQL Driver
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       MySQL Database                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                      Tables                               │   │
│  │  ┌──────────────────────────┐  ┌──────────────────────┐ │   │
│  │  │      users               │  │       todos          │ │   │
│  │  │  ┌────────────────────┐  │  │  ┌────────────────┐ │ │   │
│  │  │  │ id (PK)            │  │  │  │ id (PK)        │ │ │   │
│  │  │  │ username (UNIQUE)  │  │  │  │ title          │ │ │   │
│  │  │  │ email (UNIQUE)     │  │  │  │ description    │ │ │   │
│  │  │  │ hashed_password    │  │  │  │ completed      │ │ │   │
│  │  │  │ full_name          │  │  │  │ user_id (FK) ──┼─┼─┼──┐│
│  │  │  │ is_active          │  │  │  │ created_at     │ │ │  ││
│  │  │  │ created_at         │  │  │  │ updated_at     │ │ │  ││
│  │  │  │ updated_at         │  │  │  └────────────────┘ │ │  ││
│  │  │  └────────────────────┘  │  └──────────────────────┘ │  ││
│  │  └──────────────────────────┘                            │  ││
│  │              │                                            │  ││
│  │              └────────────────────────────────────────────┘  ││
│  │                    Foreign Key Relationship                  │
│  │                    (CASCADE DELETE)                          │
│  └─────────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌──────────┐                                    ┌──────────┐
│          │  1. POST /auth/register            │          │
│          │    {username, email, password}     │          │
│          ├───────────────────────────────────>│          │
│          │                                    │          │
│          │  2. Hash password with bcrypt     │          │
│  Client  │  3. Store user in database        │  Server  │
│          │  4. Generate JWT token            │          │
│          │                                    │          │
│          │<───────────────────────────────────┤          │
│          │  5. Return {token, user}          │          │
│          │                                    │          │
│          │  6. Store token in localStorage   │          │
└──────────┘                                    └──────────┘

┌──────────┐                                    ┌──────────┐
│          │  1. POST /auth/login               │          │
│          │    {username, password}            │          │
│          ├───────────────────────────────────>│          │
│          │                                    │          │
│          │  2. Find user by username         │          │
│  Client  │  3. Verify password hash          │  Server  │
│          │  4. Generate JWT token            │          │
│          │                                    │          │
│          │<───────────────────────────────────┤          │
│          │  5. Return {token, user}          │          │
└──────────┘                                    └──────────┘
```

## Todo CRUD Flow

```
┌──────────┐                                    ┌──────────┐
│          │  1. POST /todos                    │          │
│          │    Authorization: Bearer <token>   │          │
│          │    {title, description}            │          │
│          ├───────────────────────────────────>│          │
│          │                                    │          │
│          │  2. Validate JWT token            │          │
│          │  3. Extract user_id from token    │          │
│  Client  │  4. Create todo with user_id      │  Server  │
│          │  5. Save to database              │          │
│          │                                    │          │
│          │<───────────────────────────────────┤          │
│          │  6. Return created todo           │          │
│          │                                    │          │
│          │  7. Update UI                     │          │
└──────────┘                                    └──────────┘

┌──────────┐                                    ┌──────────┐
│          │  1. GET /todos                     │          │
│          │    Authorization: Bearer <token>   │          │
│          ├───────────────────────────────────>│          │
│          │                                    │          │
│          │  2. Validate JWT token            │          │
│  Client  │  3. Extract user_id               │  Server  │
│          │  4. Query todos WHERE user_id     │          │
│          │                                    │          │
│          │<───────────────────────────────────┤          │
│          │  5. Return user's todos only      │          │
└──────────┘                                    └──────────┘
```

## Data Flow Diagram

```
User Action               Frontend                Backend                Database
────────────              ────────                ───────                ────────

[Register] ──────> Store form data ────> Hash password ──────> INSERT INTO users
                         │                Create JWT              │
                         │<───────────── Return token <───────────┘
                         │
                   Store in localStorage
                         │
                   Show main app


[Login] ─────────> Get credentials ────> Verify password ─────> SELECT FROM users
                         │                Generate JWT             │
                         │<───────────── Return token <────────────┘
                         │
                   Store in localStorage
                         │
                   Show main app


[Add Todo] ──────> Collect input ───────> Validate token ──────> INSERT INTO todos
                   Include JWT            Extract user_id         (with user_id)
                         │                Create todo              │
                         │<───────────── Return todo <─────────────┘
                         │
                   Update UI
                   Show toast


[Get Todos] ─────> Send request ────────> Validate token ──────> SELECT FROM todos
                   with JWT               Filter by user_id       WHERE user_id = X
                         │                                         │
                         │<───────────── Return todos <────────────┘
                         │
                   Render list


[Complete] ──────> Toggle checkbox ─────> Validate token ──────> UPDATE todos
                   Send PUT request       Update completed        SET completed = X
                   Include JWT            field                   WHERE id = Y
                         │                                         │
                         │<───────────── Return updated <──────────┘
                         │
                   Update UI


[Delete] ────────> Confirm action ──────> Validate token ──────> DELETE FROM todos
                   Send DELETE            Check ownership         WHERE id = Y
                   Include JWT                                    AND user_id = X
                         │                                         │
                         │<───────────── Success 204 <─────────────┘
                         │
                   Remove from UI


[Logout] ────────> Clear localStorage
                   Redirect to login
```

## Security Layers

```
┌─────────────────────────────────────────────────────┐
│  Layer 1: Client-Side                               │
│  - Input validation                                 │
│  - HTML escaping (XSS protection)                   │
│  - Token storage in localStorage                    │
└─────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│  Layer 2: Transport                                 │
│  - HTTPS (recommended for production)               │
│  - Bearer token in Authorization header             │
└─────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│  Layer 3: API Middleware                            │
│  - CORS configuration                               │
│  - JWT token validation                             │
│  - Token expiration check                           │
└─────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│  Layer 4: Application Logic                         │
│  - Pydantic input validation                        │
│  - User authorization (user_id check)               │
│  - Business rule enforcement                        │
└─────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│  Layer 5: Database Access                           │
│  - SQLAlchemy ORM (SQL injection prevention)        │
│  - Parameterized queries                            │
│  - Foreign key constraints                          │
└─────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│  Layer 6: Database Storage                          │
│  - Encrypted connections (optional)                 │
│  - Password hashes (bcrypt)                         │
│  - No plain-text sensitive data                     │
└─────────────────────────────────────────────────────┘
```

## Component Interaction

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│             │         │             │         │             │
│  Templates  │────────>│   Static    │────────>│   Browser   │
│   (HTML)    │  Serve  │ Files (CSS, │  Load   │   Renders   │
│             │         │     JS)     │         │             │
└─────────────┘         └─────────────┘         └─────────────┘
                                                       │
                                                       │ User Action
                                                       ▼
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│             │         │             │         │             │
│  JavaScript │<────────│  API Call   │────────>│  FastAPI    │
│   (app.js)  │ Response│ (Fetch)     │ Request │  (main.py)  │
│             │         │             │         │             │
└─────────────┘         └─────────────┘         └─────────────┘
                                                       │
                                                       │ Needs Auth
                                                       ▼
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│             │         │             │         │             │
│  JWT Token  │────────>│  Validate   │────────>│   Extract   │
│  (Header)   │  Check  │   (jose)    │  OK     │   user_id   │
│             │         │             │         │             │
└─────────────┘         └─────────────┘         └─────────────┘
                                                       │
                                                       │ Query Data
                                                       ▼
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│             │         │             │         │             │
│ SQLAlchemy  │────────>│   MySQL     │────────>│   Return    │
│    ORM      │  Query  │  Database   │  Result │    Data     │
│             │         │             │         │             │
└─────────────┘         └─────────────┘         └─────────────┘
```

## File Dependencies

```
main.py
├── database.py
│   ├── sqlalchemy
│   ├── pymysql
│   └── .env (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
├── auth.py
│   ├── passlib (bcrypt)
│   ├── python-jose (JWT)
│   └── .env (SECRET_KEY, ALGORITHM)
├── fastapi
├── pydantic
└── uvicorn

index.html
├── /static/css/style.css
└── /static/js/app.js
    ├── Fetch API
    ├── localStorage
    └── DOM API

requirements.txt
├── All Python packages
└── Versions pinned
```

This architecture provides:
✅ Separation of concerns
✅ Scalability
✅ Security
✅ Maintainability
✅ Testability
