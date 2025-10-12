import Header from "../components/seat-layout/Header";
import Footer from "../components/seat-layout/Footer";
import { useParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getShowById } from "../apis/index";
import screenImg from "../assets/screen.png"; 

const Seat = ({ seat, row }) => {
  const seatId = `${row}${seat.number}`;

  return (
    <button
      className={`w-9 h-9 m-[2px] rounded-lg border text-sm
        ${
          "hover:bg-gray-100 border-black cursor-pointer"
        }`}
      disabled={seat.status === "occupied"}
    >
      {seat.status === "occupied" ? "X" : seat.number}
    </button>
  );
};

const SeatLayout = () => {
  const { showId } = useParams();

  const {
    data: showData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["show", showId],
    queryFn: async () => await getShowById(showId),
    placeholderData: keepPreviousData,
    enabled: !!showId,
    select: (res) => res.data,
  });

  console.log(showData);

  return (
    <>
      <div className="h-screen overflow-y-hidden">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 w-full z-10">
          <Header showData={showData} />
        </div>
        {/* Scrollable Seat Layout */}
         <div className="max-w-7xl mx-auto mt-[210px] px-6 pb-4 bg-white h-[calc(100vh-320px)] overflow-y-scroll scrollbar-hide">
          <div className="flex flex-col items-center justify-center">
            {showData?.seatLayout && (
              <div className="flex flex-col items-center justify-center">
                {Object.entries(
                  showData.seatLayout.reduce((acc, curr) => {
                    if (!acc[curr.type])
                      acc[curr.type] = { price: curr.price, rows: [] };
                    acc[curr.type].rows.push(curr);
                    return acc;
                  }, {})
                ).map(([type, { price, rows }]) => (
                  <div
                    key={type}
                    className="mb-12 w-full flex flex-col items-center justify-center"
                  >
                    <h2 className="text-center font-semibold text-lg mb-4">
                      {type} : ₹{price}
                    </h2>
                    <div className="space-y-2">
                      {rows.map((rowObj) => (
                        <div key={rowObj.row} className="flex items-center">
                          <div className="w-6 text-right mr-2 text-sm text-gray-600">
                            {rowObj.row}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {rowObj.seats.map((seat, i) => (
                              <Seat
                                key={i}
                                seat={seat}
                                row={rowObj.row}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center mt-5">
              <img
                src={screenImg} // or "/screen.png" if in public
                alt="Screen"
                className="w-[300px] md:w-[400px] object-contain opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="fixed bottom-0 left-0 w-full h-[100px] bg-white border-t border-gray-200 py-4 px-4 z-10">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default SeatLayout;
