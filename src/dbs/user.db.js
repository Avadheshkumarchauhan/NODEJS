import dotenv from "dotenv";
dotenv.config({
    path: "./.env",
    quiet:true
});
import mongoose from "mongoose";
import {databaseName} from "../constants.js";




const connectionString = `${process.env.MONGODB_URL}/${databaseName}`;


const connectDB = async() =>{
    try{

        const connectionInstance = await mongoose.connect(connectionString);       

        console.log("MongoDB connected  !! \nDB host : ",connectionInstance.connection.host);
        

    }
    catch(err){
        console.error(" MongoDB connection faild : ",err);
        process.exit(1);

    }
}

export default connectDB ;