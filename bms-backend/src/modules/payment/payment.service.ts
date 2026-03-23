
import Razorpay from "razorpay";
import { config } from "../../config/config";
import * as crypto from "crypto";
import { IPaymentData, IVerifyPayment } from "./payment.interface";

export const createOrder = async (paymentData: IPaymentData) => {

  const razorpay = new Razorpay({
    key_id: config.razorpayKey,
    key_secret: config.razorPaySecret,
  });

    const { amount } = paymentData;
    const options = {
      amount: amount * 100, // Amount in paisa (1 INR = 100 paisa)
      currency: "INR",
      receipt: `bms-ticket_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);

    return order;
};

export const verifyPayment = async (paymentData: IVerifyPayment) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

    const expectedSignature = crypto
      .createHmac("sha256", config.razorPaySecret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    return expectedSignature === razorpay_signature;
}