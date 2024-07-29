import Conversation from "../models/conversation.js";
import Message from "../models/messages.js";

export const sendMessage = async(req,res)=>{
    try{
        const {message} = req.body;
        const {id: receiverId}= req.params;
        const senderId = req.user._id; 

        let conversation=await Conversation.findOne({
            participants: {$all: [senderId, receiverId]}, //serach wheather there conversation exist 
        });
        if(!conversation){
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            }); //creating a new conversation
        }

        const newMessage=new Message({
            senderId,
            receiverId,
            message,
        });

        if(newMessage){
            conversation.messages.push(newMessage._id); 
        }
        ;
        await Promise.all([await conversation.save(), newMessage.save()]);

        res.status(201).json(newMessage);
    }
    catch(err){
        console.log("Error in sendMessage controller: ",err.message);
        res.status(500).json({err:"Internal Server error"});
    }
}

export const getMessages = async(req,res)=>{
    try {
        const {id:userToChatId}=req.params;
        const senderId=req.user._id;

        const conversation= await Conversation.findOne({participants:{$all:[senderId, userToChatId]},}).populate("messages");

        res.status(200).json(conversation.messages);
    } catch (error) {
        console.log("Error in sendMessage controller: ",err.message);
        res.status(500).json({err:"Internal Server error"});
    }
}