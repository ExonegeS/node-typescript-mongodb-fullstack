import "dotenv/config";
import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/db";
import errorHandler from "./middleware/errorHandler";
import authenticate from "./middleware/authenticate";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import pagesRoutes from "./routes/pages.route";
import sessionRoutes from "./routes/session.route";
import { APP_ORIGIN, BACK_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import { OK } from "./constants/http";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));

// add middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'https://node-typescript-mongodb-fullstack.onrender.com',
    credentials: true,
  })
);
console.log( `ORIGIN: ${BACK_ORIGIN}:${PORT}`)
app.use(cookieParser());

// health check
app.get("/api/v1/health", (req, res, next) => {
    res.status(OK).json({
        "status": "healthy"
});
});

app.use("/", pagesRoutes);

// auth routes
app.use("/api/v1/auth", authRoutes);

// // protected routes
app.use("/api/v1/user", authenticate, userRoutes);
app.use("/api/v1/sessions", authenticate, sessionRoutes);

// error handler
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server listening on ${BACK_ORIGIN}:${PORT} in ${NODE_ENV} environment`);
  await connectToDatabase();
});
