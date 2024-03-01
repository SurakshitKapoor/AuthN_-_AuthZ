const mongoose = require("mongoose");

require("dotenv").config();

const dbConnect = () => {
    mongoose.connect(process.env.DB_URL)
    .then( () => {console.log("DB is connected")})
    .catch( (err) => {
        console.log("FAILED to connect with DB");
    })
}

module.exports = dbConnect;