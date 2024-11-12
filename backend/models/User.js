const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    name:{
        type: String,
        required:true
    },
    socialLinks: {
        linkedin: { type: String },
        github: { type: String },
        website: { type: String }
    }, 
    institute: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'institute',
        required:true
    },   
    bio:{
        type:String
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required:true
    },
    date:{
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('user', UserSchema)