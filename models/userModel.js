import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail.js";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true,'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail,'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: [6,'Minimum Password length must be 6 characters']
    },
   register_date: {
    type: Date,
    default: Date.now
   }
});
export default mongoose.model('users',userSchema);