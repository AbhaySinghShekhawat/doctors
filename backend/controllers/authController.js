let User = require('../models/User');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
let {sendTokenResponse,generateToken} = require('../utils/authUtils');
let dotenv = require('dotenv');


dotenv.config();

exports.register = async(req,res,next) =>{
    try{
        const {name,email,password,passwordConfirm,userType,patientProfile,researcherProfile}=req.body;
        if(!name || !email || !password || !passwordConfirm || !userType){
            return res.send({
                success:false,
                message:'Please fill all the fields',
            })
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.send({
                success:false,
                message:'User already exists with this email',
            })
        }
        const user = await User.create({
            name,
            email,
            password,
            passwordConfirm,
            userType,
            patientProfile:userType==='patient'?patientProfile:undefined,
            researcherProfile:userType==='researcher'?researcherProfile:undefined,
        })
  
        sendTokenResponse(user,200,res);


    }catch(err){
        next(err);
    
    }
}

exports.login = async(req,res,next)=>{
    try{
        const {email, password,passwordConfirm}= req.body;
        if(!email || !password || !passwordConfirm){
            return res.send({
                success:false,
                message:'Please fill all the fields',
            })
        }
        const user = await User.findOne({email}).select('+password');
        if(!user){
            return res.send({
                success:false,
                message:'User not fond with this email',
            })
        }
        const isMatch = await bcrypt.compare(password,user.password,)
        if(!isMatch){
            return res.send({
                success:false,
                message:'Invalid Password',
            })
        }
        sendTokenResponse(user,200,res);
        
    }
    catch(err){
        next(err);
    }
}

exports.googleAuthCallback = async(req,res,next)=>{
    try{
        const user = req.user;
        const token = generateToken(user._id);
        
         res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
    }
    catch(err){
        next(err);
    }
}

exports.getMe = async (req,res,next)=>{
    try{
        if(!req.user){
            return res.send({
                success:false,
                message:'User not found',
            })
        }
        const user = await User.findById(req.user._id).select('-password');
        res.send({
            success:true,
            user,
        })
    }catch(err){
        next(err);
    }
}

exports.updateProfile  = async (req,res,next)=>{
    try{
        const fieldsToUpdate = req.body
        const user= await User.findByIdAndUpdate(req.user._id, fieldsToUpdate,{
            new:true,
            runValidators:true,
        } ).select('-password');

        res.send({
            success:true,
            message:'User profile updated successfully',
            user,
        })

    }
    catch(err){
        next(err);
    }
}

exports.logout = async(req,res,next) =>{
    try{
       
        res.cookie('token', '', {
            expires: new Date(0),
            httpOnly: true,
          });
          res.send({
            success: true,
            message: 'Logged out successfully',
          });
    

    }catch(err){
        next(err);
    }
}