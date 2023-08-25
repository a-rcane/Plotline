const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var itemSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    slug:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    type:{
        type:String,
        required:true,
        enum: [
            'Service',
            'Product'
        ]
    },
    price:{
        type:Number,
        required:true,
    },
},
{timestamps: true},
);

//Export the model
module.exports = mongoose.model('Item', itemSchema);