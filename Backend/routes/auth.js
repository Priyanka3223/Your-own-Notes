const express= require('express');
const User = require('../models/User');
const router= express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const fetchuser=require('../middleware/fetchuser')
const JWT_SECRET= 'Harryisagoodb$oy';

// Route 1: create a user using : POST "/api/auth/createuser". Doesn't require auth
router.post('/createuser',[
    body('email','Enter a valid email').isEmail(),
    body('name','Enter a valid name').isLength({min:3}),
    body('password','enter valid password').isLength({min:5})
],async (req,res)=>{
    let success=false;
    // if there are errors return bad request
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({success,result: result.array()});
    }
    // check whether the user with this wmail exits or not
    try {
        let user= await User.findOne({email: req.body.email});
        if (user){
            return res.send(400).json({success,error:"sorry a user with this email already exits"});
        }
        const salt=await bcrypt.genSalt(10);
        const secPass= await bcrypt.hash(req.body.password,salt);
        //create a new user
        user=await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });
        const data={
            user:{
                id:user.id
            }
        }
        success=true;
        const auth_token=jwt.sign(data,JWT_SECRET);
        // console.log(jwt_data);
        res.json({success,auth_token});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("some error occured")
    }
    
    
})

// Route 2: Authenticate a user using : POST "/api/auth/login". 
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','password can not be blank').exists()
],async (req,res)=>{
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({result: result.array()});
    }
    const {email,password}=req.body;
    try {
        let user=await User.findOne({email});
        if(!user){
            success=false
            return res.status(400).json({success,error: "please try to login with correct credentials"});
        }
        const passwordCmp=await bcrypt.compare(password,user.password);
        if(!passwordCmp){
            success=false
            return res.status(400).json({success,error: "please try to login with correct credentials"});
        }
        const data={
            user:{
                id:user.id
            }
        }
        const auth_token=jwt.sign(data,JWT_SECRET);
        // console.log(jwt_data);
        success=true;
        res.json({success,auth_token});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error occured")
    }
})

// Route 2: get logged in user details using : POST "/api/auth/getuser". Login required. 
router.post('/getuser',fetchuser,async (req,res)=>{
    try {
        userId=req.user.id;
        const user=await User.findById(userId).select("-password")
        res.send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error occured")
    }
    })

module.exports=router