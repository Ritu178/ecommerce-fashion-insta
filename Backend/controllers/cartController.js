

const db = require("../db");


// ADD TO CART
exports.addToCart = (req, res) => {
  const { userId, productId } = req.body;

  const checkSql = "SELECT * FROM cart WHERE user_id=? AND product_id=?";

  db.query(checkSql, [userId, productId], (err, result) => {
    if (err) return res.send(err);

    if (result.length > 0) {
      db.query(
        "UPDATE cart SET quantity = quantity + 1 WHERE user_id=? AND product_id=?",
        [userId, productId],
        () => res.send("Quantity Increased")
      );
    } else {
      db.query(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1)",
        [userId, productId],
        () => res.send("Added to Cart")
      );
    }
  });
};

//  GET CART
exports.getCart = (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT 
      c.product_id,
      c.quantity,
      p.title,
      p.price,
      p.image,
      p.description
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).send(err);

    res.json(result);
  });
};

//  UPDATE CART
exports.updateCart = (req, res) => {
  const { userId, productId, type } = req.body;

  const sql =
    type === "inc"
      ? "UPDATE cart SET quantity = quantity + 1 WHERE user_id=? AND product_id=?"
      : "UPDATE cart SET quantity = quantity - 1 WHERE user_id=? AND product_id=?";

  db.query(sql, [userId, productId], (err) => {
    if (err) return res.send(err);
    res.send("Updated");
  });
};
exports.deleteCart = (req, res) => {
  const { userId, productId } = req.params;

  const sql = "DELETE FROM cart WHERE user_id=? AND product_id=?";
  
  db.query(sql, [userId, productId], (err) => {
    if (err) return res.send(err);
    res.send("Deleted ");
  });
};

exports.saveForLater = (req, res) => {
  const { userId, productId } = req.body;

  // remove from cart
  db.query(
    "DELETE FROM cart WHERE user_id=? AND product_id=?",
    [userId, productId]
  );

  // add to saved
  db.query(
    "INSERT INTO saved (user_id, product_id) VALUES (?, ?)",
    [userId, productId],
    (err) => {
      if (err) return res.send(err);
      res.send("Saved for later");
    }
  );
};

exports.checkout = (req, res) => {
  const { userId } = req.body;

  // get cart items
  db.query(
    "SELECT * FROM cart WHERE user_id=?",
    [userId],
    (err, cartItems) => {
      if (err) return res.send(err);

      let total = 0;
      cartItems.forEach((item) => {
        total += item.quantity * 100; // dummy price
      });

      // create order
      db.query(
        "INSERT INTO orders (user_id, total) VALUES (?, ?)",
        [userId, total],
        (err, result) => {
          const orderId = result.insertId;

          // insert order items
          cartItems.forEach((item) => {
            db.query(
              "INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)",
              [orderId, item.product_id, item.quantity]
            );
          });

          // clear cart
          db.query("DELETE FROM cart WHERE user_id=?", [userId]);

          res.send("Order placed");
        }
      );
    }
  );
};

// ORDER HISTORY
exports.getOrders = (req, res) => {
  const { userId } = req.params;

  db.query(
    "SELECT * FROM orders WHERE user_id=?",
    [userId],
    (err, result) => {
      if (err) return res.send(err);
      res.json(result);
    }
  );
};








