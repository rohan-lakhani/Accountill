import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const auth = asyncHandler(async (req, res, next) => {
    try {
        console.log(req.headers);
        const token = req.headers.authorization;
        // const token = req.cookies.token;
        // console.log("Bearer ", token);
        console.log("token", token);

        if (!token) {
            res.status(401);
            throw new Error("Not authorized, Please login");
        }

        //verify token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("verified ", verified);
        let decodeData;

        //If token is custom token do this
        if (token) {
            decodeData = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decodeData?.id;
        } else {
            //Else of token is google token then do this
            decodeData = jwt.decode(token);
            req.userId = decodeData?.sub;
        }

        next();
    } catch (error) {
        console.log(error.message);
        res.status(401);
        throw new Error("Not authorized, Please login");
    }
});

export default auth;
