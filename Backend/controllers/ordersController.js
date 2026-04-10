const db = require("../db");

const getAllOrdersAdmin = (req, res) => {
  db.query("SELECT * FROM orders ORDER BY id DESC", (err, results) => {
    if (err) {
      console.log("SQL ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
};

const createOrder = (req, res) => {
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

  const sql = `
    INSERT INTO orders 
    (user_id, name, email, phone, address, city, state, pincode, payment, notes, products, total, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
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
        console.log("SQL ERROR:", err);
        return res.status(500).json({ success: false, message: err.message });
      }

      res.json({
        success: true,
        message: "Order placed successfully!",
        order_id: result.insertId,
      });
    }
  );
};

module.exports = {
  getAllOrdersAdmin,
  createOrder,
};
