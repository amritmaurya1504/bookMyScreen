import mongoose, { Schema } from "mongoose";
import { IBooking } from "./booking.interface";

const bookingSchema = new Schema<IBooking>(
  {
    bookingRef: {
      type: String,
      required: true,
      unique: true, // ensures unique booking reference
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // fast queries
    },

    showId: {
      type: Schema.Types.ObjectId,
      ref: "Show",
      required: true,
      index: true, // fast queries
    },

    seats: [
      {
        type: String,
        required: true,
      },
    ],

    status: {
      type: String,
      enum: ["CONFIRMED", "FAILED", "CANCELLED"],
      default: "CONFIRMED",
    },

    bookingDateTime: {
      type: Date,
      default: Date.now,
    },

    paymentId: {
      type: String,
      required: true,
    },

    paymentMethod: {
      type: String,
      required: true,
    },

    bookingFee: {
      ticketPrice: {
        type: Number,
        required: true,
      },
      convenience: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);


bookingSchema.pre("save", function (next) {
  this.seats.sort();
  next();
});

const BookingModel = mongoose.model<IBooking>("Booking", bookingSchema);
export default BookingModel;