const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const Item = require('../models/itemModel');
const Cart = require('../models/cartModel');
const asyncHandler = require('express-async-handler')
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const validateMongoDbId = require('../utils/validateMongoDbId');

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

// create new user
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email: email});
    if(!findUser)
    {
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        throw new Error('User already exists');
    }
});

// get a single user
const getUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const getaUser = await User.findById(_id);
        res.json(getaUser);
    } catch (error) {
        throw new Error(error);
    }
});

// login existing user
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    const findUser = await User.findOne({email});
    if(findUser && await findUser.isPasswordMatched(password))
    {
        const refreshToken = await generateRefreshToken(findUser?._id);    
        const updateUser = await User.findByIdAndUpdate(findUser._id, {
                refreshToken: refreshToken,
            },
            {   new: true,  }
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 48*60*60*1000,
        });
        res.json({
            findUser,
            token: generateToken(findUser?._id),
        });
    } else {
        throw new Error("Invalid Credentials or user doesn't exist");
    }
});

// update an existing user
const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try
    {
        const updatedUser = await User.findByIdAndUpdate(
        _id, 
        {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        },
        {
            new: true,
        });
        res.json(updatedUser);
    } catch(error) {
        throw new Error(error);
    }
});

// delete existing user
const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try
    {
        const deletedUser = await User.findByIdAndDelete(_id);
        res.json({
            deletedUser,
            msg: `Successfully deleted user ${deletedUser.firstname} ` + `${deletedUser.lastname}`
        });
    } catch(error) {
        throw new Error(error);
    }
});

// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error('No refresh token in cookies.');

    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if(!user) throw new Error('No refresh token in Db or not matched.');
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {

        if(err || user.id !== decoded.id) throw new Error('Refresh token not working.');

        const accessToken = generateToken(user?._id);
        res.json({accessToken});
    });
});

// logout
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error('No user is logged in.');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if(!user){
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204);
    }

    await User.findOneAndUpdate({refreshToken}, {
        refreshToken: "",
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204);
});

// user cart
const userCart = asyncHandler(async (req, res) => {
    const {cart} = req.body;
    const {_id} = req.user;
    validateMongoDbId(_id);
    try {
        const user = await User.findById(_id);
        const existingCart = await Cart.findOne({ orderby: user._id });
        let items = [];
        if(existingCart) existingCart.remove(); 

        for(let i=0;i<cart.length;i++)
        {
            let object = {};
            object.item = cart[i]._id;
            let getPrice = await Item.findById(cart[i]._id).select('price').exec();
            object.price = getPrice.price; 
            object.quantity = cart[i].quantity;
            let getType = await Item.findById(cart[i]._id).select('type').exec();
            object.type = getType.type;
            const values = calculateTax(object.price, object.type);
            object.tax = values.taxes;
            object.taxCost = values.price;
            object.totalItemCost = (values.price + getPrice.price)*cart[i].quantity;
            items.push(object);
        }
        let totalCost = 0;
        for(let i=0;i<items.length;i++)
            totalCost += (items[i].taxCost + items[i].price)*items[i].quantity;
            
        let newCart = await new Cart({
            items,
            totalCost,
            orderBy: user?._id,
        }).save();
        res.json(newCart);
    } catch (error) {
        throw new Error(error);
    }
});

// get user cart
const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
      const cart = await Cart.findOne({ orderBy: _id }).populate(
        "items.item"
      );
      res.json(cart);
    } catch (error) {
      throw new Error(error);
    }
  });
  
// empty user cart
const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
      const user = await User.findOne({ _id });
      const cart = await Cart.findOneAndRemove({ orderBy: user._id });
      res.json({
        message: 'Cart emptied successfully.'
      });
    } catch (error) {
      throw new Error(error);
    }
});

module.exports = { 
    createUser, 
    loginUser, 
    deleteUser, 
    updateUser, 
    getUser, 
    handleRefreshToken, 
    logout,
    userCart,
    getUserCart,
    emptyCart,
};
