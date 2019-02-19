const express = require('express');
const open = require('opn');
const Path = require('path');
const app = express();


app.use('/rme/', express.static(Path.resolve(__dirname, '../docs')));

app.get(/^\/rme\//, (req, res) => res.sendFile(Path.resolve(__dirname, '../docs/index.html')));

app.listen(3080, () => {
    open('http://localhost:3080/rme/');
});