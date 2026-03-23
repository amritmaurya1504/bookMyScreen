import { Router } from "express";
import * as BookingController from "./booking.controller";


const router = Router();

router.post("/", BookingController.createBooking);
router.get("/", BookingController.getAllBookings);

export default router;