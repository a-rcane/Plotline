const express = require('express')
const dbConnect = require('./config/dbConnect')
const app = express()
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const authRouter = require('./routes/authRoute');
const itemRouter = require('./routes/itemRoute');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
dbConnect();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/user', authRouter);
app.use('/api/item', itemRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});