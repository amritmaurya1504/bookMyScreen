import mongoose, { ClientSession, Types } from "mongoose";
import { generateSeatLayout, groupShowsByTheatreAndMovie } from "../../utils";
import { IShow } from "./show.interface";
import { ShowModel } from "./show.model";

//1. Create a show
export const createShow = async (showData: IShow) => {
  const seatLayout = generateSeatLayout();
  const showToCreate = { ...showData, seatLayout };

  return await ShowModel.create(showToCreate);
};
//2. get shows by movie date and location
export const getShowsByMovieDateLocation = async (
  movieId: string,
  date: string,
  location: string
) => {
  const query: any = {
    movie: new Types.ObjectId(movieId),
    location: { $regex: new RegExp(location, "i") },
  };

  if (date) {
    query.date = date;
  }

  const shows = await ShowModel.find(query)
    .populate("movie theater")
    .sort({ startTime: 1 });

  const groupedShows = groupShowsByTheatreAndMovie(shows);

  return groupedShows;
};
//3. get show by id
export const getShowById = async (showId: string) => {
  return await ShowModel.findById(showId).populate("movie theater");
};

//4. update seat status
export const updateSeatStatus = async (
  showId: mongoose.Types.ObjectId | string,
  seats: string[],
  status: "AVAILABLE" | "BOOKED" | "BLOCKED",
  session: ClientSession
) => {

  const show = await ShowModel.findById(showId).session(session);
  if (!show) throw new Error("Show not found!");

  // Parse each seat string into { row, number }
  const parsedSeats = seats.map((seat: string) => ({
      row: seat.charAt(0).toUpperCase(),           // "A1" → "A"
      number: parseInt(seat.slice(1), 10)          // "A1" → 1
  }));

  // Update status in seatLayout
 // Loop over each parsed seat object like { row: "A", number: 1 }
  for (const parsedSeat of parsedSeats) {

      // Search the seatLayout array for a row whose "row" field matches e.g. "A"
      // seatLayout = [{ row: "A", seats: [...] }, { row: "B", seats: [...] }]
      const row = show.seatLayout.find((r: any) => r.row === parsedSeat.row);
      // row = { row: "A", type: "NORMAL", price: 180, seats: [...] }

      // If no matching row found, that seat string was invalid e.g. "Z5"
      if (!row) throw new Error(`Row ${parsedSeat.row} not found!`);

      // Inside the found row, search the seats array for matching seat number
      // row.seats = [{ number: 1, status: "AVAILABLE" }, { number: 2, status: "AVAILABLE" }]
      const seat = row.seats.find((s: any) => s.number === parsedSeat.number);
      // seat = { number: 1, status: "AVAILABLE" }

      // If no matching seat number found e.g. "A99" where row A only has 20 seats
      if (!seat) throw new Error(`Seat ${parsedSeat.row}${parsedSeat.number} not found!`);

      // Guard: prevent double booking — if already BOOKED, reject the whole transaction
      if (seat.status === "BOOKED") throw new Error(`Seat ${parsedSeat.row}${parsedSeat.number} is already booked!`);

      // Mutate the seat object in-place directly inside show.seatLayout
      // This works because `row` and `seat` are references, not copies
      // So modifying seat.status here actually modifies show.seatLayout internally
      seat.status = "BOOKED";
  }

  // Mongoose tracks changes on typed Schema fields automatically
  // But seatLayout is defined as [] (untyped) in the schema
  // So Mongoose doesn't know it was mutated — we must tell it explicitly
  show.markModified("seatLayout");

  // Persist the updated show document to MongoDB
  // { session } ensures this save is part of the ongoing transaction
  // If transaction aborts later, this save is also rolled back
  await show.save({ session });

};


