import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
    registerUser,
    loginUser,
    getMe,
    updateProfile,
    changePassword
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.patch( "/profile",protect,updateProfile);
router.patch("/password",protect,changePassword);

export default router;