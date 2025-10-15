import { config} from "dotenv";
import app from "./app.js";
import connectDB from "./dbs/user.db.js";
config({quiet:true})
const HOSTNAME = process.env.HOSTNAME ||"127.0.0.1";
const PORT = process.env.PORT||8000;

try{

    await connectDB();
    app.on("error",(error) =>{
        console.error("App import error : ",error);
        throw error;
    });
    app.listen(PORT,HOSTNAME,() =>{
        console.log(`Server ia running on port http://${HOSTNAME}:${PORT}`);
        
    })
    
}
catch(err){
      
    console.log("MongoDB connection import failed ! : ",err)
}