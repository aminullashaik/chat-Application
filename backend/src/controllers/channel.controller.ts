import { Request, Response } from "express";
import { createChannel, getChannels, viewChannelById, createChannelMember, leaveChannelService, getChannelMessagesService } from "../services/channel.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const createAndSaveChannel = async (
    req: AuthRequest,
    res: Response
) => {

    try {

        const { name, description } = req.body
        const createdBy = req.user?.id

        if (!createdBy) {
            return res.status(401).json({
                message: "unauthorised"
            })
        }

        if (!name) {
            return res.status(400).json({
                message: "Required fields are missing"
            })
        }

        const result = await createChannel(name, description, createdBy)

        return res.status(200).json({
            message: "Channel created successfully",
            data: result
        })

    } catch (err: any) {

        if (err.message === "Channel name already exists. Try with other name") {
            res.status(400).json({
                message: err.message
            })
        }

        return res.status(500).json({
            message: err.message
        })
    }
}

export const getAllChannels = async (
    req: Request,
    res: Response
) => {

    try {

        const result = await getChannels()

        return res.status(200).json({
            message: "All channels",
            data: result
        })

    } catch (err: any) {

        return res.status(500).json({
            message: err.message
        })

    }
}

export const getChannelById = async (
    req: Request,
    res: Response
) => {

    try {

        const channelId = Number(req.params.channelId);

        if (!channelId) {
            return res.status(400).json({
                message: "Required fields are missing."
            })
        }

        const result = await viewChannelById(channelId);

        return res.status(200).json({
            message: "Channel details",
            data: result
        })
        
    } catch (err: any) {
        
        if (err.message === "Channel doesnt exist") {
            return res.status(400).json({
                message: err.message
            })
        }

        return res.status(500).json({
            message: err.message
        })

    }
}

export const joinChannel = async (
    req: AuthRequest,
    res: Response
) => {

    try {

        const channelId = Number(req.params.channelId);
        const userId = req.user?.id

        if (!userId) {
            return res.status(400).json({
                message: "Unauthorized"
            })
        }

        if (!Number.isInteger(channelId)) {
            return res.status(400).json({
                message: "Invalid channelId"
            })
        }

        const result = await createChannelMember(channelId, userId);

        return res.status(200).json({
            message: "Member joined in channel successfully",
            data: result
        })

    } catch (err: any) {

        if (err.message === "Channel doesnt exist") {
            return res.status(401).json({
                message: err.message
            })
        }

        if (err.message === "User already joined this channel") {
            return res.status(400).json({
                message: err.message
            })
        }

        return res.status(500).json({
            message: err.message
        })
    }
}

export const leaveChannelController = async (
    req: AuthRequest,
    res: Response
) => {

    try {

        const channelId = Number(req.params.channelId);
        const userId = req.user?.id

        if (!Number.isInteger(channelId)) {
            return res.status(400).json({
                message: "Invalid channelId"
            })
        }

        if (!userId) {
            return res.status(400).json({
                message: "Unauthorized"
            })
        }

        const result = await leaveChannelService(channelId, userId);

        return res.status(200).json({
            message: "Member left successfully",
            data: result
        })

    } catch (err: any) {

        if (err.message === "User doesnt exist in this channel") {
            return res.status(401).json({
                message: err.message
            })
        }

        return res.status(500).json({
            message: err.message
        })
    }

}

export const getChannelMessagesController = async (
    req: AuthRequest,
    res: Response
) => {

    try {

        const channelId = Number(req.params.channelId);
        const userId = req.user?.id

        if (!Number.isInteger(channelId)) {
            return res.status(400).json({
                message: "Invalid channelId"
            })
        }

        if (!userId) {
            return res.status(400).json({
                message: "Unauthorised"
            })
        }

        const result = await getChannelMessagesService(channelId, userId);

        return res.status(200).json({
            message: "All messages",
            data: result
        })

    } catch (err: any) {

        if (err.message === "You are not a member of this channel") {
            return res.status(400).json({
                message: err.message
            })
        }

        return res.status(500).json({
            message: err.message
        })
    }
}