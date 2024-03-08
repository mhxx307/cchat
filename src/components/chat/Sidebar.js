import 'react-responsive-modal/styles.css';
import { useEffect, useState } from 'react';
import { MdOutlineGroupAdd } from 'react-icons/md';
import Modal from 'react-responsive-modal';
import AddGroupModal from './AddGroupModal';
import { useAuth } from '~/hooks/useAuth';
import { useChat } from '~/hooks/useChat';
import useDebounce from '~/hooks/useDebounce';
import socket from '~/configs/socket';
import FallbackAvatar from '../shared/FallbackAvatar';
import chatService from '~/services/chatService';
import userService from '~/services/userService';

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
    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const searchTermUserDebounce = useDebounce(searchTermUser, 500);

    // console.log('Current Chat List:', currentChatList);

    useEffect(() => {
        // listen for new chat
        socket.on('newChat', (data) => {
            console.log('New Chat:', data);
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
        socket.on('newChatGroup', (data) => {
            // console.log('New Group Chat:', data);
            // get all existing chats
            chatService
                .getAllExistingChats(userVerified._id)
                .then((chatList) => {
                    setCurrentChatList(chatList);
                });
        });

        return () => {
            // Clean up
            socket.off('newChatGroup');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    useEffect(() => {
        // Fetch users when searchTermUser changes
        const fetchUsers = async () => {
            if (searchTermUserDebounce.trim() !== '') {
                try {
                    const result = await userService.getUsersBySearchTerms(
                        searchTermUserDebounce,
                    );
                    // console.log('Fetched users:', result);
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
    }, [searchTermUserDebounce, userVerified._id]);

    const handleUserSelect = async (user) => {
        // Handle selecting a user, for example, start a new chat with the selected user
        // console.log('Selected user:', user);
        // check if a chat already exists
        const currentChatListWithoutGroups = currentChatList.filter(
            (chat) => !chat.group,
        );
        const existingChat = currentChatListWithoutGroups.find(
            (chat) =>
                chat.sender._id === user._id || chat.receiver._id === user._id,
        );

        if (existingChat) {
            // console.log('Chat already exists:', existingChat);
            setSelectedRoom(existingChat);
            return;
        } else {
            const chat = await chatService.start1v1Chat({
                senderId: userVerified._id,
                receiverId: user._id,
                message: 'Hello!',
            });
            // console.log('Started 1v1 chat:', chat);
            // Emit a message event to the server
            socket.emit('message', {
                sender: userVerified,
                receiver: chat.receiver,
                message: 'Hello!',
                timestamp: new Date().toISOString(),
            });

            // Fetch chat list
            setSelectedRoom(chat);
        }

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

    const handleOpenAddGroupModal = () => {
        // Open the modal to add a new group
        onOpenModal();
    };

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTermUser(term);
    };

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
                <div className="mb-4 flex items-center justify-between">
                    <input
                        type="text"
                        className="focus:shadow-outline mr-2 w-full rounded bg-gray-700 px-4 py-2 text-white focus:outline-none"
                        placeholder="Search"
                        value={searchTermUser}
                        onChange={handleSearchChange}
                    />
                    <MdOutlineGroupAdd
                        className="cursor-pointer text-2xl hover:opacity-80"
                        onClick={handleOpenAddGroupModal}
                    />
                    <Modal open={open} onClose={onCloseModal} center>
                        <AddGroupModal
                            searchResults={searchResults}
                            onCloseModal={onCloseModal}
                            userVerified={userVerified}
                        />
                    </Modal>
                </div>
                <ul className="">
                    {searchResults.map((user, index) => (
                        <li
                            key={user._id}
                            onClick={() => handleUserSelect(user)}
                            className="flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-700"
                        >
                            {user.username}
                        </li>
                    ))}
                </ul>
            </div>

            <h2 className="mb-4 text-2xl font-semibold">Chat Rooms</h2>
            <ul className="h-[60%] overflow-y-auto">
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
                            {room.group ? (
                                <div className="flex items-center">
                                    {room.group.profilePic ? (
                                        <img
                                            src={room.group.profilePic}
                                            alt={room.group.name}
                                            className="h-10 w-10 rounded-full"
                                        />
                                    ) : (
                                        <FallbackAvatar
                                            name={room.group.name}
                                        />
                                    )}
                                    <span className="ml-2">
                                        {room.group.name}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    {room.profilePic ? (
                                        <img
                                            src={
                                                userVerified._id ===
                                                room.sender._id
                                                    ? room.receiver
                                                        ? room.receiver
                                                              .profilePic
                                                        : room.group.profilePic
                                                    : room.sender.profilePic
                                            }
                                            alt={room.username}
                                            className="h-10 w-10 rounded-full"
                                        />
                                    ) : (
                                        // if not have recever will show group name
                                        <FallbackAvatar
                                            name={
                                                userVerified._id ===
                                                room.sender._id
                                                    ? room.receiver
                                                        ? room.receiver.username
                                                        : room.group.name
                                                    : room.sender.username
                                            }
                                        />
                                    )}
                                    <span className="ml-2">
                                        {userVerified._id === room.sender._id
                                            ? room.receiver
                                                ? room.receiver.username.substring(
                                                      0,
                                                      10,
                                                  )
                                                : room.group.name.substring(
                                                      0,
                                                      10,
                                                  )
                                            : room.sender.username.substring(
                                                  0,
                                                  10,
                                              )}
                                        ...
                                    </span>
                                </div>
                            )}
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

export default Sidebar;
