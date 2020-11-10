const { validationResult } = require('express-validator');
const request = require('request');
const config = require('config');

const Post = require('../models/Post');
const Profile = require('../models/Profile');
const User = require('../models/User');

module.exports = {
  createPost: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();

      return res.json(post);
    } catch (error) {
      console.error(error);
      return res.status(500).send('Server error');
    }
  },
  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.find().sort({ date: -1 });
      return res.json(posts);
    } catch (error) {
      console.error(error);
      return res.status(500).send('Server error');
    }
  },
  getPostById: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(400).json({ msg: 'Post not found' });
      }

      return res.json(post);
    } catch (error) {
      if (error.kind === 'ObjectId') {
        return res.status(400).json({ msg: 'Post not found' });
      }
      console.error(error);
      return res.status(500).send('Server error');
    }
  },
  deletePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(400).json({ msg: 'Post not found' });
      }

      // Check user
      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }

      await post.remove();

      return res.json({ msg: 'Post deleted' });
    } catch (error) {
      if (error.kind === 'ObjectId') {
        return res.status(400).json({ msg: 'Post not found' });
      }
      console.error(error);
      return res.status(500).send('Server error');
    }
  },
  likePost: async (req, res) => {
    try {
      const post = Post.findById(req.params.id);
      const isAlreadyLiked = post.likes.filter(
        (like) => (like.user.toString() === req.user.id).length > 0
      );

      if (isAlreadyLiked) {
        return res.status(400).json({ msg: 'Post already liked' });
      }

      post.likes.unshift({ user: req.user.id });
      await post.save();

      return res.json(post.likes);
    } catch (error) {
      console.error(error);
      return res.status(500).send('Server error');
    }
  },
  unlikePost: async (req, res) => {
    try {
      const post = Post.findById(req.params.id);
      const isPostAlreadyLiked = post.likes.filter(
        (like) => (like.user.toString() === req.user.id).length > 0
      );

      if (!isPostAlreadyLiked) {
        return res.status(400).json({ msg: 'Post not liked yet' });
      }

      const likes = post.likes.filter(
        (like) => like.user.toString() !== req.user.id
      );

      post.likes = likes;
      await post.save();

      return res.json(post.likes);
    } catch (error) {
      console.error(error);
      return res.status(500).send('Server error');
    }
  },
  createPostComment: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);

      await post.save();

      return res.json(post.comments);
    } catch (error) {
      console.error(error);
      return res.status(500).send('Server error');
    }
  },
  deletePostComment: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(400).json({ msg: 'Post not found' });
      }

      const comment = post.comments.find(
        (comment) => (comment.id = req.params.comment_id)
      );

      if (!comment) {
        return res.status(400).json({ msg: 'Comment not found' });
      }

      // Check user
      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }

      const comments = post.comments.filter(
        (comment) => comment.user.toString() !== req.user.id
      );

      post.comments = comments;
      await post.save();

      return res.json({ msg: 'Comment deleted' });
    } catch (error) {
      if (error.kind === 'ObjectId') {
        return res.status(400).json({ msg: 'Post not found' });
      }
      console.error(error);
      return res.status(500).send('Server error');
    }
  },
};
