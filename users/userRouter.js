const express = require('express');

const router = express.Router();

const Users = require('../users/userDb');

router.post('/:id/posts', (req, res) => {
  //How do I do this...
});

router.post('/', (req, res) => {
  Users.insert(req.body)
    .then(resource => {
      res.status(200).json(resource)
    })
    .catch(err => {
      res.status(500).json({ error: 'Hold up you have a server error' })
    })
});

router.get('/', (req, res) => {
  Users.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ error: "Error fetching data" })
    })
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  Users.getById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      }
      else {
        res.status(404).json({ error: "user not found" })
      }
    })
    .catch(err => {
      res.status(500).json({ error: "Error fetching user" })
    })
});

router.get('/:id/posts', (req, res) => {
  const id = req.params.id;
  Users.getUserPosts(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      }
      else {
        res.status(404).json({ error: "user not found" })
      }
    })
    .catch(err => {
      res.status(500).json({ error: "Error fetching user" })
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  const id = req.params.id;

  Users.remove(id)
    .then(number => {
      res.status(200).json(number)
    })
    .catch(err => {
      res.status(500).json({ error: 'FAIL' })
    })
});

router.put('/:id', validateUserId, (req, res) => {
  const id = req.params.id;
  console.log(req.body);

  Users.update(id, req.body)
    .then(number => {
      if (number === 1) {
        res.status(200).json(number);
      }
      else {
        res.status(404).json({ error: "user not found" })
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'FAIL' })
    })
});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then(user => {
      if (user) {
        req.user = user
        next();
      }
      else {
        res.status(404).json({ message: 'invalid user id' })
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'not able to retrieve data' })
    })
};

function validateUser(req, res, next) {
  if (!req.body || !req.body.name) {
    res.status(400).json({ message: "missing data" })
  }
  else {
    next()
  }
};

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing post data" });
  }
  else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  }
  else {
    next()
  }
};

module.exports = router;
