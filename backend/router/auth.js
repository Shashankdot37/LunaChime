const jwt_secret = process.env.JWT_SECRET;
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Institute = require('../models/Institute');

//Route 1: Create User
router.post(
  "/createUser",
  [
    body("name", "Name should have atleast 3 characters").isLength({ min: 3 }),
    body("email", "Email is required").isEmail(),
    body("password", "Password must be atleast 8 character long").isLength({min: 8}),
    body("institute","Institute is required.").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const existingUser = await User.findOne({ email: req.body.email });

    try {
      if (existingUser) {
        return res.status(400).json({ errors: "User already exists." });
      }
      const {institute} = req.body;
      const instituteData = await Institute.findById(institute);
      if(!instituteData)
      {
        return res.status(400).json({ errors: "Institute not found" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPassword = await bcrypt.hash(req.body.password, salt);
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
        institute:instituteData._id
      });
      const data = {
        user: {
          institute:user.institute,
          id: user._id,
        },
      };
      const authtoken = jwt.sign(data, jwt_secret);
      res
        .status(200)
        .json({ message: "User created successfully.", user, authtoken });
      console.log(authtoken);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error.");
    }
  }
);

//Route 2: Login User
router.post(
  "/login",
  [
    body("email", "Email is required").isEmail(),
    body("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      const checkUser = await User.findOne({ email });
      if (!checkUser) {
        return res
          .status(400)
          .json({ errors: "Please enter valid credentials." });
      }
      const passwordCompare = bcrypt.compare(checkUser.password, password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ errors: "Please enter valid credentials." });
      }
      const data = {
        user: {
          id: checkUser.id,
        },
      };
      const authtoken = jwt.sign(data, jwt_secret);
      res.json({ authtoken });
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error.");
    }
  }
);

module.exports = router;

