require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/mongodb');
const errorHandler = require('./middleware/errorHandler');

const assignmentsRouter = require('./routes/assignments');
const executeRouter = require('./routes/execute');
const hintRouter = require('./routes/hint');
const authRouter = require('./routes/auth');
const attemptsRouter = require('./routes/attempts');
const adminRouter = require('./routes/admin');
const explainRouter = require('./routes/explain');
const progressRouter = require('./routes/progress');
const sandboxRouter = require('./routes/sandbox');

const app = express();

app.use(cors());
app.use(express.json());

// Security: Implement specific rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 auth requests per windowMs
  message: { error: 'Too many authentication attempts, please try again after 15 minutes' }
});

const executeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15, // Limit each IP to 15 execution requests per minute
  message: { error: 'Too many queries executed, please slow down' }
});

app.use('/api/assignments', assignmentsRouter);
app.use('/api/execute', executeLimiter, executeRouter);
app.use('/api/hint', hintRouter);
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/attempts', attemptsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/explain', explainRouter);
app.use('/api/progress', progressRouter);
app.use('/api/sandbox', executeLimiter, sandboxRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
