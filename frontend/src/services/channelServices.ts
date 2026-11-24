import api from"@/api/axiosInstance";
import type { Channel, ChannelMessage, CreateChannelPayload } from "@/types/channelTypes";

export const getChannels = async(): Promise<Channel[]> => {
    const response = await api.get("channels");
    return response.data?.data || [];
};

export const createChannel = async(payload: CreateChannelPayload):Promise<Channel> => {
    const response =await api.post("/channels", {
        name: payload.name,
        description: payload.description,
    });
    return response.data?.data;
};

//deatiles of channel
export const getChannelDetails = async(channelId: number): Promise<Channel> => {
    const response = await api.get(`/channels/${channelId}`);
    return response.data?.data;
};

//fecth msgs of that channel
export const getChannelMessages = async (channelId: number): Promise<ChannelMessage[]> => {
  const response = await api.get(`/channels/${channelId}/messages`);
  return response.data?.data || [];
};

//join
export const joinChannelApi = async (channelId: number): Promise<any> => {
  const response = await api.post(`/channels/${channelId}/join`);
  return response.data?.data;
};
