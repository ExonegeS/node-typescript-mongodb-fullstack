import { Router } from "express";
import axios from "axios";
import { BACK_ORIGIN, PORT } from "../constants/env";

const pagesRouter = Router();

// Render homepage
pagesRouter.get("/", (req, res) => {
  res.render("index", { title: "Home Page" });
});

// Render login page
pagesRouter.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

// Render register page
pagesRouter.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
});
  
// Render the dashboard page
pagesRouter.get("/dashboard", async (req, res) => {
    try {
        const response = await axios.get(`${BACK_ORIGIN}:${PORT}/api/v1/user`, {
            headers: {
              'Cookie': `accessToken=${req.cookies.accessToken}`
            },
          })

        res.render("dashboard", {
            title: "Dashboard",
            user: response.data,
        });
    } catch (error) {
        res.status(500).render("login", {
            title: "Login",
            error: "Error retrieving user data.",
        });
    }
});

// Render the sessions page
pagesRouter.get("/sessions", async (req, res) => {
    try {
        // Fetch the user's sessions from the backend
        const response = await axios.get(`${BACK_ORIGIN}:${PORT}/api/v1/sessions`, {
            headers: {
              'Cookie': `accessToken=${req.cookies.accessToken}`
            },
        });

        // Pass the sessions data to the sessions view
        res.render("sessions", {
            title: "Sessions",
            sessions: response.data,
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving sessions." });
    }
});

// Render the user update page
pagesRouter.get("/update", async (req, res) => {
    try {
        const response = await axios.get(`${BACK_ORIGIN}:${PORT}/api/v1/user`, {
            headers: {
                'Cookie': `accessToken=${req.cookies.accessToken}`
            },
        });
        res.render("update", { title: "Update Profile", user: response.data });
    } catch (error) {
        res.status(500).render("dashboard", { title: "Dashboard", error: "Error retrieving user data." });
    }
});

export default pagesRouter;
