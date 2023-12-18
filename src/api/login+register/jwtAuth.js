const { Router } = require("express");
const pool = require("../../../db");
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../util/jwtGenerator");
const validInfo = require("../middleware/validinfo");
const authorization = require("../middleware/authorization");

const router = Router();

// Route for handling registration through OAuth (Google in this case)
router.post("/oauth/google", async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the incoming request body
    const { access_token } = req.body;
    console.log("Access Token:", access_token); // Log the access token

    // Log the URL you are about to call
    console.log(`Calling Google API with token: ${access_token}`);

    const googleResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${access_token}`
    );
    console.log("Google API Response:", googleResponse.data); // Log Google's response

    const {
      email,
      given_name,
      family_name,
      sub: google_id,
    } = googleResponse.data;

    console.log(
      `User details - Email: ${email}, Name: ${given_name} ${family_name}, Google ID: ${google_id}`
    );

    let user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    console.log("User exists check:", user.rows); // Log if the user was found or not

    // If the user does not exist, create a new one
    if (user.rows.length === 0) {
      console.log(`Creating new user with email: ${email}`);
      user = await pool.query(
        "INSERT INTO users (firstname, lastname, email) VALUES ($1, $2, $3) RETURNING *",
        [given_name, family_name, email]
      );
      console.log("New user created:", user.rows[0]); // Log the new user's details
    }

    const token = jwtGenerator(user.rows[0].id);
    console.log("JWT Token generated:", token); // Log the generated token

    res.json({ token, user: user.rows[0] });
  } catch (err) {
    console.error("Error during Google OAuth:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

router.post("/register", validInfo, async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Check if the user exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).send("User already exists");
    }

    // Bcrypt the user password (you should implement this part)

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);

    const bcryptPassword = await bcrypt.hash(password, salt);

    // enter the new user into the database
    const newUser = await pool.query(
      "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [firstname, lastname, email, bcryptPassword]
    );

    // generating our jwt token
    const token = jwtGenerator(newUser.rows[0].id);

    res.json({ token });

    // Send the newly inserted user data as a response
    res.json(newUser.rows[0]);

    // Generating a JWT token should be done here (you need to implement this part)
  } catch (err) {
    console.error(err.message);
  }
});

// login route
router.post("/login", validInfo, async (req, res) => {
  // destructure the req.body

  const { email, password } = req.body;

  try {
    // check if user doesn't exist (if not then we throw error)

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Password or Email is incorrect");
    }

    // check if incoming password is the same as the database password

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json("Password or Email is incorrect");
    }

    // give them the jwt token

    const token = jwtGenerator(user.rows[0].id);

    res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Route to fetch user data based on the user ID in the token
router.get("/user-data", authorization, async (req, res) => {
  try {
    const userId = req.user.id; // Extract the user ID from the token

    // Fetch user data from the database based on the user ID
    const userData = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    if (userData.rows.length === 0) {
      return res.status(404).json("User not found");
    }

    res.json(userData.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
