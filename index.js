const express = require('express');

const userRoutes = require('./users/userRouter');
const postRoutes = require('./posts/postRouter');

const server = express();

server.use(express.json());

const logger = (req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} to ${req.url}`);
    next();
}

server.use(logger);
server.use('/api/users', userRoutes);
server.use('/api/posts', postRoutes);

server.listen(8000, () => console.log("Server running on 8000"))