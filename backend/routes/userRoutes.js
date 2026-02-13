const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, admin, createUser);
router.get('/', protect, admin, getAllUsers);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
