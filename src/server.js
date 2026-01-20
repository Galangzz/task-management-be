require('dotenv').config();
require('./services/cron/cronDeadline');
const express = require('express');
const { createServer } = require('http');
const { setupSocket } = require('./socket');
const { startDeadlineCron } = require('./services/cron/cronDeadline');

const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { rateLimit } = require('express-rate-limit');

const errorHandler = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/notFoundPathHandler');
const authHandler = require('./middlewares/authHandler');

const TaskTabRoutes = require('./routes/taskTabsRoutes');
const TaskRoutes = require('./routes/tasksRoutes');
const UserRoutes = require('./routes/usersRoutes');
const AuthRoutes = require('./routes/authRoutes');

const app = express();
const server = createServer(app);
const io = setupSocket(server);
startDeadlineCron(io);

const port = process.env.PORT || 3001;
const host = process.env.HOST;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: 'Terlalu banyak permintaan, silakan coba lagi nanti.',
    standardHeaders: true,
    legacyHeaders: false,
    // skip: (req) => req.method === 'OPTIONS',
});

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    }),
);
// app.use(limiter);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Healthy',
    });
});

app.use('/api/users', UserRoutes);
app.use('/api/auth', AuthRoutes);

app.use(authHandler);

app.use('/api/task-tabs', TaskTabRoutes);
app.use('/api/tasks', TaskRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
});
