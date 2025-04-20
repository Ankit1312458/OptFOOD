// app.js
const express = require('express');
const db = require('./db'); // Import the database connection

const app = express();
app.use(express.json());

// Route to add a donation
app.post('/donations', (req, res) => {
    const { item_name, quantity, is_prepared } = req.body;
    const query = 'INSERT INTO donations (item_name, quantity, is_prepared) VALUES (?, ?, ?)';
    db.query(query, [item_name, quantity, is_prepared], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: results.insertId, item_name, quantity, is_prepared });
    });
});

// Route to get all donations
app.get('/donations', (req, res) => {
    db.query('SELECT * FROM donations', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});