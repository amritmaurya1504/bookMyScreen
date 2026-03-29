import { Router } from "express";
import * as BookingController from "./booking.controller";
import { isVerifiedUser } from "../../middlewares/auth.middleware";


const router = Router();

router.post("/", isVerifiedUser , BookingController.createBooking);
router.get("/", isVerifiedUser , BookingController.getAllBookings);

export default router;