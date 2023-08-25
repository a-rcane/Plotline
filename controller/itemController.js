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
            });
        res.json(newItem);
    } catch (error) {
        throw new Error(error);
    }
});

// get all items (products and service)
const getAllItems = asyncHandler(async (req, res) => {
    const category = req.query.category;
    try {
        if(category === undefined) {
            const allItems = await Item.find();
            res.json(allItems);
        }
        const allItems = await Item.find({ type: category }).select('name price type slug');
        res.json(allItems);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { createItem, getAllItems };