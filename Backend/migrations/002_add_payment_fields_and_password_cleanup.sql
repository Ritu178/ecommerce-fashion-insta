ALTER TABLE orders
  ADD COLUMN payment_meta JSON NULL,
  ADD COLUMN payment_provider VARCHAR(50) NULL,
  ADD COLUMN razorpay_qr_code_id VARCHAR(100) NULL,
  ADD COLUMN razorpay_payment_id VARCHAR(100) NULL,
  ADD COLUMN razorpay_payment_status VARCHAR(50) NULL,
  ADD COLUMN razorpay_payment_method VARCHAR(50) NULL,
  ADD COLUMN razorpay_payment_amount BIGINT NULL;
