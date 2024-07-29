import jwt from "jsonwebtoken";
import User from "../models/user.js";

//protect route is used to check wheather the user is authenticated or not 
//so inorder to prevent unauthorised access we use protect routes
const protectRoute = async (req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({error:"Unauthorised - No token Provided"});
        }
        const decoded=jwt.verify(token, process.env.JWT_SECRET);
         
        if(!decoded){
            return res.status(401).json({error:"Unauthorised - Invalid Token"})
        }
        const user=await User.findById(decoded.userId).select("-password");

        if(!user) {
            return res.status(404).json({error: "User not found"});
        }

        req.user=user;

        next();
        
    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}
export default protectRoute;