const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    items: [{
        item:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Item',
        },
        tax:{
            type: Array,
            default: [],
        },
        quantity:Number,
        taxCost:Number,
        totalItemCost:Number
    },
    ],
    totalCost:Number,
    paymentStatus:{
        type:String,
        default:'Pending',
        enum: [
            'Pending',
            'Ordered'
        ],
    },
    orderBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
},
{ timestamps: true, },
);

//Export the model
module.exports = mongoose.model('User', orderSchema);