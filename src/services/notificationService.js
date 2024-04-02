import httpRequest from '../configs/http';

const notificationService = {
    getNotifications: async (userId) => {
        try {
            const response = await httpRequest.get(
                `/notification/getNotifications/${userId}`,
            );
            return response;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return null;
        }
    },
};

export default notificationService;
