


const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./config/.env" });
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const multer = require("multer");
const db = require("./db");
const OpenAI = require("openai");

const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const ordersRoutes = require("./routes/ordersRoutes");
const { getAllOrdersAdmin } = require("./controllers/ordersController");
const app = express();
const SECRET = "mysecretkey";


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

const openai = new OpenAI({
  apiKey: "YOUR_OPENAI_API_KEY",
});

// USER LOGIN
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=? AND password=?",
    [email, password],
    (err, result) => {
      if (err) return res.status(500).send(err);

      if (result.length > 0) {
        const user = result[0];

        const token = jwt.sign({ id: user.id }, SECRET, {
          expiresIn: "1h",
        });

        res.json({
          success: true,
          token,
          user: { _id: user.id, name: user.name, email: user.email },
        });
      } else {
        res.status(400).json({ success: false, message: "Invalid login" });
      }
    }
  );
});

// ADMIN LOGIN
app.post("/admin/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM admins WHERE email=? AND password=?",
    [email, password],
    (err, result) => {
      if (err) return res.status(500).send(err);

      if (result.length > 0) {
        const token = jwt.sign({ email }, SECRET, {
          expiresIn: "1h",
        });

        res.json({ success: true, token });
      } else {
        res.status(400).json({ success: false });
      }
    }
  );
});


const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "No Token" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid Token" });
    }

    req.admin = decoded;
    next();
  });
};
app.post("/api/signup", (req, res) => {
  const { name, email, password } = req.body;

  // validation
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // check user already exists
  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length > 0) {
        return res.json({
          success: false,
          message: "User already exists",
        });
      }

      // insert new user
      db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, password],
        (err, result) => {
          if (err) return res.status(500).json(err);

          res.json({
            success: true,
            message: "Signup successful",
          });
        }
      );
    }
  );
});
app.post("/api/contact", (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.json({ success: false, message: "All fields required" });
  }

  const sql =
    "INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, email, phone, message], (err, result) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).json({ success: false });
    }

    res.json({ success: true });
  });
});
app.post("/api/chat", (req, res) => {
  const msg = req.body.message.toLowerCase();

  console.log("USER MSG:", msg); // debug

  // 👗 DRESS
  if (msg.includes("dress")) {
    return res.json({
      reply: "We have amazing dresses 👗 Check women's collection!",
    });
  }

  // 👕 MEN
  if (msg.includes("men") || msg.includes("jacket")) {
    return res.json({
      reply: "Check out stylish Men Jackets 🧥",
    });
  }

  // 👶 CHILDREN
  if (msg.includes("kids") || msg.includes("children")) {
    return res.json({
      reply: "Cute kids collection available 👶",
    });
  }

  // 👋 HELLO
  if (msg.includes("hello") || msg.includes("hi")) {
    return res.json({
      reply: "Hello 😊 How can I help you?",
    });
  }
if (msg.includes("shoes")) {
  return res.json({ reply: "Check out our latest shoes 👟" });
}

if (msg.includes("price")) {
  return res.json({ reply: "Prices start from ₹999 💸" });
}
  // 📦 ORDER
  if (msg.includes("order")) {
    return res.json({
      reply: "Please enter your Order ID 📦",
    });
  }

  // ❌ DEFAULT
  return res.json({
    reply: "Sorry 😅 I didn't understand. Try 'dress', 'order', etc.",
  });
});
app.post("/api/track-order", (req, res) => {
  const { orderId } = req.body;

  const sql = "SELECT * FROM orders WHERE id = ?";

  db.query(sql, [orderId], (err, result) => {
    if (err || result.length === 0) {
      return res.json({ reply: "Order not found ❌" });
    }

    res.json({
      reply: `Order Status: ${result[0].status}`,
    });
  });
});

// GET ADMIN PRODUCTS
app.get("/admin/products", verifyToken, (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// GET USER PRODUCTS
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ADD PRODUCT
app.post(
  "/admin/add-product",
  verifyToken,
  upload.single("image"),
  (req, res) => {
    const { title, price, category, description } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!title || !price || !category || !description || !image) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    db.query(
      "INSERT INTO products (title, price, category, description, image) VALUES (?, ?, ?, ?, ?)",
      [title, price, category, description, image],
      (err) => {
        if (err) return res.status(500).send(err);

        res.json({ success: true, message: "Product Added" });
      }
    );
  }
);

// SINGLE PRODUCT
app.get("/products/:id", (req, res) => {
  db.query(
    "SELECT * FROM products WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0]);
    }
  );
});

// UPDATE PRODUCT
app.put(
  "/admin/update-product/:id",
  verifyToken,
  upload.single("image"),
  (req, res) => {
    const { title, price, category, description } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!title || !price || !category || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const query = image
      ? "UPDATE products SET title=?, price=?, category=?, description=?, image=? WHERE id=?"
      : "UPDATE products SET title=?, price=?, category=?, description=? WHERE id=?";

    const params = image
      ? [title, price, category, description, image, req.params.id]
      : [title, price, category, description, req.params.id];

    db.query(query, params, (err) => {
      if (err) return res.status(500).send(err);

      res.json({ success: true, message: "Product Updated" });
    });
  }
);

// DELETE PRODUCT
app.delete("/admin/delete-product/:id", verifyToken, (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT image FROM products WHERE id=?",
    [id],
    async (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({ error: "Not found" });
      }

      const image = result[0].image;

      if (image) {
        await fs.unlink(`uploads/${image}`).catch(() => {});
      }

      db.query("DELETE FROM cart WHERE product_id=?", [id]);
      db.query("DELETE FROM products WHERE id=?", [id], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ success: true, message: "Deleted" });
      });
    }
  );
});


app.get("/api/products/women", (req, res) => {
  db.query("SELECT * FROM products WHERE category='women'", (err, r) => {
    if (err) return res.send(err);
    res.json(r);
  });
});

app.get("/api/products/men", (req, res) => {
  db.query("SELECT * FROM products WHERE category='men'", (err, r) => {
    if (err) return res.send(err);
    res.json(r);
  });
});

app.get("/api/products/children", (req, res) => {
  db.query("SELECT * FROM products WHERE category='children'", (err, r) => {
    if (err) return res.send(err);
    res.json(r);
  });
});


app.post("/api/promo", (req, res) => {
  const { code, total } = req.body;

  const promos = [
    { code: "SAVE20", discount: 20 },
    { code: "FLAT100", discount: 100 },
  ];

  const promo = promos.find(
    (p) => p.code.toLowerCase() === code.toLowerCase()
  );

  if (!promo) return res.json({ success: false });

  let discount =
    promo.discount < 50
      ? Math.floor((total * promo.discount) / 100)
      : promo.discount;

  res.json({ success: true, discountAmount: discount });
});


app.use("/api", userRoutes);
app.use("/api", cartRoutes);
app.use("/api/orders", ordersRoutes);
app.get("/admin/orders", verifyToken, getAllOrdersAdmin);
// New Orders Routes
// const ordersRoutes = require("./routes/ordersRoutes");
// app.use("/api/orders", ordersRoutes);

// Admin Orders - Full details with images
// app.get("/admin/orders", verifyToken, require("./controllers/ordersController").getAllOrdersAdmin);


app.get("/", (req, res) => {
  res.send("Backend Running");
});


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});