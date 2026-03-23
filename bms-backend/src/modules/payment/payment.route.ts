import { Router } from "express";
import * as PaymentController from "./payment.controller";
const router = Router();

router.post("/create-order", PaymentController.createOrder);
router.post("/verify-payment", PaymentController.verifyPayment);

export default router;