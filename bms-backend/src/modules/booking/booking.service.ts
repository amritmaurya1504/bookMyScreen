import { IBooking } from "./booking.interface";
import BookingModel from "./booking.model";


export const createBooking = async (booking: IBooking) => {
    return await BookingModel.create(booking);
}

export const getAllBookings = async (userId: string) => {
    return await BookingModel.find({userId});
}