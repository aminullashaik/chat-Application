import { Router } from "express";
import { sendMessage, getMessages, editMessage, deleteMessage } from "../controllers/message.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.post('/:conversationId/messages', authenticateToken, sendMessage);
router.get('/:conversationId/messages', authenticateToken, getMessages);
router.put('/messages/:messageId', authenticateToken, editMessage);
router.delete('/messages/:messageId', authenticateToken, deleteMessage);

export default router;