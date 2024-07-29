import bcrypt from "bcryptjs";
import User from "../models/user.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";


export const signup = async (req, res)=>{
    try{
        const {fullName, username, password, confirmPassword, gender} = req.body;
        if(password != confirmPassword){
            return res.status(400).json({error:"Password not match"})
        }
        const user = await User.findOne({username});
        if(user){
            return res.status(400).json({error:"Username already exists"})
        }

        //Hashing the password using bcrypt
        const salt=await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyProfile=`https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfile=`https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender== "male" ? boyProfile : girlProfile
        })
        //generate jwt token
        if(new User){
        generateTokenAndSetCookie(newUser._id, res);

        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic,
        });
    }
    else{
        res.status(400).json({error:"Inavlid User data"});
    }
    }
    catch(err){
        console.log("Error in signup controller", err.message);
        res.status(500).json({err: "Internal Server error"});
    }
}

export const login = async(req, res)=>{
    try {
        const {username, password} = req.body;
        const user= await User.findOne({username});
        const isPasswordCorrect=await bcrypt.compare(password, user?.password || ""); //here we added empty string because in case if password not match it will give illegal arguments, undefined string to prevent this we have to an empty string
        if(!user || !isPasswordCorrect){
            return res.status(400).json({error: "Invalid credentials"})
        }
        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profiePic: user.profilePic,
        });
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({error: "Internal Login Server error"});
    }
};

export const logout = (req, res)=>{
    try{
        res.cookie("jwt","",{maxAge:0}); //clearing cookie so that once user logout cookie get clear
        res.status(200).json({message:"Logged out successfully"});
    }
    catch(error){
        console.log("Error in signup controller", error.message);
        res.status(500).json({error: "Internal Logout Server error"});
    }
};
