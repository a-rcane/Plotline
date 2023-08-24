const { default: slugify } = require('slugify');
const Item = require('../models/itemModel');
const asyncHandler = require('express-async-handler');


// create new Item
const createItem = asyncHandler(async (req, res) => {
    try {
        const newItem = await Item.create(
            {
                name: req.body.name, 
                slug: slugify(req.body.name),
                type: req.body.type,
                price: req.body.price, 
                totalCost: req.body.price + values.price,
            });
        res.json(newItem);
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = { createItem };