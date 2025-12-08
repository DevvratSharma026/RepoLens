const express = require('express');
const app = express()
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const repoRoutes = require('./routes/repo.routes');

require('dotenv').config();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

const connectDB = require('./config/db');
connectDB();

//routes
app.use('/v1/api/auth', authRoutes);
app.use('/v1/api', repoRoutes);

app.get('/', (req, res) => {
    res.send("backend is running...");
})

app.listen(PORT, () => {
    console.log("server is running on port 4000");
})