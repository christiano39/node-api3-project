const express = require('express');
const Posts = require('./postDb');

const router = express.Router();

router.get('/', (req, res) => {
  Posts.get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(() => {
      res.status(500).json({ message: "Unable to get posts" });
    })
});

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(req.post);
});

router.delete('/:id', validatePostId, (req, res) => {
  Posts.remove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(() => {
      res.status(500).json({ message: "Unable to delete post" });
    })
});

router.put('/:id', validatePostId, (req, res) => {
  Posts.update(req.params.id, req.body)
    .then(() => {
      res.status(200).json({ id: req.params.id, text: req.body.text });
    })
    .catch(() => {
      res.status(500).json({ message: "Unable to update post" });
    })
});

// custom middleware

function validatePostId(req, res, next) {
  Posts.getById(req.params.id)
    .then(post => {
      if (post){
        req.post = post;
        next();
      }else {
        res.status(400).json({ message: "invalid post id" });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Error finding post" });
    })
}

module.exports = router;
