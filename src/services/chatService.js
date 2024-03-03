import httpRequest from '../configs/http';

// members: array of userIds

const chatService = {
    createGroup: async ({ name, members }) => {
        const result = await httpRequest.post('/chat/createGroup', {
            name,
            members,
        });
        // result = { group: { _id, name, members }, chat: { _id, group, message } }
        return result;
    },
    start1v1Chat: async ({ senderId, receiverId, message }) => {
        const result = await httpRequest.post('/chat/start1v1Chat', {
            senderId,
            receiverId,
            message,
        });
        return result;
    },
    getAllChatRooms: async (userId) => {
        const result = await httpRequest.get(`/chat/getAllChatRooms/${userId}`);
        return result;
    },
    getChatMessages: async ({ senderId, receiverId }) => {
        const result = await httpRequest.get(
            `/chat/getChatMessages?senderId=${senderId}&receiverId=${receiverId}`,
        );
        return result;
    },
    getAllExistingChats: async (userId) => {
        const result = await httpRequest.get(
            `/chat/getAllExistingChats/${userId}`,
        );
        return result;
    },
    updateGroup: async ({ groupId, name, members }) => {
        const result = await httpRequest.put(`/chat/updateGroup/${groupId}`, {
            name,
            members,
        });
        return result;
    },
    deleteGroup: async (groupId) => {
        const result = await httpRequest.delete(`/chat/deleteGroup/${groupId}`);
        return result;
    },
    startGroupChat: async ({ groupId, message, senderId }) => {
        const result = await httpRequest.post('/chat/startGroupChat', {
            groupId,
            message,
            senderId,
        });
        return result;
    },
    getGroupChatMessages: async ({ groupId }) => {
        const result = await httpRequest.get(
            `/chat/getGroupChatMessages/${groupId}`,
        );
        return result;
    },
};

export default chatService;
