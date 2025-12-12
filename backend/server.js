const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;
const DB_SOURCE = path.join(__dirname, "portal.db");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- Database Initialization ---
const db = new sqlite3.Database(DB_SOURCE, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
        console.log('Database location:', DB_SOURCE);
        
        // Create Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error('Error creating users table:', err);
                return;
            }
            console.log('Users table ready.');
            
            // Check if users exist, if not seed them
            db.get("SELECT count(*) as count FROM users", (err, row) => {
                if (err) {
                    console.error('Error checking users:', err);
                    return;
                }
                if (row && row.count === 0) {
                    const insert = 'INSERT INTO users (name, email, password) VALUES (?,?,?)';
                    db.run(insert, ["Alice Writer", "alice@example.com", "password123"]);
                    db.run(insert, ["Bob Commenter", "bob@example.com", "password123"]);
                    db.run(insert, ["Charlie Editor", "charlie@example.com", "password123"]);
                    console.log("Seeded Users table with 3 default users.");
                } else {
                    console.log(`Users table already has ${row.count} users.`);
                }
            });
        });

        // Create News Table
        // We store 'comments' as a TEXT field containing a JSON string to keep the nested structure required.
        db.run(`CREATE TABLE IF NOT EXISTS news (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            body TEXT NOT NULL,
            author_id INTEGER NOT NULL,
            comments TEXT DEFAULT '[]',
            FOREIGN KEY (author_id) REFERENCES users(id)
        )`, (err) => {
            if (err) {
                console.error('Error creating news table:', err);
                return;
            }
            console.log('News table ready.');

            // Check if news exist, if not seed them
            db.get("SELECT count(*) as count FROM news", (err, row) => {
                if (err) {
                    console.error('Error checking news:', err);
                    return;
                }
                if (row && row.count === 0) {
                    const insert = 'INSERT INTO news (title, body, author_id, comments) VALUES (?,?,?,?)';
                    const initialComments = JSON.stringify([
                        { id: 1, text: "Great first post!", user_id: 2, timestamp: new Date().toISOString() }
                    ]);
                    db.run(insert, [
                        "Welcome to the News Portal", 
                        "This is the very first post on our new portal. It contains more than twenty characters and provides a great introduction to what you can expect from this platform.", 
                        1, 
                        initialComments
                    ], (err) => {
                        if (err) {
                            console.error('Error seeding news:', err);
                        } else {
                            console.log("Seeded News table with initial article.");
                        }
                    });
                } else {
                    console.log(`News table already has ${row.count} articles.`);
                }
            });
        });
    }
});

// --- Helper: Parse JSON comments ---
// SQLite returns the comments column as a string, we need to convert it back to an Array for the API
const parseNewsItem = (item) => {
    if (!item) return null;
    return {
        ...item,
        comments: JSON.parse(item.comments || "[]")
    };
};

// --- REST API Endpoints ---

// 1. GET /users (List all users)
app.get('/users', (req, res) => {
    db.all("SELECT id, name, email FROM users", [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(rows);
    });
});

// 2. GET /users/:id (Get single user)
app.get('/users/:id', (req, res) => {
    db.get("SELECT id, name, email FROM users WHERE id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        if (row) res.json(row);
        else res.status(404).json({ error: "User not found" });
    });
});

// POST /users (Create user - signup)
app.post('/users', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required." });
    }
    const sql = `INSERT INTO users (name, email, password) VALUES (?,?,?)`;
    const params = [name, email, password];
    db.run(sql, params, function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: "Email already exists." });
            }
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({
            user: {
                id: this.lastID,
                name,
                email,
            },
            message: "User created successfully"
        });
    });
});

// POST /login (Login user)
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }
    db.get("SELECT id, name, email FROM users WHERE email = ? AND password = ?", [email, password], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        if (row) {
            res.json({ user: row, message: "Login successful" });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    });
});


// 3. GET /news (List all news with search and pagination)
app.get('/news', (req, res) => {
    const { search, page = 1, limit = 9 } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 9;
    const offset = (pageNum - 1) * limitNum;

    let countQuery = "SELECT COUNT(*) as total FROM news";
    let dataQuery = "SELECT * FROM news";
    let params = [];

    // Add search filter if provided
    if (search && search.trim() !== '') {
        const searchTerm = `%${search.trim()}%`;
        countQuery += " WHERE title LIKE ?";
        dataQuery += " WHERE title LIKE ?";
        params.push(searchTerm);
    }

    // Add ordering and pagination
    dataQuery += " ORDER BY id DESC LIMIT ? OFFSET ?";

    // First get total count for pagination
    db.get(countQuery, params, (err, countResult) => {
        if (err) return res.status(400).json({ error: err.message });

        const total = countResult.total;
        const totalPages = Math.ceil(total / limitNum);

        // Then get paginated data
        db.all(dataQuery, [...params, limitNum, offset], (err, rows) => {
            if (err) return res.status(400).json({ error: err.message });
            
            // Parse the comments string into JSON for every row and add comment count
            const newsList = rows.map(item => {
                const parsed = parseNewsItem(item);
                return {
                    ...parsed,
                    commentCount: parsed.comments ? parsed.comments.length : 0
                };
            });

            res.json({
                data: newsList,
                pagination: {
                    currentPage: pageNum,
                    totalPages: totalPages,
                    totalItems: total,
                    itemsPerPage: limitNum,
                    hasNextPage: pageNum < totalPages,
                    hasPrevPage: pageNum > 1
                }
            });
        });
    });
});

// 4. GET /news/:id (Get full news including comments)
app.get('/news/:id', (req, res) => {
    db.get("SELECT * FROM news WHERE id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        if (row) res.json(parseNewsItem(row));
        else res.status(404).json({ error: "News item not found" });
    });
});

// 5. POST /news (Create news item)
app.post('/news', (req, res) => {
    const { title, body, author_id } = req.body;
    
    // VALIDATION RULES
    if (!title || title.trim() === "") {
        return res.status(400).json({ error: "News title cannot be empty." });
    }
    if (!body || body.length < 20) {
        return res.status(400).json({ error: "News body must be at least 20 characters." });
    }
    if (!author_id) {
        return res.status(400).json({ error: "Author ID is required." });
    }

    const sql = `INSERT INTO news (title, body, author_id, comments) VALUES (?,?,?,?)`;
    const params = [title, body, author_id, "[]"]; // Start with empty comments array

    db.run(sql, params, function (err) {
        if (err) return res.status(400).json({ error: err.message });
        
        // Return the created object with the new ID
        res.status(201).json({
            id: this.lastID,
            title,
            body,
            author_id,
            comments: []
        });
    });
});

// 6. PATCH /news/:id (Edit news OR Add Comment)
app.patch('/news/:id', (req, res) => {
    const newsId = req.params.id;
    const { title, body, comments } = req.body;
    const loggedInUserId = req.headers['x-user-id']; // Simulated Auth Header

    // First, fetch the existing item to perform validation checks
    db.get("SELECT * FROM news WHERE id = ?", [newsId], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "News item not found" });

        const currentNews = parseNewsItem(row);

        // -- Logic: Updating Comments --
        if (comments) {
            // Validation: Check if the last comment added is empty
            if (comments.length > 0) {
                const lastComment = comments[comments.length - 1];
                if (!lastComment.text || lastComment.text.trim() === "") {
                    return res.status(400).json({ error: "Comment text cannot be empty." });
                }
            }
            
            const sql = `UPDATE news SET comments = ? WHERE id = ?`;
            db.run(sql, [JSON.stringify(comments), newsId], (err) => {
                if (err) return res.status(400).json({ error: err.message });
                // Return updated item
                currentNews.comments = comments;
                res.json(currentNews);
            });
        } 
        
        // -- Logic: Editing Title/Body --
        else if (title || body) {
            // Validation: Permission Check
            if (loggedInUserId && parseInt(loggedInUserId) !== currentNews.author_id) {
                return res.status(403).json({ error: "Permission denied. You can only edit your own posts." });
            }

            let newTitle = currentNews.title;
            let newBody = currentNews.body;

            if (title !== undefined) {
                if (title.trim() === "") return res.status(400).json({ error: "News title cannot be empty." });
                newTitle = title;
            }
            if (body !== undefined) {
                if (body.length < 20) return res.status(400).json({ error: "News body must be at least 20 characters." });
                newBody = body;
            }

            const sql = `UPDATE news SET title = ?, body = ? WHERE id = ?`;
            db.run(sql, [newTitle, newBody, newsId], (err) => {
                if (err) return res.status(400).json({ error: err.message });
                currentNews.title = newTitle;
                currentNews.body = newBody;
                res.json(currentNews);
            });
        } else {
            res.json(currentNews); // Nothing changed
        }
    });
});

// 7. DELETE /news/:id (Delete news item)
app.delete('/news/:id', (req, res) => {
    const newsId = req.params.id;
    const loggedInUserId = req.headers['x-user-id'];

    // Fetch first to check author permissions
    db.get("SELECT author_id FROM news WHERE id = ?", [newsId], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "News item not found" });

        // Validation: Permission Check
        if (loggedInUserId && parseInt(loggedInUserId) !== row.author_id) {
            return res.status(403).json({ error: "Permission denied. You can only delete your own posts." });
        }

        db.run("DELETE FROM news WHERE id = ?", [newsId], (err) => {
            if (err) return res.status(400).json({ error: err.message });
            res.status(200).json({ message: "Deleted successfully" });
        });
    });
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log('========================================');
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📚 API Resources:`);
    console.log(`   - Users: http://localhost:${PORT}/users`);
    console.log(`   - News:  http://localhost:${PORT}/news`);
    console.log(`   - Login: POST http://localhost:${PORT}/login`);
    console.log('========================================');
});

// Handle server errors
app.on('error', (error) => {
    console.error('Server error:', error);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down gracefully...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});