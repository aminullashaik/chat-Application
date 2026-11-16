import { Router } from "express";
import { createDirectConversation, getMyConversations, getConversationById } from "../controllers/conversation.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router()

router.post('/direct/:receiverId', authenticateToken, createDirectConversation);
router.get('/:conversationId', authenticateToken, getConversationById);
router.get('/', authenticateToken, getMyConversations);

export default router;