const express = require('express');
const { 
    createUser, 
    loginUser, 
    deleteUser, 
    updateUser, 
    logout, 
    userCart, 
    getUserCart, 
    emptyCart, 
    createOrder, 
    getAllOrders, 
    getUserOrder, 
    confirmOrder, 
    addToCart,
    removeFromCart} = require('../controller/userController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// user
router.post('/register', createUser);
router.post('/login', loginUser);
// router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);
router.put('/update', authMiddleware, updateUser);
router.delete('/delete', authMiddleware, deleteUser);

// cart
router.post('/cart', authMiddleware, userCart);
router.get('/cart/total', authMiddleware, getUserCart);
router.delete('/cart', authMiddleware, emptyCart);
router.post('/cart/add', authMiddleware, addToCart);
router.post('/cart/remove', authMiddleware, removeFromCart);

// order
router.post('/order', authMiddleware, createOrder);
router.get('/order', authMiddleware, getUserOrder);
router.get('/order/all', authMiddleware, isAdmin, getAllOrders);
router.put('/order/confirm/:id', authMiddleware, isAdmin, confirmOrder);

module.exports = router;

