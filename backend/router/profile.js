const express = require("express");
const router = express.Router();
const User = require("../models/User");
const fetchuser = require("../middleware/fetchuser");

//Route 3: Fetch User Details
router.post("/fetchuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error.");
  }
});
module.exports = router;

router.put("/edituser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    const {name, bio, socialLinks, institution, courses} = req.body;

    if(!user)
    {
        req.status(404).send({errors:"User not found"});
    }
    if(name){user.name = name};
    if(bio){user.bio = bio};
    if(socialLinks){user.socialLinks = socialLinks};
    if(courses){user.courses = courses};

    await user.save();
    res.status(200).send({message:"Info updated successfully."});

  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error.");
  }
});
