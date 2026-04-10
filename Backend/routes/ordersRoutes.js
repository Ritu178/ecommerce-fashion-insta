const express = require("express");
const router = express.Router();
const db = require("../db");

const parseProducts = (products) => {
  if (Array.isArray(products)) return products;

  if (typeof products === "string" && products.trim()) {
    try {
      const parsed = JSON.parse(products);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
};

const writeOrderItems = (orderId, products) => {
  const items = parseProducts(products);

  if (items.length === 0) {
    return Promise.resolve();
  }

  return Promise.all(
    items.map((item) => {
      const productId = item.product_id ?? item.id;
      const quantity = Number(item.quantity || 1);

      if (!productId) {
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)",
          [orderId, productId, quantity],
          (err) => {
            if (err) {
              reject(err);
              return;
            }

            resolve();
          }
        );
      });
    })
  );
};

// CREATE ORDER
router.post("/", (req, res) => {
  const {
    user_id,
    name,
    email,
    phone,
    address,
    city,
    state,
    pincode,
    payment,
    notes,
    products,
    total_price,
    razorpay_qr_code_id,
    razorpay_payment_id,
    razorpay_payment_status,
    razorpay_payment_method,
    razorpay_payment_amount,
  } = req.body;

  const query = `
    INSERT INTO orders
    (user_id, name, email, phone, address, city, state, pincode, payment, payment_meta, payment_provider, razorpay_qr_code_id, razorpay_payment_id, razorpay_payment_status, razorpay_payment_method, razorpay_payment_amount, notes, products, total, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const paymentMeta = {
    razorpay_qr_code_id: razorpay_qr_code_id || null,
    razorpay_payment_id: razorpay_payment_id || null,
    razorpay_payment_status: razorpay_payment_status || null,
    razorpay_payment_method: razorpay_payment_method || null,
    razorpay_payment_amount: razorpay_payment_amount ?? null,
  };

  db.query(
    query,
    [
      user_id,
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      payment,
      JSON.stringify(paymentMeta),
      payment === "Online" ? "razorpay" : "cod",
      razorpay_qr_code_id || null,
      razorpay_payment_id || null,
      razorpay_payment_status || null,
      razorpay_payment_method || null,
      razorpay_payment_amount ?? null,
      notes,
      JSON.stringify(products),
      total_price,
      "Pending",
    ],
    (err, result) => {
      if (err) {
        console.log("DB ERROR =>", err);
        return res.status(500).json({ success: false, message: "DB Error" });
      }

      db.query("DELETE FROM cart WHERE user_id=?", [user_id], (cartErr) => {
        if (cartErr) {
          console.log("CART CLEAR ERROR =>", cartErr);
        }

        writeOrderItems(result.insertId, products)
          .then(() => {
            res.json({
              success: true,
              message: "Order placed",
              order_id: result.insertId,
            });
          })
          .catch((itemsErr) => {
            console.log("ORDER ITEMS ERROR =>", itemsErr);
            res.json({
              success: true,
              message: "Order placed",
              order_id: result.insertId,
            });
          });
      });
    }
  );
});

// GET ALL ORDERS (ADMIN)
router.get("/", (req, res) => {
  db.query("SELECT * FROM orders ORDER BY id DESC", (err, result) => {
    if (err) {
      console.log(err);
      return res.json([]);
    }

    res.json(result);
  });
});

// GET ORDERS FOR LOGGED-IN USER
router.get("/user/:userId", (req, res) => {
  db.query(
    "SELECT * FROM orders WHERE user_id=? ORDER BY id DESC",
    [req.params.userId],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json([]);
      }

      const orders = (Array.isArray(result) ? result : []).map((order) => ({
        ...order,
        products: parseProducts(order.products),
      }));

      res.json(orders);
    }
  );
});

// UPDATE ORDER STATUS
router.put("/:id", (req, res) => {
  const { status } = req.body;

  db.query("UPDATE orders SET status=? WHERE id=?", [status, req.params.id], (err) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    res.json({ success: true });
  });
});

// DELETE ORDER
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM orders WHERE id=?", [req.params.id], (err) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }

    res.json({ success: true });
  });
});

module.exports = router;
