const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    items: [{
        item:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Item',
        },
        price:Number,
        quantity:Number,
        tax:{
            type: Array,
            default: [],
        },
    },
    ],
    taxCost:Number,
    totalCost:Number,
    orderBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
},
{ timestamps: true, },
);

//Export the model
module.exports = mongoose.model('Cart', cartSchema);