const jwt = require("jsonwebtoken");
const db = require("../db");
const { hashPassword, verifyPassword } = require("../utils/passwords");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, hashedPassword], (err) => {
      if (err) {
        console.log(err);
        return res.send("Error in signup ");
      }

      res.send("User Registered ");
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in signup ");
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? LIMIT 1";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Error in login ");
    }

    if (result.length > 0) {
      const user = result[0];
      const isValid = await verifyPassword(password, user.password);

      if (!isValid) {
        return res.send("Invalid Credentials ");
      }

      const token = jwt.sign({ user }, "secretkey", {
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
