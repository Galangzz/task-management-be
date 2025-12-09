require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const TaskTabRoutes = require('./routes/task_tab.routes');

const app = express();

const port = 3000;
const host = 'localhost';

app.use(express.json());
app.use(morgan('dev'));

app.use('/api', TaskTabRoutes);

const server = app.listen(port, host, () => {
    const address = server.address();
    console.log(`Server running at http://${address.address}:${address.port}`);
});
