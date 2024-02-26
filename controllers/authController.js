//import { hashpassword } from "../helpers/authHelper.js";
//import userModel from "../models/userModel.js";
//
//
//export const  registerController = async(req,res) => {
//    try {
//        const {name,email,password,phone,address} = req.body;
//        //validations
//        if(!name){
//            return res.send({error: "Name is reuired"});
//        }
//        if(!email){
//            return res.send({error: "Email is reuired"});
//        }
//        if(!password){
//            return res.send({error: "Password is reuired"});
//        }
//        if(!phone){
//            return res.send({error: "Phone is reuired"});
//        }
//        if(!address){
//            return res.send({error: "Address is reuired"});
//        }
//        //check user
//        const existingUser = await userModel.findOne({email});
//        if(existingUser){
//            return res.status(200).send({
//                success: true,
//                message: "Already registered please login"
//            })
//        }
//        //
//        const hashedPassword = await hashpassword(password);
//        const user = await new userModel({name,email,phone,address,password:hashedPassword}).save();
//
//        return res.status(201).send({
//            success: true,
//            message: "User reqgistered successfully",
//            user
//        });
//        
//    } catch (error) {
//        console.log(error);
//        res.status(500).send({
//            success: false,
//            message: "Error in registartion",
//            error
//        })
//        
//    }
//};
//export const testController = (req, res) => {
//    try {
//      res.send("Protected Routes");
//    } catch (error) {
//      console.log(error);
//      res.send({ error });
//    }
//  };
//
import users from "../models/userModel.js";
import  Jwt  from "jsonwebtoken";
const JWT = Jwt;
import { comparePassword, hashpassword } from "../helpers/authHelper.js";
export const signupController = async(req,res) =>{
    try{

    // 1. GET USER INPUT: destructure req.body object to get data from user
    const { name, email, password } = req.body;

    // 2. validate user input
    if (!name || !email || !password) {
        return res.status(400).send({
            success: false,
            message: "Please enter all fields"
        });
    }

    // 3. validate if the user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
        return res.status(400).send({
            success: false,
            message: "Already registered please login"
        });
    }

    // 4. Encrypt the user password
    const hashedPassword = await hashpassword(password);

    // 5. Create a user in our DB
    const user = await new users({ name, email: email.toLowerCase(), password: hashedPassword }).save();

    // 6. Create signed JWT token
    const token = JWT.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
            expiresIn: "2h",
        }
    );

    // 7. Return the token as part of the response headers
    return res.status(201).set('Authorization', `Bearer ${token}`).send({
        success: true,
        message: "User registered successfully",
        user
    });
    
} catch (error) {
    console.error(error);
    return res.status(500).send(error);
}
        
        
    
}
export const loginController = async(req,res) => {
    try {
        //1. get user input
        const { email, password } = req.body;
        //2. Validate missing field
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: 'Please enter all fields'
            });
        }
        //3. Validate existing user
        const user = await users.findOne({email});
        if(!user){
            return res.status(400).send({
                success: false,
                message: "User does not exist"
            })
        }
        const match = await comparePassword(password,user.password);
        if(!match){
            return res.status(200).send({
                success: false,
                message: "Invalid Password",
            });
        }
        const token = JWT.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
        );
        res.status(200).send({
            success: true,
            message: "login successfully",
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
            },
            token,
        });


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error,
          });
    }

}
export const getUserController = async(req,res) => {
    users.findById(req.user.id)
    .select('-password')
    .then(user => res.json(user));

}






