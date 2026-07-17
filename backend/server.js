const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

connectDB();

// Middleware
app.use(express.json()); // Parses incoming JSON payloads
app.use(cors()); // Allows our frontend to communicate with this API

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});