const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    institute:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'institute',
        required:true
    },
    content:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    comment:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'comment'
    }],
    date:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model("post",PostSchema);