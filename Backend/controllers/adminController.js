const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = "mysecretkey";

// LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM admins WHERE email=?", [email], async (err, result) => {
    if (result.length === 0) {
      return res.json({ success: false });
    }

    const valid = await bcrypt.compare(password, result[0].password);

    if (!valid) return res.json({ success: false });

    const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });

    res.json({ success: true, token });
  });
};

// ADD PRODUCT
exports.addProduct = (req, res) => {
  const { title, price, category } = req.body;
  const image = req.file.filename;

  db.query(
    "INSERT INTO products (title, price, category, image) VALUES (?, ?, ?, ?)",
    [title, price, category, image],
    (err) => {
      if (err) return res.send(err);
      res.send("Product Added");
    }
  );
};

// UPDATE PRODUCT
exports.updateProduct = (req, res) => {
  const { title, price, category } = req.body;

  db.query(
    "UPDATE products SET title=?, price=?, category=? WHERE id=?",
    [title, price, category, req.params.id],
    (err) => {
      if (err) return res.send(err);
      res.send("Updated");
    }
  );
};

// DELETE PRODUCT
exports.deleteProduct = (req, res) => {
  db.query("DELETE FROM products WHERE id=?", [req.params.id], (err) => {
    if (err) return res.send(err);
    res.send("Deleted");
  });
};



