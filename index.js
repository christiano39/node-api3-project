require('dotenv').config();
const express = require('express');

const userRoutes = require('./users/userRouter');
const postRoutes = require('./posts/postRouter');

const server = express();
const port = process.env.PORT;

server.use(express.json());

const logger = (req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} to ${req.url}`);
    next();
}

server.use(logger);

server.get('/', (req, res) => {
    res.json({ welcomeMessage: process.env.WELCOME });
});

server.use('/api/users', userRoutes);
server.use('/api/posts', postRoutes);

server.listen(port, () => console.log(`Server running on ${port}`));