import httpRequest from "../configs/http";

const chatService = {
    createGroup: async (data) => {
        const result = await httpRequest.post("/chat/createGroup", data);
        return result;
    },
    start1v1Chat: async (data) => {
        const result = await httpRequest.post("/chat/start1v1Chat", data);
        return result;
    },
};

export default chatService;
