const { default: mongoose } = require("mongoose");

const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.DB_URI);
        console.log('DB connected successfully');
    } catch (error) {
        console.log('DB error');
    }
};

module.exports = dbConnect;