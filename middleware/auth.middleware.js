import jwt from "jsonwebtoken"
import apiError from "../utils/apiError.utils.js";
import asynHandler from "../utils/asyncHandler.utils.js";
import User from "../models/user.models.js";

export const jwtVerify = asynHandler(async(req, res, next)=>{
    
    try{
        const incomingAccessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if(!incomingAccessToken) throw new apiError(401,"Unauthorized request");

    //decode the token using jwt verify
    const decodedToken =  jwt.verify(incomingAccessToken, process.env.ACCESS_TOKEN);

    //check if the user exists --- decodedtoken - _id, username, email

    const user = await User.findById(decodedToken?._id).select("-password -refreshAccessToken");

    if(!user) throw new apiError(404, "User does not exists");

    req.user = user;
    next();
    }
    catch(error){
        throw new apiError(401, error?.message || 
            "Invalid Access token" )
    }

})