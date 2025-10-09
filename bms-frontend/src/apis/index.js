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
export const getShowById = (date) => axiosWrapper.get(`/shows/${data}`);