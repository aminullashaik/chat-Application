import { AppDataSource } from "../dataSource";
import { Channel } from "../entities/Channel";
import { ChannelMembers } from "../entities/ChannelMembers";
import { ChannelMessage } from "../entities/ChannelMessage";

export const channelRepository = AppDataSource.getRepository(Channel)
export const channelMembersRepository = AppDataSource.getRepository(ChannelMembers);
export const channelMessagerepository = AppDataSource.getRepository(ChannelMessage);

export const getNameOfChannel = async (name: string) => {
    return await channelRepository.findOne({
        where: { name }
    })
}

export const getChannel = async (channelId: number) => {
    return await channelRepository.findOne({
        where: { id: channelId }
    })
}

export const getChannelMember = async (channelId: number, userId: number) => {
    return await channelMembersRepository.findOne({
        where: {
            channel: { id: channelId },
            user: { id: userId }
        }
    })
}

export const createAndSaveChannel = async (name: string, description: string, createdBy: number) => {

    const channel = channelRepository.create({ name, description, createdBy })
    return await channelRepository.save(channel)

}

export const getAllChannels = async () => {
    return await channelRepository.find({
        relations: ["user"],
        select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            user: {
                id: true,
                name: true,
                email: true,
                role: true
            },
        },
        order: {
            createdAt: "ASC",
        },
    });
};

export const getChannelById = async (channelId: number) => {

    return await channelRepository.findOne({
        where: { id: channelId },
        relations: ['user'],
        select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            user: {
                id: true,
                name: true,
                role: true
            }
        },
        order: {
            createdAt: "ASC"
        }
    })

}

export const joinChannel = async (channelId: number, userId: number) => {

    const member = channelMembersRepository.create({
        channel: { id: channelId },
        user: { id: userId }
    })

    return await channelMembersRepository.save(member);
}

export const leaveChannelRepository = async (channelId: number, userId: number) => {

    const member = await channelMembersRepository.findOneBy({
        channel: { id: channelId },
        user: { id: userId },
    });

    if (!member) {
        return false;
    }

    await channelMembersRepository.remove(member);

    return true;
};

export const getChannelMessagesRepository = async (channelId: number, userId: number) => {

    const messages = await channelMessagerepository.find({
        where: {
            channel: {id: channelId}
        },
        relations: ['user'],
        order: {
            createdAt: "ASC"
        }
    })

    return messages;
}