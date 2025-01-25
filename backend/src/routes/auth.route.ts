import { Router } from "express";
import { registerHandler, loginHandler, refreshHandler, logoutHandler, verifyEmailHandler } from "../controllers/auth.controller";


const authRoutes = Router();

// prefix: /auth
authRoutes.post("/register", registerHandler)
authRoutes.post("/login", loginHandler)
authRoutes.get("/logout", logoutHandler)
authRoutes.get("/refresh", refreshHandler)
authRoutes.get("/email/verify/:code", verifyEmailHandler)

export default authRoutes