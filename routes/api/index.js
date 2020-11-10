const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const postsRoutes = require('./posts');
const profileRoutes = require('./profile');
const userRoutes = require('./users');

router.use('/auth', authRoutes);
router.use('/posts', postsRoutes);
router.use('/profiles', profileRoutes);
router.use('/users', userRoutes);

module.exports = router;
