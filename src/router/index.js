const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Welcome Page
router.get('/', (req, res) => res.render('login'));
//Dashboard
router.get('/users/homepage', (req, res) =>
  res.render('homepage', {
    user: req.user
  })
);

module.exports = router;


