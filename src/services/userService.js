import httpRequest from "../configs/http";

const userService = {
    getAllUsers: async () => {
        const result = await httpRequest.get("/users");
        return result;
    },
    getUserById: async (id) => {
        const result = await httpRequest.get(`/users/${id}`);
        return result;
    },
    updateUserById: async (id, data) => {
        const result = await httpRequest.put(`/users/${id}`, data);
        return result;
    },
    getUsersByNameAndPhoneNumber: async (searchTerm) => {
        const result = await httpRequest.get(`/users/search/s?searchTerm=${searchTerm}`);
        return result;
    },
};

export default userService;
