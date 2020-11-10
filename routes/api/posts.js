const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../../middlewares/auth');
const {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  likePost,
  unlikePost,
  createPostComment,
  deletePostComment,
} = require('../../controllers/postController');

router.post(
  '/',
  [auth, check('text', 'Text is required').notEmpty()],
  createPost
);
router.get('/', auth, getAllPosts);
router.get('/:id', auth, getPostById);
router.delete('/:id', auth, deletePost);
router.put('/like/:id', auth, likePost);
router.put('/unlike/:id', auth, unlikePost);
router.post(
  '/comments/:id',
  [auth, check('text', 'Text is required').notEmpty()],
  createPostComment
);
router.delete('/comments/:id/:comment_id', auth, deletePostComment);

module.exports = router;
