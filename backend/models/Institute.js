const mongoose = require("mongoose");
const { Schema } = mongoose;

const InstituteSchema = new Schema({
  name: { type: String, required: true,unique:true },
  location: { type: String },
  description: { type: String }
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date },
//   isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("institute", InstituteSchema);
