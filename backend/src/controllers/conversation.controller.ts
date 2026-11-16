import { Request, Response } from "express";
import { createOrGetConversation, getAllMyConversations, getConversationsById } from "../services/conversation.service";

export const createDirectConversation = async (
    req: Request,
    res: Response
) => {
    try {

        const loggedInUserId = req.user?.id;
        const receiverId = Number(req.params.receiverId);

        if (!loggedInUserId) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        if (Number.isNaN(receiverId)) {
            return res.status(400).json({
                message: "Invalid receiverId"
            })
        }

        const result = await createOrGetConversation(loggedInUserId, receiverId);

        return res.status(200).json({
            message: "Conversation created",
            data: result
        })

    } catch (err: any) {

        if (err.message === "Receiver user not found") {
            return res.status(404).json({
                message: err.message
            })
        }

        if (err.message === "You can't create conversation with yourself") {
            return res.status(400).json({
                message: err.message
            })
        }

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const getMyConversations = async (
    req: Request,
    res: Response
) => {
    try {

        const userId = req.user?.id

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const result = await getAllMyConversations(userId);

        return res.status(200).json({
            message: "My Conversations",
            data: result
        })

    } catch (err: any) {
        return res.status(500).json({
            message: err.message
        })
    }
}

export const getConversationById = async (
    req: Request,
    res: Response
) => {
    try {

        const userId = req.user?.id;
        const conversationId = Number(req.params.conversationId);

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        if (Number.isNaN(conversationId)) {
            return res.status(400).json({
                message: "Invalid conversationId"
            })
        }

        const result = await getConversationsById(conversationId, userId);

        return res.status(200).json({
            message: "Conversation Details",
            data: result
        })

    } catch (err: any) {
        return res.status(500).json({
            message: err.message
        })
    }
}