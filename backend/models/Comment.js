const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
  user: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "user",
    type:String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post',
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

module.exports = mongoose.model("comment", commentSchema);
