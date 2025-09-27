import express from 'express';
import movieRouter from "../modules/movie/movie.route";
const router = express.Router();

router.use("/movies", movieRouter);

export default router;