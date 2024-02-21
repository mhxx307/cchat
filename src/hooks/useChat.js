import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const useChat = () => {
    return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isSidebarVisible, setSidebarVisibility] = useState(true);

    const [currentChatList, setCurrentChatList] = useState([
        { id: 1, phoneNumber: "+123456789", username: "User 1", email: "user1@example.com" },
        { id: 2, phoneNumber: "+987654321", username: "User 2", email: "user2@example.com" },
        { id: 3, phoneNumber: "+112233445", username: "Group 1", email: "group1@example.com" },
        { id: 4, phoneNumber: "+554433221", username: "Group 2", email: "group2@example.com" },
    ]);

    return (
        <ChatContext.Provider
            value={{
                selectedRoom,
                setSelectedRoom,
                isSidebarVisible,
                setSidebarVisibility,
                currentChatList,
                setCurrentChatList,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
