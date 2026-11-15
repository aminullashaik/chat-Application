import { Router } from "express";

import { login, changePassword } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router()

router.post('/login', login)
router.put('/auth/change-password',authenticateToken , changePassword);

export default router