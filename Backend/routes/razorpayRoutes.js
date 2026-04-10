const express = require("express");
const axios = require("axios");

const router = express.Router();

const RAZORPAY_API_BASE = "https://api.razorpay.com/v1";

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    const error = new Error("Razorpay credentials are missing.");
    error.statusCode = 500;
    throw error;
  }

  return axios.create({
    baseURL: RAZORPAY_API_BASE,
    auth: {
      username: keyId,
      password: keySecret,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
}

router.post("/qr", async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    const client = getRazorpayClient();
    const response = await client.post("/payments/qr_codes", {
      type: "upi_qr",
      name: req.body.name || "FASHIONISTA Checkout",
      usage: "single_use",
      fixed_amount: true,
      payment_amount: Math.round(amount * 100),
      description: req.body.description || "FASHIONISTA order payment",
      close_by: Math.floor(Date.now() / 1000) + 15 * 60,
      notes: req.body.notes || {},
    });

    return res.json({
      success: true,
      qr: response.data,
    });
  } catch (error) {
    const statusCode = error?.response?.status || error.statusCode || 500;
    const message =
      error?.response?.data?.error?.description ||
      error?.response?.data?.error?.message ||
      error.message ||
      "Unable to create Razorpay QR code";

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
});

router.post("/order", async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    const client = getRazorpayClient();
    const response = await client.post("/orders", {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: req.body.receipt || `receipt_${Date.now()}`,
      notes: req.body.notes || {},
    });

    return res.json({
      success: true,
      order: response.data,
    });
  } catch (error) {
    const statusCode = error?.response?.status || error.statusCode || 500;
    const message =
      error?.response?.data?.error?.description ||
      error?.response?.data?.error?.message ||
      error.message ||
      "Unable to create Razorpay order";

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
});

router.get("/qr/:id/payments", async (req, res) => {
  try {
    const client = getRazorpayClient();
    const response = await client.get(`/payments/qr_codes/${req.params.id}/payments`, {
      params: {
        count: 100,
      },
    });

    const payload = response.data || {};

    return res.json({
      success: true,
      payments: Array.isArray(payload.items) ? payload.items : [],
      raw: payload,
    });
  } catch (error) {
    const statusCode = error?.response?.status || 500;
    const message =
      error?.response?.data?.error?.description ||
      error?.response?.data?.error?.message ||
      error.message ||
      "Unable to fetch Razorpay QR payments";

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
});

module.exports = router;
