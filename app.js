const express = require('express');
const {open} = require('sqlite');
const sqlite3 = require('sqlite3')
const path = require('path');

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname,'tasks.db');

let db = null 

const connectDatabase = async ()=>{
    try{
        db = await open({
            filename:dbPath,
            driver:sqlite3.Database
        })
        app.listen(3000, () => {
            console.log(`Server running at http://localhost:3000`);

        });
    }
    catch(e){
        console.log(`Error at ${e.message}`)
        process.exit(1);
    }

}

connectDatabase()


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: err.message });
});

app.post('/tasks', (req, res) => {
    const { title, description, status = 'TODO', priority = 'MEDIUM', dueDate } = req.body;

    if (!title || title.length > 100) {
        return res.status(400).send({ error: 'Title is required and must be less than 100 characters.' });
    }

    const query = `
        INSERT INTO tasks (title, description, status, priority, dueDate)
        VALUES (?, ?, ?, ?, ?);
    `;
    db.run(query, [title, description, status, priority, dueDate], function (err) {
        if (err) {
            return res.status(500).send({ error: 'Failed to create task.' });
        }
        res.status(201).send({ id: this.lastID });
    });
});


app.get('/tasks', async (req, res) => {
    const { status, priority, sort = 'createdAt', order = 'ASC', limit = 10, skip = 0 } = req.query;

    const filters = [];
    if (status) filters.push(`status = '${status}'`);
    if (priority) filters.push(`priority = '${priority}'`);

    const filterQuery = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
    const sortQuery = `ORDER BY ${sort} ${order.toUpperCase()}`;
    const paginationQuery = `LIMIT ${limit} OFFSET ${skip}`;

    const query = `
        SELECT * FROM tasks
        ${filterQuery}
        ${sortQuery}
        ${paginationQuery};
    `;

    await db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).send({ error: 'Failed to fetch tasks.' });
        }
        res.send(rows);
    });
});


app.get('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM tasks WHERE id = ?;`;

    db.get(query, [id], (err, row) => {
        if (err) {
            return res.status(500).send({ error: 'Failed to fetch task.' });
        }
        if (!row) {
            return res.status(404).send({ error: 'Task not found.' });
        }
        res.send(row);
    });
});


app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    const query = `
        UPDATE tasks
        SET title = COALESCE(?, title),
            description = COALESCE(?, description),
            status = COALESCE(?, status),
            priority = COALESCE(?, priority),
            dueDate = COALESCE(?, dueDate),
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?;
    `;

    db.run(query, [title, description, status, priority, dueDate, id], function (err) {
        if (err) {
            return res.status(500).send({ error: 'Failed to update task.' });
        }
        if (this.changes === 0) {
            return res.status(404).send({ error: 'Task not found.' });
        }
        res.send({ message: 'Task updated successfully.' });
    });
});


app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM tasks WHERE id = ?;`;

    db.run(query, [id], function (err) {
        if (err) {
            return res.status(500).send({ error: 'Failed to delete task.' });
        }
        if (this.changes === 0) {
            return res.status(404).send({ error: 'Task not found.' });
        }
        res.status(204).send();
    });
});


