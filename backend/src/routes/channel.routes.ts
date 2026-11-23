import { Router } from "express";
import { createAndSaveChannel, getAllChannels, getChannelById, joinChannel, leaveChannelController, getChannelMessagesController } from "../controllers/channel.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router()

router.post('/channels', authenticateToken, createAndSaveChannel);
router.post('/channels/:channelId/join', authenticateToken, joinChannel);
router.delete('/channels/:channelId/leave', authenticateToken, leaveChannelController);
router.get('/channels/:channelId/messages', authenticateToken, getChannelMessagesController);
router.get('/channels', getAllChannels);
router.get('/channels/:channelId', getChannelById);

export default router