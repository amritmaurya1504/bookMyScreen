import mongoose from "mongoose";
import { generateBookingRef } from "../../utils";
import { IBooking } from "./booking.interface";
import BookingModel from "./booking.model";
import Razorpay from "razorpay";
import { config } from "../../config/config";
import path from "path";


export const createBooking = async (booking: IBooking, userId: string) => {

    // 🔹 1. Basic validation
    if(!booking.showId || !booking.seats || booking.seats.length === 0 || !booking.paymentId || !booking.bookingFee) {
        throw new Error(`Invalid booking data!`)
    }

    // 🔹 2. Destructure all properties from body
    const { showId, seats, paymentId, bookingFee } = booking;

    // 🔹 3. Generate unique booking reference
    const bookingRef = generateBookingRef();

    // 🔹 4. Start Transaction // Protects against race condition
    const session = await mongoose.startSession();
    session.startTransaction();

    try{

            // 🔹 5. Critical Query (Check if ANY of the requested seats are already booked)
            const existingBooking = await BookingModel.findOne({
                showId, status: "CONFIRMED", seats: { $in: seats } // $in catches conflict → prevents double booking
            }).session(session);

            if(existingBooking){
                throw new Error(`One or more selected seats are already booked!`)
            }

            // 🔹 6. Verify Payement

            // - Fetch payment details and validate
            const razorpay = new Razorpay({
                key_id: config.razorpayKey,
                key_secret: config.razorPaySecret,
            });

            const paymentDetails = await razorpay.payments.fetch(paymentId);

            if(paymentDetails.status !== "captured"){
                throw new Error(`Payment not successful!`)
            }

            // 🔹 7. Create Booking // returns array → we extract first item
            const [booking] = await BookingModel.create( 
                    [
                        {
                                bookingRef: bookingRef,
                                userId,
                                showId,
                                seats,
                                status: "CONFIRMED",
                                paymentId,
                                paymentMethod : paymentDetails.method,
                                bookingFee
                        },
                    ],
                { session }
            );

            // Persist data permanently
            await session.commitTransaction();
            session.endSession();

            return booking;

    }catch(error){
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
}

export const getAllBookings = async (userId: string) => {
    return await BookingModel.find({userId})
    .populate({
        path: "showId",
        select : "startTime date audioType format",
        populate: [{
            path: "movie",
            select: "title posterUrl duration"
        },
        {
            path: "theater",
            select: "name location city state"
        }
    ]
    })
    .sort({ bookingDateTime: -1 }); // latest bookings first
}