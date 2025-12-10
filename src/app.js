require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const TaskTabRoutes = require('./routes/task_tabs.routes');
const errorHandler = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/notFoundPathHandler');

const app = express();

const port = process.env.PORT;
const host = process.env.HOST;

app.use(express.json());
app.use(morgan('dev'));
app.use(
    cors({
        origin: '*',
        allowedHeaders: ['Content-Type'],
    })
);

app.use('/api/task-tabs', TaskTabRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

const server = app.listen(port, host, () => {
    const address = server.address();
    console.log(`Server running at http://${address.address}:${address.port}`);
});
