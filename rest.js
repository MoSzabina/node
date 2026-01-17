const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'feladat2'
});

connection.connect(err => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Kapcsolódva az adatbázishoz!');
});

/* ===== QUERY PROMISE – PONT MINT A KÖNYVBEN ===== */
function queryPromise(query, value) {
    return new Promise((resolve, reject) => {
        connection.query(query, value, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

/* ===== GET ===== */
app.get('/dolgozo', async (req, res) => {
    try {
        const query = "SELECT * FROM dolgozok";
        const result = await queryPromise(query);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Some issue occurred" });
    }
});

/* ===== POST ===== */
app.post('/dolgozo', async (req, res) => {
    try {
        const value = req.body;
        const query = "INSERT INTO dolgozok SET ?";
        const result = await queryPromise(query, value);
        res.status(201).json({ message: "Data successfully inserted" });
        console.log(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Some issue occurred" });
    }
});

/* ===== PUT ===== */
app.put('/dolgozo/:id', async (req, res) => {
    try {
        const value = req.body;
        const id = req.params.id;
        const query = "UPDATE dolgozok SET ? WHERE id=?";
        const result = await queryPromise(query, [value, id]);
        res.status(200).json({ message: "Data successfully updated" });
        console.log(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Some issue occurred" });
    }
});

/* ===== DELETE ===== */
app.delete('/dolgozo/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = "DELETE FROM dolgozok WHERE id=?";
        const result = await queryPromise(query, id);
        res.status(200).json({ message: "Data successfully deleted" });
        console.log(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Some issue occurred" });
    }
});

app.listen(5000, () => {
    console.log('REST szerver fut: http://localhost:5000');
});
