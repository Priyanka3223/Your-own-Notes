const express=require('express');
const router=express.Router();
const fetchuser=require('../middleware/fetchuser');
const Note=require('../models/Notes')
const { body, validationResult } = require('express-validator');
const nodemon = require('nodemon');

// Route 1: get all the notes using : get "/api/auth/getuser". Login required. 
router.get('/fetchallnotes',fetchuser,async (req,res)=>{
    try {
        const notes=await Note.find({user:req.user.id});
        res.json(notes);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("some error occured")
    }
    
})

// Route 2: add a new notes using : Post "/api/auth/addnote". Login required. 
router.post('/addnote',fetchuser,[
    body('title','Enter a valid email').isLength({min:3}),
    body('description','Enter a valid name').isLength({min:5})
],async (req,res)=>{
    // if there are errors return bad request
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({result: result.array()});
    }
    try {
        const {title,description,tag}=req.body;
        const note=new Note({
            title,description,tag,user: req.user.id
        })
        const savenote=await note.save();
        res.json(savenote);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("some error occured")
    }
    
})


// Route 3: update an existing notes using : Put "/api/auth/updatenote". Login required. 
router.put('/updatenote/:id',fetchuser,async (req,res)=>{
    try {
        const {title,description,tag}=req.body;
        //create a newNote object
        const newNote={};
        if(title){newNote.title=title};
        if(description){newNote.description=description};
        if(tag){newNote.tag=tag};

        // find the note to be updated and update it
        let note= await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not allowed")
        }
        note=await Note.findByIdAndUpdate(req.params.id,{$set: newNote},{new:true});
        res.json({note});
    } catch (error) {
        return res.status(500).send("Internal server error")
    }
    
})

// Route 4: delete an existing notes using : Delete "/api/auth/deletenote". Login required. 
router.delete('/deletenote/:id',fetchuser,async (req,res)=>{
    try {
        const {title,description,tag}=req.body;
        // find the note to be deleted and delete it
        let note= await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}
        // allow deletion only if user owns this note
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not allowed")
        }
        note=await Note.findByIdAndDelete(req.params.id);
        res.json({"Success":"Note has been deleted",note:note});
    } catch (error) {
        return res.status(500).send("Internal server error")
    }
    
})
module.exports=router