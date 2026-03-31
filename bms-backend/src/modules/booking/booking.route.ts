import { Router } from "express";
import * as BookingController from "./booking.controller";


const router = Router();

router.post("/", BookingController.createBookingHandler);
router.get("/", BookingController.getUserBookingsHandler);

export default router;