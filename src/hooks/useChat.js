import { createContext, useContext, useEffect, useState } from 'react';
import chatService from '../services/chatService';
import { useAuth } from './useAuth';

const ChatContext = createContext();

export const useChat = () => {
    return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isSidebarVisible, setSidebarVisibility] = useState(true);
    const { userVerified } = useAuth();
    const [currentChatList, setCurrentChatList] = useState([]);

    useEffect(() => {
        // Fetch chat list
        const fetchChatList = async () => {
            // Fetch chat list from the server
            const chatList = await chatService.getAllExistingChats(
                userVerified._id,
            );

            // remove duplicates group chat from the list, if chatList have group and same group._id
            const filteredChat = chatList.filter((chat, index, self) => {
                if (chat.group) {
                    return (
                        index ===
                        self.findIndex(
                            (t) => t.group && t.group._id === chat.group._id,
                        )
                    );
                }

                return true;
            });

            console.log('Filtered chat:', filteredChat);

            setCurrentChatList(filteredChat);
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
