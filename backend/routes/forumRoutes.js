const express = require('express');
const router = express.Router();
const {
    createPost,
  getPosts,
  toggleReaction,
  addReply,
  deletePost,
  updatePost,
  getPost,
} = require('../controllers/forumController');
const { protect } = require('../utils/authUtils');

router.post('/', protect, createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.put('/:id', protect, updatePost);
router.put('/:id/react', protect, toggleReaction);
router.post('/:id/reply', protect, addReply);
router.delete('/:id', protect, deletePost);

module.exports = router;
