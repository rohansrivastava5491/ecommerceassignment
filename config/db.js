import mongoose from "mongoose";
const connectDB  = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to MongoDB database ${conn.connection.host}`);
    } catch (error) {
    console.log(`Error connecting to MongoDB: ${error}`);
    }
}
export default connectDB;