import { Route, Routes, useMatch } from "react-router-dom";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Profile from "./pages/Profile";
import SeatLayout from "./pages/SeatLayout";

function  App() {

   // Hide header/footer only on seat layout page
  const isSeatLayoutPage = useMatch(
    "/movies/:movieId/:movieName/:state/theater/:theaterId/show/:showId/seat-layout"
  );

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {!isSeatLayoutPage && <Header />}
        <main className="flex-grow">
          <Routes>
            {/* Define your routes here */}
            <Route path="/" element={<Home />} />
            <Route path="/profile/:id" element={<h1>Profile Page</h1>} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:state/:movieName/:id/ticket" element={<MovieDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/movies/:movieId/:movieName/:state/theater/:theaterId/show/:showId/seat-layout" element={<SeatLayout />} />
            {/* Add more routes as needed */}
          </Routes>
        </main>
        {!isSeatLayoutPage && <Footer />}
      </div>
    </>
  );
}

export default App;
