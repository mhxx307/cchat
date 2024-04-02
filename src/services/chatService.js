import httpRequest from '../configs/http';

// members: array of userIds

const chatService = {
    createChatRoom: async ({ members, type, name, image }) => {
        const response = await httpRequest.post('/chat/createChatRoom', {
            members,
            type,
            name,
            image,
        });

        console.log(response);

        return response;
    },
    getChatroomById: async (chatroomId) => {
        const response = await httpRequest.get(
            `/chat/getChatroomById/${chatroomId}`,
        );

        return response;
    },
    getAllMessagesInRoom: async (roomId) => {
        const response = await httpRequest.get(
            `/chat/getAllMessagesInRoom/${roomId}`,
        );

        return response;
    },
    getAllRoomByUserId: async (userId) => {
        const response = await httpRequest.get(
            `/chat/getAllRoomByUserId/${userId}`,
        );

        return response;
    },
    sendMessage: async ({ senderId, receiverId, content, images, roomId }) => {
        const response = await httpRequest.post('/chat/sendMessage', {
            senderId,
            receiverId,
            content,
            images,
            roomId,
        });

        return response;
    },
    sendMessageToGroup: async ({ senderId, roomId, content, images }) => {
        const response = await httpRequest.post('/chat/sendMessageToGroup', {
            senderId,
            roomId,
            content,
            images,
        });

        return response;
    },
    inviteToGroupChat: async (userId, chatroomId) => {
        const response = await httpRequest.post('/chat/inviteToGroupChat', {
            userId,
            chatroomId,
        });

        return response;
    },
};

export default chatService;
