// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
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
app.use(cookieParser());
app.use(morgan('dev'));
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);
if (mongoose.connection) {
  console.log('Connected to MongoDB');
}


// Routes
app.use('/auth', require('./routes/auth'));
app.use('/tasks', require('./routes/task'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
