module.exports = function (req, res, next) {
  const { email, firstname, lastname, password } = req.body;

  function validEmail(userEmail) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail);
  }

  if (req.path === "/register") {
    console.log(!email.length);
    if (![email, firstname, lastname, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email");
    }
  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email");
    }
  }

  next();
};
