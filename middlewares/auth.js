
const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.auth = async(req, resp, next) => {
    try{

        // const token = req.headers['Authorization'].replace("Bearer ", "");
        // const token = req.headers.Authorization.split(' ')[1];
        // console.log("token is : ", token);

        // const {token} = req.body;
        // const token = req.body.token;
        const token = req.cookies.token;
        
        if(!token) {
            return resp.status(500).json({
                success:false,
                message: "Token is missing !"
            })
        }

        try{
            const decodedToken = jwt.verify(token, process.env.JWT_KEY);
            console.log("Decoded Token is : ", decodedToken);

            req.verifiedUser = decodedToken;

            // next();
        }
        catch(err) {
            console.log(err.message);
            
            return resp.status(500).json({
                success: false,
                message: "Token is Invalid !"
            })
        }

        next();

    }
    catch(err) {
        console.log(err.message);

        return resp.status(200).json({
            success: false,
            message: "Server issue while running auth middleware to verify token"
        })
    }
}

exports.isStudent = async(req, resp, next) => {
    try{ 
        if(req.verifiedUser.role !== "Student") {
            return resp.status(500).json({
                success:false,
                message: "This is a protected route for Student"
            })
        }

        next();
    }
    catch(err) {
        console.log(err.message);

        return resp.status(500).json({
            success: false,
            message: "Server issue while verifying isStudent middleware"
        })
    }
}


exports.isAdmin = async(req, resp, next) => {
    
    try{
        if(req.verifiedUser.role !== 'Admin') {
            return resp.status(500).json({
                success: false,
                message: "This is the protected route for Admin"
            })
        }

        next();
    }
    catch(err) {
        console.log(err.message);

        return resp.status(500).json({
            success: false,
            message:"Server issue while verifying isAdmin middleware"
        }) 
    }
} 