const jwt = require("jsonwebtoken");
const db = require("../db");
const { verifyPassword } = require("../utils/passwords");

exports.loginAdmin = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM admins WHERE email=? LIMIT 1",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
      }

      const admin = result[0];
      const isValid = await verifyPassword(password, admin.password);

      if (!isValid) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
      }

      const token = jwt.sign({ email: admin.email }, "mysecretkey", {
        expiresIn: "1h",
      });

      res.json({ success: true, token, admin });
    }
  );
};

exports.addProduct = (req, res) => {
  const { title, price, category, image } = req.body;

  db.query(
    "INSERT INTO products (title, price, category, image) VALUES (?, ?, ?, ?)",
    [title, price, category, image],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
};

exports.updateProduct = (req, res) => {
  const { title, price, category } = req.body;

  db.query(
    "UPDATE products SET title=?, price=?, category=? WHERE id=?",
    [title, price, category, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
};

exports.deleteProduct = (req, res) => {
  db.query("DELETE FROM products WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
};
