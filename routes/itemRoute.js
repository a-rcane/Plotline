const express = require('express');
const router = express.Router();
const { createItem } = require('../controller/itemController');

router.post('/add', createItem);

module.exports = router;