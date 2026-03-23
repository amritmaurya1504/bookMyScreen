import mongoose, { Document } from "mongoose";

export interface IBooking extends Document {
  bookingRef: string;
  userId: mongoose.Types.ObjectId;
  showId: mongoose.Types.ObjectId;
  seats: string[];
  status: "CONFIRMED" | "FAILED" | "CANCELLED";
  bookingDateTime: Date;
  paymentId: string;
  paymentMethod: string;
  bookingFee: {
    ticketPrice: number;
    total: number;
    convenience: number;
  };
}
