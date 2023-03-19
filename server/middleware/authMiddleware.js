import asyncHandler from  'express-async-handler';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const auth = asyncHandler(async(req,res) => {
    try{
        const token = req.headers.authorization.split(" ")[1]
        const isCustomAuth = token.length < 500 

        if(!token){
            res.status(401);
            throw new Error("Not authorized, please login");
        }

        let decodeData;

        //If token is custom token do this
        if(isCustomAuth){
            decodeData = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decodeData?.id;
        }else {
            //Else of token is google token then do this
            decodeData = jwt.decode(token);
            req.userId = decodeData?.sub;
        }
    }catch(error){
        console.log(error);
        
        res.status(401);
        throw new Error("Not authorized, please login");
    }
})

export default auth;