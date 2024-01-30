import httpRequest from "../configs/http";

const authService = {
    login: async (email, password) => {
        const result = await httpRequest.post("/auth/login", {
            email,
            password,
        });

        return result;
    },
};

export default authService;
