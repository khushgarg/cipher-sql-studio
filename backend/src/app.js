require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/mongodb');
const errorHandler = require('./middleware/errorHandler');

const assignmentsRouter = require('./routes/assignments');
const executeRouter = require('./routes/execute');
const hintRouter = require('./routes/hint');
const authRouter = require('./routes/auth');
const attemptsRouter = require('./routes/attempts');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/assignments', assignmentsRouter);
app.use('/api/execute', executeRouter);
app.use('/api/hint', hintRouter);
app.use('/api/auth', authRouter);
app.use('/api/attempts', attemptsRouter);

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
