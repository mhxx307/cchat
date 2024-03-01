import { useEffect, useState } from 'react';
import ChatRoom from '../components/ChatRoom';
import { useChat } from '../hooks/useChat';
import userService from '../services/userService';
import chatService from '../services/chatService';
import { useAuth } from '../hooks/useAuth';

import socket from '../configs/socket';

function ChatPage() {
    const { selectedRoom, isSidebarVisible } = useChat();

    const renderChatRoom = () => {
        return (
            <div
                className={`flex-1 p-4 md:p-8 ${isSidebarVisible ? 'w-full md:pl-[270px] lg:pl-[270px]' : 'w-full'}`}
            >
                {selectedRoom ? (
                    <>
                        {/* <h2 className="text-2xl font-semibold mb-4">Chatting in {selectedRoom}</h2> */}
                        {/* Add your chat component here */}
                        {/* Example: <ChatRoom room={selectedRoom} /> */}
                        <ChatRoom room={selectedRoom} />
                    </>
                ) : (
                    <div className="text-center text-gray-600">
                        Select a user or group from the sidebar to start
                        chatting.
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-1 flex-col md:flex-row">
            <Sidebar />
            {renderChatRoom()}
        </div>
    );
}

export default ChatPage;

const Sidebar = () => {
    const { userVerified } = useAuth();
    const {
        selectedRoom,
        setSidebarVisibility,
        isSidebarVisible,
        setSelectedRoom,
        currentChatList,
        setCurrentChatList,
    } = useChat();
    const [searchTermUser, setSearchTermUser] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        // listen for new chat
        socket.on('newChat', (data) => {
            // get all existing chats
            chatService
                .getAllExistingChats(userVerified._id)
                .then((chatList) => {
                    setCurrentChatList(chatList);
                });
        });

        return () => {
            // Clean up
            socket.off('newChat');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    useEffect(() => {
        // Fetch users when searchTermUser changes
        const fetchUsers = async () => {
            if (searchTermUser.trim() !== '') {
                try {
                    const result =
                        await userService.getUsersByNameAndPhoneNumber(
                            searchTermUser,
                        );
                    console.log('Fetched users:', result);
                    // Remove the current user from the search results
                    const filteredResult = result.filter(
                        (user) => user._id !== userVerified._id,
                    );
                    setSearchResults(filteredResult);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            } else {
                setSearchResults([]);
            }
        };

        fetchUsers();
    }, [searchTermUser, userVerified._id]);

    const handleUserSelect = async (user) => {
        // Handle selecting a user, for example, start a new chat with the selected user
        console.log('Selected user:', user);
        const chat = await chatService.start1v1Chat({
            senderId: userVerified._id,
            receiverId: user._id,
            message: 'Hello!',
        });

        console.log('Started 1v1 chat:', chat);

        // Fetch chat list
        setSelectedRoom(chat);

        // Clear the search term
        setSearchTermUser('');

        // fetch chat list
        const chatList = await chatService.getAllExistingChats(
            userVerified._id,
        );
        setCurrentChatList(chatList);
    };

    const handleRoomSelect = (room) => {
        setSelectedRoom(room);
    };

    const toggleSidebar = () => {
        setSidebarVisibility(!isSidebarVisible);
    };

    // setCurrentChatList

    return (
        <div
            className={`fixed flex h-full w-3/4 flex-col bg-gray-800 p-4 text-white transition-all duration-300 md:w-[270px] lg:w-[270px] ${
                isSidebarVisible ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            <button
                className="absolute -right-[20px] top-1/2 -translate-y-1/2 transform text-xl text-[#000] focus:outline-none"
                onClick={toggleSidebar}
            >
                {isSidebarVisible ? '←' : '→'}
            </button>

            <div className="mb-4">
                <input
                    type="text"
                    className="w-full rounded bg-gray-700 px-4 py-2 text-white"
                    placeholder="Search"
                    value={searchTermUser}
                    onChange={(e) => setSearchTermUser(e.target.value)}
                />
                <ul>
                    {searchResults.map((user, index) => (
                        <li
                            key={user._id}
                            onClick={() => handleUserSelect(user)}
                        >
                            {user.username}
                        </li>
                    ))}
                </ul>
            </div>

            <h2 className="mb-4 text-2xl font-semibold">Chat Rooms</h2>
            <ul>
                {currentChatList.length > 0 ? (
                    currentChatList.map((room) => (
                        <li
                            key={room._id}
                            className={`mb-2 cursor-pointer rounded px-4 py-2 ${
                                selectedRoom && selectedRoom._id === room._id
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'hover:bg-gray-700'
                            }`}
                            onClick={() => handleRoomSelect(room)}
                        >
                            {/* avatar & username */}
                            <div className="flex items-center">
                                {room.profilePic ? (
                                    <img
                                        src={
                                            userVerified._id === room.sender._id
                                                ? room.receiver.profilePic
                                                : room.sender.profilePic
                                        }
                                        alt={room.username}
                                        className="h-10 w-10 rounded-full"
                                    />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-500">
                                        <span className="text-2xl font-semibold text-white">
                                            {userVerified._id ===
                                            room.sender._id
                                                ? room.receiver.username
                                                      .charAt(0)
                                                      .toUpperCase()
                                                : room.sender.username
                                                      .charAt(0)
                                                      .toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <span className="ml-2">
                                    {userVerified._id === room.sender._id
                                        ? room.receiver.username
                                        : room.sender.username}
                                </span>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="text-center text-gray-600">
                        No chat rooms available
                    </li>
                )}
            </ul>
        </div>
    );
};
