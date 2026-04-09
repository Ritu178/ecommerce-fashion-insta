const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./config/.env" });
const jwt = require("jsonwebtoken");
const multer = require("multer");
const db = require("./db");

const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();
const SECRET = "mysecretkey";

// ================== MIDDLEWARE ==================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// ================== MULTER ==================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ================== LOGIN ==================
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=? AND password=?",
    [email, password],
    (err, result) => {
      if (err) return res.status(500).send(err);

      if (result.length > 0) {
        const user = result[0];
        const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1h" });

        res.json({
          success: true,
          token,
          user: { _id: user.id, name: user.name, email: user.email },
        });
      } else {
        res.status(400).json({ success: false, message: "Invalid credentials" });
      }
    }
  );
});

// ================== ADMIN LOGIN ==================
app.post("/admin/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM admins WHERE email=? AND password=?",
    [email, password],
    (err, result) => {
      if (err) return res.send(err);

      if (result.length > 0) {
        const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });
        res.json({ success: true, token });
      } else {
        res.json({ success: false });
      }
    }
  );
});

// ================== TOKEN VERIFY ==================
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send("No Token");

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).send("Invalid Token");
    req.admin = decoded;
    next();
  });
};

// ================== PRODUCTS ==================
app.get("/admin/products", verifyToken, (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post("/admin/add-product", verifyToken, upload.single("image"), (req, res) => {
  const { title, price, category, description } = req.body;
  const image = req.file ? req.file.filename : null;

  db.query(
    "INSERT INTO products (title, price, category, description, image) VALUES (?, ?, ?, ?, ?)",
    [title, price, category, description, image],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ success: true });
    }
  );
});

app.delete("/admin/delete-product/:id", verifyToken, (req, res) => {
  db.query("DELETE FROM products WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ success: true });
  });
});

// ================== CATEGORY ==================
app.get("/api/products/women", (req, res) => {
  db.query("SELECT * FROM products WHERE category='women'", (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

app.get("/api/products/men", (req, res) => {
  db.query("SELECT * FROM products WHERE category='men'", (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

app.get("/api/products/children", (req, res) => {
  db.query("SELECT * FROM products WHERE category='children'", (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

// ================== PROMO ==================
app.post("/api/promo", (req, res) => {
  const { code, total } = req.body;

  const promoCodes = [
    { code: "SAVE20", discount: 20 },
    { code: "FLAT100", discount: 100 },
  ];

  const promo = promoCodes.find(
    (p) => p.code.toLowerCase() === code.toLowerCase()
  );

  if (!promo) return res.json({ success: false });

  let discountAmount =
    promo.discount < 50
      ? Math.floor((total * promo.discount) / 100)
      : promo.discount;

  res.json({ success: true, discountAmount });
});

// ================== ORDERS (IMPORTANT FIX) ==================

// GET ALL ORDERS (FIX FOR 404 ERROR)
app.get("/orders", (req, res) => {
  db.query("SELECT * FROM orders ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).send(err);

    const orders = result.map((order) => ({
      ...order,
      products: JSON.parse(order.products),
    }));

    res.json(orders);
  });
});

// GET USER ORDERS
app.get("/api/orders/user/:userId", (req, res) => {
  db.query(
    "SELECT * FROM orders WHERE user_id=? ORDER BY id DESC",
    [req.params.userId],
    (err, result) => {
      if (err) return res.status(500).send(err);

      const orders = result.map((order) => ({
        ...order,
        products: JSON.parse(order.products),
      }));

      res.json(orders);
    }
  );
});

// UPDATE ORDER STATUS
app.put("/api/orders/:id", (req, res) => {
  const { status } = req.body;

  db.query(
    "UPDATE orders SET status=? WHERE id=?",
    [status, req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ success: true });
    }
  );
});

// DELETE ORDER
app.delete("/api/orders/:id", (req, res) => {
  db.query("DELETE FROM orders WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ success: true });
  });
});

// ================== ROUTES ==================
app.use("/api", userRoutes);
app.use("/api", cartRoutes);

// ================== HOME ==================
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// ================== SERVER ==================
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});