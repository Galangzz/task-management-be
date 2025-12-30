require('dotenv').config();
const express = require('express');
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
        origin: 'http://localhost:5173',
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    })
);
app.use(limiter);
app.use(morgan('dev'));
app.use(cookieParser());

app.use(express.json());

app.use('/api/users', UserRoutes);
app.use('/api/auth', AuthRoutes);

app.use(authHandler);

app.use('/api/task-tabs', TaskTabRoutes);
app.use('/api/tasks', TaskRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
});
