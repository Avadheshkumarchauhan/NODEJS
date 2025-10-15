import dotenv from "dotenv";
dotenv.config({
    quiet: true,
    path: "./.env"
})
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({
    limit: "20kb"
}));
app.use(express.urlencoded({
    extended: true,
    limit: "20kb"
}));
app.use(express.static("public"));
app.use(cookieParser())
app.get('/',(req,res) =>{
    res.send("<h1>Hello</h1>")
})

export default app;