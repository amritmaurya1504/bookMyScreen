import React from "react";
import Header from "../components/seat-layout/Header";
import dayjs from "dayjs";
import { calculateTotalPrice } from "../utils";
import { FaInfoCircle } from "react-icons/fa";
import { BiSolidOffer } from "react-icons/bi";
import { CiCircleQuestion, CiUser } from "react-icons/ci";

const Checkout = () => {
  // ✅ Mock static data
  const shows = {
    _id: "show123",
    date: "12-10-2025",
    startTime: "07:30 PM",
    movie: {
      title: "Interstellar",
      certification: "UA13+",
      languages: ["English", "Hindi"],
      format: ["2D", "IMAX"],
      posterUrl:
        "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
    },
    theatre: {
      name: "PVR Icon",
      city: "Kolkata",
      state: "West Bengal",
    },
  };

  const selectedSeats = [
    { type: "PREMIUM", seatNumber: "B5", price: 250 },
    { type: "EXECUTIVE", seatNumber: "B6", price: 250 },
  ];

  const user = {
    name: "Amrit Raj",
    phone: "9876543210",
    email: "amrit@example.com",
    state: "West Bengal",
  };

  //   const { base, tax, total } = calculateTotalPrice(selectedSeats);

  return (
    <div className="min-h-screen w-full bg-white">
      <Header type="checkout" />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section */}
          <div className="flex-1 space-y-4">
            {/* Movie Details */}
            <div className="flex gap-4">
              <img
                src={shows.movie.posterUrl}
                alt={shows.movie.title}
                className="w-[60px] h-[90px] rounded object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{shows.movie.title}</h3>
                <p className="text-sm text-gray-600">
                  {shows.movie.certification} •{" "}
                  {shows.movie.languages.join(", ")} •{" "}
                  {shows.movie.format.join(", ")}
                </p>
                <p className="text-sm text-gray-600">
                  {shows.theatre.name}, {shows.theatre.city},{" "}
                  {shows.theatre.state}
                </p>
              </div>
            </div>
            {/* Show Details */}
            <div className="border border-gray-200 rounded-[24px] px-6 py-5">
              <p className="text-md font-medium border-b pb-5 border-gray-200">
                {dayjs(shows.date, "DD-MM-YYYY")
                  .format("D MMMM YYYY")
                  .split(" ")
                  .slice(0, 2)
                  .join(" ")}{" "}
                &nbsp;• <span className="font-semibold">{shows.startTime}</span>
              </p>
              <div className="flex items-center justify-between mt-4 mb-4">
                <div>
                  <p className="text-md mt-2 font-semibold">
                    {selectedSeats.length} ticket
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">
                      {selectedSeats.map((seat) => (
                        <p className="font-medium">
                          {seat.type} - {seat.seatNumber}
                        </p>
                      ))}
                    </span>
                  </div>
                </div>
                <p className="text-md font-semibold mt-2">
                  <span className="text-gray-700">₹</span>
                  123
                </p>
              </div>
            </div>

            {/* Cancellation Notice */}
            <div className="bg-white border rounde-[24px] border-gray-200 text-yellow-800 text-sm px-6 py-5 tracking-wide">
              <span className="font-medium flex items-center gap-2">
                <FaInfoCircle size={24} /> No cancellation or refund available
                after payment.
              </span>
            </div>

            {/* Offers */}
            <div className="flex items-center justify-between border rounded-[24px] border-gray-200 px-6 py-5">
              <p className="font-medium text-sm flex items-center gap-2">
                <BiSolidOffer size={20} /> Available Offers
              </p>
              <p className="text-sm text-center text-blue-600 font-medium cursor-pointer">
                View all offers
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-[300px] space-y-4">
            <h4 className="font-medium text-gray-900 text-lg">
              Payment Summary
            </h4>
            <div className="border border-gray-200 rounded-[24px] px-6 py-7 space-y-2">
              <div className="flex justify-between text-md">
                <span className="text-sm text-gray-500">Order amount</span>
                <span>₹123</span>
              </div>
              <div className="flex justify-between text-md pb-4">
                <span className="font-semibold text-sm">Taxes & fees (5%)</span>
                <span>₹34</span>
              </div>
              <div className="flex justify-between text-md font-semibold border-t border-gray-200 pt-4">
                <span>To be paid</span>
                <span>₹500</span>
              </div>
            </div>

            {/* User details */}
            <h4 className="text-lg font-medium">Your details</h4>
            <div className="border flex items-start gap-3 border-gray-200 rounded-[24px] px-6 py-7">
              <CiUser size={24} />
              <div className="-mt-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-sm text-gray-600">+91-{user?.phone}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-600">{user.state}</p>
              </div>
            </div>

            {/* Terms and button */}
            <div className="border border-gray-200 rounded-[24px] px-6 py-5">
              <p className="text-sm font-medium cursor-pointer flex items-center gap-2">
                <CiCircleQuestion size={24} /> Terms and conditions
              </p>
            </div>
            
            <div className="flex justify-between items-center bg-black rounded-[24px] px-6 py-4 cursor-pointer">
                      <p className="text-white font-bold">
                        ₹500 <span className="text-xs font-medium">TOTAL</span>
                      </p>
                      <p className="text-white font-medium">Proceed To Pay</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
