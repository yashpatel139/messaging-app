import User from "../models/user.js";

export const getUsersForSidebar= async (req,res)=>{
    try {
        const loggedInUserId=req.user._id;

        const allUsers=await User.find(); //do this if u want to message urself also otherwise ..
        const filteredUsers=await User.find({_id:{$ne: loggedInUserId}}).select("-password"); //ne means any here

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUsersForSidebar: ",error.messages);
        res.status(500).json({error: "Internal server error"});
    }
}