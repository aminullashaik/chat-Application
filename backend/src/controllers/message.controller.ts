import { Request, Response } from "express";
import { createMessage, getConversationMessages, editMessageService, removeMessage } from "../services/message.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const sendMessage = async (
    req: AuthRequest,
    res: Response
) => {
    try {

        const userId = req.user.id;
        const conversationId = Number(req.params.conversationId);
        const {content} = req.body;

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

        if (!content) {
            return res.status(400).json({
                message: "Missing required field"
            })
        }

        const response = await createMessage(conversationId, userId, content);

        return res.status(200).json({
            message: "Message created",
            data: response
        })

    } catch (err: any) {
        return res.status(500).json({
            message: err.message
        })
    }
}

export const getMessages = async (
    req: AuthRequest,
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

        const result = await getConversationMessages(conversationId, userId);

        return res.status(200).json({
            message: "Conversation Messages",
            count: result?.length,
            data: result
        })

    } catch (err : any) {
        res.status(500).json({
            message: err.message
        })
    }
}

export const editMessage = async (
    req: AuthRequest,
    res: Response
) => {
    try {

        const messageId = Number(req.params.messageId);
        const userId = req.user?.id;
        const {content} = req.body;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        if (Number.isNaN(messageId)) {
            return res.status(400).json({
                message: "Invalid messageId"
            })
        }

        if (!content) {
            return res.status(400).json({
                message: "Required field missing"
            })
        }

        const result = await editMessageService(messageId, userId, content);

        return res.status(200).json({
            message: "Message edited",
            data: result
        })

    } catch (err: any) {
        return res.status(500).json({
            message: err.message
        })
    }
}

export const deleteMessage = async (
    req: AuthRequest,
    res: Response
) => {
    try {

        const messageId = Number(req.params.messageId);
        const userId = req.user?.id

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        if (Number.isNaN(messageId)) {
            return res.status(400).json({
                message: "Invalid messageId"
            })
        }

        const result = await removeMessage(messageId, userId);

        return res.status(200).json({
            message: "Message removed from the conversation",
            data: result
        })


    } catch (err: any) {
        return res.status(500).json({
            message: err.message
        })
    }
}