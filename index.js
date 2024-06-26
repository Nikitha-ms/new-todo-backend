// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors(
  {
    origin: 'http://localhost:5173',
    credentials: true,
  }
));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);
if (mongoose.connection) {
  console.log('Connected to MongoDB');
}


// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/task'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
