const express = require("express");
const router = express.Router();
const {body,validationResult} = require('express-validator');
const Institute = require('../models/Institute');

router.post('/addInstitutes',[
    body('name',"Institute's name cannot be empty").exists()
],async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).send({errors: errors.array() });
    }
    const existingInstitute = await Institute.findOne({name:req.body.name});
    if(existingInstitute)
    {
        return res.status(400).send({errors:"Institute already added."});
    }
  try {
    const newInstitute = await Institute.create({
        name:req.body.name,
        location: req.body.location, 
        description: req.body.image || null
    })
    const institute = await newInstitute.save();
    // const data = {
    //     institute:{
    //         name:institute._id
    //     }
    // }
    // const institutetoken = jwt.sign(data,jwt_secret);
    res.status(200).send({message:"Institute added successfully.",institute});
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error.");
  }
})

router.get('/fetchInstitutes',async(req,res)=>
{
    try {
        const institutes = await Institute.find({},"name");
        res.status(200).json(institutes);
    } catch (error) {
        
    }
})

module.exports = router;