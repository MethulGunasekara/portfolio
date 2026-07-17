const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const profileRoutes = require('./routes/profileRoutes');
const projectRoutes = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes'); 
const messageRoutes = require('./routes/messageRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

connectDB(); 

// Middleware
app.use(express.json()); 
app.use(cors()); 

// Routes
app.use('/api/profile', profileRoutes); 
app.use('/api/projects', projectRoutes); 
app.use('/api/skills', skillRoutes); 
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});