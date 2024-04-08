import httpRequest from '../configs/http';

// members: array of userIds

const chatService = {
    createChatRoom: async ({ members, type, name, image, adminId }) => {
        const response = await httpRequest.post('/chat/createChatRoom', {
            members,
            type,
            name,
            image,
            admin: adminId,
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
    sendMessage: async ({
        senderId,
        receiverId,
        content,
        images,
        roomId,
        replyMessageId,
    }) => {
        const response = await httpRequest.post('/chat/sendMessage', {
            senderId,
            receiverId,
            content,
            images,
            roomId,
            replyTo: replyMessageId,
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
    deleteMessage: async (messageId) => {
        const response = await httpRequest.delete(
            `/chat/deleteMessage/${messageId}`,
        );

        return response;
    },
};

export default chatService;
