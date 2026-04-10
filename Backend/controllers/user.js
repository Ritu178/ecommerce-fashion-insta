const jwt = require("jsonwebtoken");
const db = require("../db");

exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(sql, [name, email, password], (err) => {
    if (err) {
      console.log(err);
      return res.send("Error in signup ");
    }

    res.send("User Registered ");
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Error in login ");
    }

    if (result.length > 0) {
      const token = jwt.sign({ user: result[0] }, "secretkey", {
        expiresIn: "1h",
      });

      res.json({
        message: "Login Successful ",
        token,
      });
    } else {
      res.send("Invalid Credentials ");
    }
  });
};
