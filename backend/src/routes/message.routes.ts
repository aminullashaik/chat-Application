import { Router } from "express";
import { getMessages, editMessage, deleteMessage } from "../controllers/message.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.get('/:conversationId/messages', authenticateToken, getMessages);
router.put('/messages/:messageId', authenticateToken, editMessage);
router.delete('/messages/:messageId', authenticateToken, deleteMessage);

export default router;