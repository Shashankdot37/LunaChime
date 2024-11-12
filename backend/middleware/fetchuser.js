const jwt_secret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

const fetchuser = (req,res,next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(404).send("Please authenticate using valid token.");
  }
  try {
    const data = jwt.verify(token, jwt_secret);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using valid token." });
  }
};

module.exports = fetchuser;
