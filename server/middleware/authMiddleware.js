import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const auth = asyncHandler(async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        // console.log(req.headers);
        // const token = JSON.parse(localStorage.getItem("profile"))?.token;
        console.log("Bearer ", token);

        if (!token) {
            res.status(401);
            throw new Error("Not authorized, please login");
        }

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
        console.log(error);
        res.status(401);
    }
});

export default auth;
