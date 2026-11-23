import { 
    getNameOfChannel,
    createAndSaveChannel,
    getAllChannels,
    getChannel,
    getChannelById,
    getChannelMember,
    joinChannel,
    leaveChannelRepository,
    getChannelMessagesRepository
} from "../repository/channel.repository";

export const createChannel = async (name: string, description: string, createdBy: number) => {

    const isNameExists = await getNameOfChannel(name);

    if (isNameExists) {
        throw new Error("Channel name already exists. Try with other name")
    }

    return await createAndSaveChannel(name, description, createdBy);
}

export const getChannels = async () => {
    return await getAllChannels()
}

export const viewChannelById = async (channelId: number) => {
    
    const channel = await getChannel(channelId)

    if (!channel) {
        throw new Error("Channel doesnt exist")
    }

    return await getChannelById(channelId);
}

export const createChannelMember = async (channelId: number, userId: number) => {

    const channel = await getChannel(channelId);

    if (!channel) {
        throw new Error("Channel doesnt exist")
    }

    const exsistingMember = await getChannelMember(channelId, userId);

    if (exsistingMember) {
        throw new Error("User already joined this channel")
    }

    return await joinChannel(channelId, userId);

}

export const leaveChannelService = async (channelId: number, userId: number) => {

    const exsistingMember = await getChannelMember(channelId, userId);

    if (!exsistingMember) {
        throw new Error("User doesnt exist in this channel")
    }

    return await leaveChannelRepository(channelId, userId);

}

export const getChannelMessagesService = async (channelId: number, userId: number) => {

    const exsistingMember = await getChannelMember(channelId, userId);

    if (!exsistingMember) {
        throw new Error("You are not a member of this channel")
    }

    return await getChannelMessagesRepository(channelId, userId);
}