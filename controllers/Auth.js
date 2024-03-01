
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookies");

require("dotenv").config();

exports.signUp = async(req, resp) => {
    try{
        const{name, email, password, role} = req.body;

        const existingUser = await User.findOne({email});

        if(existingUser) {
            return resp.status(500).json({
                success:false,
                message: "User is already registered",
                existingUser : existingUser
            })
        }

        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err) {
            return resp.status(500).json({
                message:"Error while hashing the password"
            })
        }

        const user = await User.create(
            {
                name, email,
                password:hashedPassword,
                role
            }
        );

        return resp.status(200).json({
            success:true,
            user : user,
            message: "Account is created for this user"
        })

    }
    catch(err) {
        console.log(err.message);

        return resp.status(500).json({
            success: false,
            message: "Server error while signing up or creating account in db"
        })
    }
}


exports.logIn = async (req, resp) => {
    try{

        const {email, password} = req.body;

        if(!email || !password) {
            return resp.status(500).json({
                success:false,
                message:"Please enter all the input fields"
            })
        }

        let user = await User.findOne({email});

        if(!user) {
            return resp.status(500).json({
                success:false,
                message:"The user is not registered, pls sign up first"
            })
        }

        const payLoad = {
            email:user.email,
            role: user.role,
            password: user.password
        }

        if(await bcrypt.compare(password, user.password)){

            const jwtToken = jwt.sign( payLoad, process.env.JWT_KEY, 
                                {
                                    expiresIn : "2h"
                                });
            
            user = user.toObject();
            user.token = jwtToken;
            user.password = undefined;
            
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true
            }

            return resp.cookie("token", jwtToken, options).status(200).json({
            // return resp.status(200).json({
                success: true,
                user:user,
                message:"Logged In Successfully",
                token: jwtToken
            })
            
        }
        else {
            return resp.status(500).json({
                success: false,
                message:"The Password is Incorrect"
            })
        }
    }
    catch(err) {
        console.log(err.message);

        return resp.status(500).json({
            success: false,
            message: "Server issue while logging in"
        })
    }
}