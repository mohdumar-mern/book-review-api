import express from "express";

import { loginUser, registerUser, updateUser,  } from "../controllers/userController.js";
import { protect } from "../middleware/jwtMiddleware.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put('/user/:id',protect, updateUser)

export default router;
