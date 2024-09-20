const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const UserManager = require('../managers/UserManager');
const userManager = new UserManager();

router.post('/register', async (req, res) => {
  try {
    const newUser = await userManager.createUser(req.body);
    res.status(201).json({ status: 'success', payload: newUser });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ status: 'error', error: info.message });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('jwt', token, { httpOnly: true });
    res.json({ status: 'success', payload: { token } });
  })(req, res, next);
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ status: 'success', payload: req.user });
});

module.exports = router;