import { Request, Response, NextFunction } from "express";
import * as BookingService from "./booking.service";

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const booking = await BookingService.createBooking(req.body, req.user?._id);
        res.json({success: true, booking, message: "Booking created successfully"});
    } catch (error) {
        next(error);
    }
}

export const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookings = await BookingService.getAllBookings(req.user?._id);
        res.json({success: true, bookings});
    } catch (error) {
        next(error);
    }
}