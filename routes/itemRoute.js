const express = require('express');
const router = express.Router();
const { createItem, getAllItems } = require('../controller/itemController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

router.get('/all', getAllItems);
router.post('/add', authMiddleware, isAdmin, createItem);

module.exports = router;