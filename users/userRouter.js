const express = require('express');

const router = express.Router();

const Users = require('./userDb');
const Posts = require('../posts/postDb');

router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(() => {
      res.status(500).json({ message: "Error adding user" });
    })
});

router.post('/:id/posts', validatePost, validateUserId, (req, res) => {
  const newPost = {
    text: req.body.text,
    user_id: req.params.id
  }
  Posts.insert(newPost)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(() => {
      res.status(500).json({ message: "Error adding post" });
    })
});

router.get('/', (req, res) => {
  Users.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(() => {
      res.status(500).json({ message: "Unable to get users" });
    })
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(() => {
      res.status(500).json({ message: "Unable to get user's posts" });
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  Users.remove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(() => {
      res.status(500).json({ message: "Error deleting user" });
    })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  Users.update(req.params.id, req.body)
    .then(() => {
      res.status(200).json({ id: req.params.id, name: req.body.name });
    })
    .catch(() => {
      res.status(500).json({ message: "Error updating user" });
    })
});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then(user => {
      if (user.id){
        req.user = user;
        next();
      }else {
        res.status(400).json({ message: "invalid user id" });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Error finding user" });
    })
}

function validateUser(req, res, next) {
  if(!req.body) {
    res.status(400).json({ message: "missing user data" });
  }else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  }else {
    next();
  }
}

function validatePost(req, res, next) {
  if(!req.body) {
    res.status(400).json({ message: "missing post data" });
  }else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  }else {
    next();
  }
}

module.exports = router;
