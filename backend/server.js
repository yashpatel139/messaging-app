import express from "express"; //packages
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
//file import
import authRoutes from './routes/auth.routes.js';
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js"
import connectToMongoDB from './db/connection.js';
//variables
const app = express();
const PORT=process.env.PORT || 5000;

dotenv.config();

app.use(express.json()); //to parse the incoming info(from req.body) into json 
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);
app.use("/api/users",userRoutes);

app.get("/", (req,res)=>{
    // root route http://localhost:5000/ 
    res.send("Hello world");
});


app.listen(PORT, ()=>{
    connectToMongoDB();
    console.log(`Server Running on PORT ${PORT}`)
});