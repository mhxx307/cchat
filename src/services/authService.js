import httpRequest from "../configs/http";

const authService = {
    login: async (email, password) => {
        const result = await httpRequest.post("/auth/login", {
            email,
            password,
        });

        return result;
    },
    register: async (username, email, password) => {
        const result = await httpRequest.post("/auth/register", {
            username,
            email,
            password,
        });

        return result;
    },
    forgotPassword: async (email) => {
        const result = await httpRequest.post("/auth/forgotPassword", {
            email,
        });

        return result;
    },
    resetPassword: async (password, token, email) => {
        const result = await httpRequest.post("/auth/resetPassword", {
            newPassword: password,
            otp: token,
            email,
        });

        return result;
    },
};

export default authService;
