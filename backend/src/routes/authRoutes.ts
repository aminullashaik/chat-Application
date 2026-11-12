import { Router } from "express";

import { login } from "../controllers/authController";
// import { verifyToken } from "../middlewares/authMiddleware";

const router = Router()

router.post('/login', login)
// router.put('/auth/change-password', verifyToken, changePassword);

export default router