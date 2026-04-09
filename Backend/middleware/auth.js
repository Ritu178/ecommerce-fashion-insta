// const jwt = require("jsonwebtoken");

// const SECRET = "mysecretkey";

// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization;

//   if (!token) return res.status(401).send("No Token");

//   jwt.verify(token, SECRET, (err, decoded) => {
//     if (err) return res.status(403).send("Invalid Token");

//     req.admin = decoded;
//     next();
//   });
// };

// module.exports = verifyToken;

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Invalid token format" });
  }

  jwt.verify(token, "secret_key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;