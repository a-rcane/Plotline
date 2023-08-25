# Plotline

Plotline backend assignment - Sanchit Varma

## Initialisation

`npm init`  - to install dependencies 

`npm start` - run project

base_url :  `localhost:5000/api`

*Added the .env file for the required credentials.*

## Tech Stack

1. Mongodb - NoSql database
2. Nodejs with Express

## Postman

Postman used for testing the APIs. Used 2 environment variable :

1. base : `localhost:5000/api`
2. token : `JWT token`

Postman collection : 

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/18653491-12f83e3f-1bd4-4f4a-9939-ad09ae6b73c3?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D18653491-12f83e3f-1bd4-4f4a-9939-ad09ae6b73c3%26entityType%3Dcollection%26workspaceId%3D1d42f86c-4728-4520-9a9c-659a5bf3606c)

## Schemas

- Used four different schemas for the project :
    
        User : User Information
        
        Items : Item Information 
        
        Cart : Cart Information
        
        Order : Order Information

- User Schema also categorises each user as either a user or an admin.
-  Item Schema categorises each item as either a service or a product.

## API Endpoints

### User APIs :

- Create Account : `localhost:5000/api/user/register`

- User Login : `localhost:5000/api/user/login`

- User Logout : `localhost:5000/api/user/logout (jwt)`

- User Update : `localhost:5000/api/user/update (jwt)`

- User Delete : `localhost:5000/api/user/delete (jwt)`

### Item APIs :

- Get all items : `localhost:5000/api/item/all`

        request query:: category

        if category == Product : Display all products

        if category == Service : Display all services

        else display all items 

- Add item : `localhost:5000/api/item/add (jwt)` 

### Cart APIs :

- Create Cart : `localhost:5000/api/user/cart (jwt)`

- Total Cart Bill : `localhost:5000/api/user/cart/total (jwt)`

- Empty Cart : `localhost:5000/api/user/cart (jwt)`

- Add Item/s to cart : `localhost:5000/api/user/cart/add (jwt)`

- Remove Item/s from cart : `localhost:5000/api/user/cart/remove (jwt)`

*For Adding and Removing items from cart :*

    request query: 
        1. item_id : item id to be added/removed 
        2. quantity: quantity of items to be added/removed

    if quantity not defined then:
        1. Only 1 item is added/quantity is increased by 1
        2. All the items are removed        

    for adding to cart:
        1. If cart doesn't exist, new cart created with item
        2. If cart exists but item doesn't exist in cart then new item added to cart
        3. If item exists in cart, then quantity of item is increased

    for removing from cart:
        1. If quantity in query params >= quantity of specific item in cart, then that item is completely removed from cart.

### Order APIs :

- Get all orders by all users (Admin): `localhost:5000/api/user/order/all (jwt)`

- Get current user's order : `localhost:5000/api/user/order (jwt)`

- Create Order from Cart : `localhost:5000/api/user/order (jwt)`

- Confirm Order : `localhost:5000/api/user/order/confirm/:order_id (jwt)`

        request param: order_id

        confirms the status of Pending order to Confirmed.

## JWT

- JWT Authorization used for apis. We get a token after logging in as User. Logging in a 2nd time gives us a refresh token which can be used for subsequent logins.

- All APIs marked with JWT require a jwt token for authorization. We need to manually set the token in Postman under Authorization (Bearer Token).

