const express = require("express");
const router = express.Router();
const db = require("../db");

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
  } = req.body;

  const query = `
    INSERT INTO orders 
    (user_id, name, email, phone, address, city, state, pincode, payment, notes, products, total, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

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
      notes,
      JSON.stringify(products), 
      total_price,             
      "Pending",
    ],
    (err, result) => {
      if (err) {
        console.log("DB ERROR 👉", err);
        return res.json({ success: false, message: "DB Error" });
      }

      res.json({ success: true, message: "Order placed" });
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

//  UPDATE ORDER STATUS
router.put("/:id", (req, res) => {
  const { status } = req.body;

  db.query(
    "UPDATE orders SET status=? WHERE id=?",
    [status, req.params.id],
    (err) => {
      if (err) {
        console.log(err);
        return res.json({ success: false });
      }

      res.json({ success: true });
    }
  );
});

//  DELETE ORDER
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