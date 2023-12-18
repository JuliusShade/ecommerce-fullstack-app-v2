const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user_id) {
  console.log("Received User ID:", user_id);
  const payload = {
    user: {
      id: user_id,
    },
  };

  console.log("JWT Payload:", payload);

  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1h" });
}

module.exports = jwtGenerator;
