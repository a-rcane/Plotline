const { default: slugify } = require('slugify');
const Item = require('../models/itemModel');
const asyncHandler = require('express-async-handler');

function calculateTax(num, itemType) {
    
    let taxes = [], price = 0;
    
    if(itemType=="Service") {
        // service
        if(num>1000 && num<=8000){
            taxes.push('SA');
            price += 0.1*num;
        }
        else if(num>8000)
        {
            taxes.push('SB');
            price += 0.15*num;    
        }
        taxes.push('SC');
        price += 100;
    } else if(itemType=="Product"){
        // product
        if(num>1000 && num<=5000){
            taxes.push('PA');
            price += 0.12*num;

        } 
        else if(num>5000) {
            taxes.push('PB');
            price += 0.18*num;    
        }
        taxes.push('PC');
        price += 200;
    }

    return {price, taxes};
}

// create new Item
const createItem = asyncHandler(async (req, res) => {
    try {
        const values = calculateTax(req.body.price, req.body.type);
        const newItem = await Item.create(
            {
                name: req.body.name, 
                slug: slugify(req.body.name),
                type: req.body.type,
                price: req.body.price, 
                taxCost: values.price, 
                tax: values.taxes,
                totalCost: req.body.price + values.price,
            });
        res.json(newItem);
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = { createItem };