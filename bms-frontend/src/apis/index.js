import { axiosWrapper } from "./axiosWrapper";


// List all the endpoints;
export const getRecommendedMovies = () => axiosWrapper.get("/movies/recommended");
export const getAllMovies = () => axiosWrapper.get("/movies");
export const getMovieById = (data) => axiosWrapper.get(`/movies/${data}`)
export const getShowsByMovieAndLocation = (movieId, state, date) => 
    axiosWrapper.get("/shows", {
        params : {
            movieId, state, date
        }
    });
export const getShowById = (data) => axiosWrapper.get(`/shows/${data}`);

// Authentication APIS
export const sendOTP = (data) => axiosWrapper.post("/auth/send-otp", data);
export const verifyOTP = (data) => axiosWrapper.post("/auth/verify-otp", data);
export const activate = ({id, ...data}) => axiosWrapper.post(`/users/activate/${id}`, data);
export const logout = () => axiosWrapper.post("/auth/logout");
export const getUser = () => axiosWrapper.get("/users/me");