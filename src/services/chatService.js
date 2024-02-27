import httpRequest from "../configs/http";

// members: array of userIds

const chatService = {
    createGroup: async ({ name, members }) => {
        const result = await httpRequest.post("/chat/createGroup", {
            name,
            members,
        });
        return result;
    },
    start1v1Chat: async ({ senderId, receiverId, message }) => {
        const result = await httpRequest.post("/chat/start1v1Chat", {
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
        const result = await httpRequest.get(`/chat/getChatMessages?senderId=${senderId}&receiverId=${receiverId}`);
        return result;
    },
    getAllExistingChats: async (userId) => {
        const result = await httpRequest.get(`/chat/getAllExistingChats/${userId}`);
        return result;
    },
};

export default chatService;
