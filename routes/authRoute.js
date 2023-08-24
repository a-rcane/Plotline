const express = require('express');
const { createUser, loginUser, deleteUser, updateUser, getUser, handleRefreshToken, logout, userCart, getUserCart, emptyCart } = require('../controller/userController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// user
router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);
router.get('/:id', authMiddleware, isAdmin, getUser);
router.put('/update', authMiddleware, updateUser);
router.delete('/delete', authMiddleware, deleteUser);

// cart
router.post('/cart', authMiddleware, userCart);
router.get('/cart/user', authMiddleware, getUserCart);
router.post('/cart/delete', authMiddleware, emptyCart);

module.exports = router;

