const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const { authUser, loginUser } = require('../../controllers/authController');
const { check } = require('express-validator');

router.get('/', auth, authUser);
router.post(
  '/login',
  [
    check('email', 'Please include a valid email address').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  loginUser
);

module.exports = router;
