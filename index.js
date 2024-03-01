
const express = require("express");
const app = express();

require("dotenv").config();

const Port = process.env.PORT || 4000;

app.listen(Port, function() {
    console.log(`App is live at port number ${Port}`);
})

app.get('/', function(req, resp) {
    console.log("We are at homePage");
    resp.send(`<h1> We are at homePage of for Authentication and Authoriization`);
})

const dbConnect = require("./config/database");
dbConnect();

app.use(express.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const authRoutes = require("./routes/authN");
app.use("/api/v1", authRoutes);

