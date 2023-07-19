const express = require('express');
const Path = require('path');
const app = express();

app.use('/', express.static(Path.resolve(__dirname, '../docs')));

app.get(/^\w*/, (req, res) => res.sendFile(Path.resolve(__dirname, '../docs/index.html')));

app.listen(3080, async () => {
    const open = await import('open');
    await open.default('http://localhost:3080/');
});