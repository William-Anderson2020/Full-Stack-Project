const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Welcome Page
router.get('/', (req, res) => res.render('../views/welcome'));

module.exports = router;
/* // Dashboard
router.get('/dashboard', (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);
 */
