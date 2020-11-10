const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { registerUser } = require('../../controllers/userController');

router.post(
  '/',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email address').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  registerUser
);

module.exports = router;
