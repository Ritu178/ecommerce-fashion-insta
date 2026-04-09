// const express = require("express");
// const router = express.Router();

// const {
//   addToCart,
//   getCart,
//   updateCart,
//   deleteCart,
// } = require("../controllers/cartController");

// // routes
// router.post("/cart/add", addToCart);
// router.get("/cart/:userId", getCart);
// router.put("/cart/update", updateCart);
// router.delete("/cart/delete", deleteCart);

// module.exports = router;

// const {
//   addToCart,
//   getCart,
//   updateCart,
//   deleteCart,
//   saveForLater,
//   checkout,
//   getOrders,
// } = require("../controllers/cartController");

// router.delete("/cart/delete", deleteCart);
// router.post("/cart/save", saveForLater);
// router.post("/cart/checkout", checkout);
// router.get("/orders/:userId", getOrders);

const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateCart,
  deleteCart,
  saveForLater,
  checkout,
  getOrders,
} = require("../controllers/cartController");

router.post("/cart/add", addToCart);
router.get("/cart/:userId", getCart);
router.put("/cart/update", updateCart);

// extra
// router.delete("/cart/delete", deleteCart);
router.delete("/cart/delete/:userId/:productId", deleteCart);

router.post("/cart/save", saveForLater);
router.post("/cart/checkout", checkout);
router.get("/orders/:userId", getOrders);

module.exports = router;