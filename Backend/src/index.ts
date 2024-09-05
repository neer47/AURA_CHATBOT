import express from "express";
import {config} from "dotenv";
import connect from "./db/connection.js"
import morgan from "morgan";
import appRouter from './routes/index.js'
import cookieParser from "cookie-parser";
import cors from "cors";
config();
const app = express();

// middlewares
app.use(cors({origin: "http://localhost:5173", credentials:true}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// remove it in production
app.use(morgan("dev"));
connect();

app.use("/api/v1", appRouter);  

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
  console.log(`Server started running on port no. ${PORT}!`);
})