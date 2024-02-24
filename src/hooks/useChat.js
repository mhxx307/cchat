import { createContext, useContext, useEffect, useState } from "react";
import chatService from "../services/chatService";
import { useAuth } from "./useAuth";

const ChatContext = createContext();

export const useChat = () => {
    return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isSidebarVisible, setSidebarVisibility] = useState(true);
    const { userVerified } = useAuth();
    console.log("userVerified:", userVerified);

    const [currentChatList, setCurrentChatList] = useState([]);

    useEffect(() => {
        // Fetch chat list
        const fetchChatList = async () => {
            // Fetch chat list from the server
            const chatList = await chatService.getAllExistingChats(userVerified._id);
            console.log("Fetched chat list:", chatList);
            setCurrentChatList(chatList);
        };

        if (userVerified) {
            fetchChatList();
        }
    }, [userVerified]);

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
