const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const auditRoutes = require('./routes/auditRoutes');
const authRoutes = require('./routes/authRoutes');
const clubRoutes = require('./routes/clubRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/audit', auditRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubRoutes);

// Base route
app.get('/', (req, res) => {
    res.send('Club Management API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
