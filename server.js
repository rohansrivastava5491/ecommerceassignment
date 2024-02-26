import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import itemRoute from './routes/itemRoute.js';
import cartRoute from './routes/cartRoute.js';
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

//routes
app.use(cors({ origin: true, credentials: true}));
app.use('/api/v1/auth',authRoute);
app.use('/api/v1',itemRoute);
app.use('/api/v1',cartRoute);

const PORT  = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})