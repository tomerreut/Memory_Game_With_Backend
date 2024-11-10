const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const path = require('path');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','index.html'));
});

let highScores = [];

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/api/high-scores', (req, res) => {
    highScores.sort((a, b) => a.time - b.time);
    res.json(highScores);
});

app.post('/api/save-score', (req, res) => {
    const { name, time, moves } = req.body;
    if (!name || !time || !moves) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }
    highScores.push({ name, time, moves });
    if (highScores.length > 10) {
        highScores = highScores.slice(0, 10);
    }
    res.status(201).json({ message: 'Score saved successfully!' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});