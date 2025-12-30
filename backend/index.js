const express = require('express');
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const repoRoutes = require('./routes/repo.routes');
const reviewRoutes = require('./routes/review.routes')
const githubRoutes = require('./routes/github.routes')

require('dotenv').config();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

const connectDB = require('./config/db');
connectDB();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: [
        'GET', 'POST', 'PUT', 'DELETE'
    ],
    credentials: true
}));
//routes
app.use('/v1/api/auth', authRoutes);
app.use('/v1/api', repoRoutes);
app.use('/v1/api/review', reviewRoutes);
app.use('/v1/api/github', githubRoutes)

app.get('/', (req, res) => {
    res.send("backend is running...");
})

app.listen(PORT, () => {
    console.log("server is running on port 4000");
})