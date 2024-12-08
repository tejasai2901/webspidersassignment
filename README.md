# Task Management API

This is a simple task management API built using Node.js, Express, and SQLite. The API supports CRUD operations for managing tasks.

## Features
- Create new tasks
- Fetch tasks with filtering, sorting, and pagination
- Fetch a task by ID
- Update task details
- Delete tasks

---

## Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (version 14 or higher)
- **npm** (Node Package Manager)
- **SQLite3**

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/task-management-api.git
cd task-management-api
2. Install Dependencies
Install the required Node.js packages:

bash
Copy code
npm install
3. Set Up the Database
Create a file named tasks.db in the project directory.
Run the following SQL commands to create the necessary table:
sql
Copy code
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'TODO',
    priority TEXT DEFAULT 'MEDIUM',
    dueDate TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
4. Start the Server
Run the following command to start the server:

bash
Copy code
node index.js
The server will start at http://localhost:3000.

API Endpoints
1. Create a Task
POST /tasks

Request Body:

json
Copy code
{
  "title": "Complete the project",
  "description": "Finalize the backend implementation",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2024-12-10"
}
Response:

json
Copy code
{
  "id": 1
}
2. Get All Tasks
GET /tasks

Query Parameters (optional):

status: Filter by task status (TODO, IN_PROGRESS, DONE)
priority: Filter by priority (HIGH, MEDIUM, LOW)
sort: Column to sort by (title, createdAt, priority)
order: Sorting order (ASC or DESC)
limit: Number of records to fetch (default: 10)
skip: Number of records to skip (default: 0)
Response:

json
Copy code
[
  {
    "id": 1,
    "title": "Complete the project",
    "description": "Finalize the backend implementation",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "dueDate": "2024-12-10",
    "createdAt": "2024-12-08T10:30:00",
    "updatedAt": "2024-12-08T10:30:00"
  }
]
3. Get a Task by ID
GET /tasks/:id

Response:

json
Copy code
{
  "id": 1,
  "title": "Complete the project",
  "description": "Finalize the backend implementation",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2024-12-10",
  "createdAt": "2024-12-08T10:30:00",
  "updatedAt": "2024-12-08T10:30:00"
}
4. Update a Task
PUT /tasks/:id

Request Body:

json
Copy code
{
  "status": "DONE"
}
Response:

json
Copy code
{
  "message": "Task updated successfully."
}
5. Delete a Task
DELETE /tasks/:id

Response:

Status Code: 204 (No Content)
Error Handling
400 Bad Request: Missing or invalid fields in the request body.
404 Not Found: Task not found.
500 Internal Server Error: Database or server errors.
Development
Install Nodemon for Development
To auto-restart the server during development, use nodemon:

bash
Copy code
npm install -g nodemon
nodemon index.js
License
This project is licensed under the MIT License. Feel free to use, modify, and distribute this code.

