import { useEffect, useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import socket from '~/configs/socket';
import { useChat } from '~/hooks/useChat';
import useDebounce from '~/hooks/useDebounce';
import chatService from '~/services/chatService';
import userService from '~/services/userService';
import FallbackAvatar from '../shared/FallbackAvatar';
import { toast } from 'react-toastify';

const AddGroupModal = ({ onCloseModal, userVerified }) => {
    // State variables
    const [groupName, setGroupName] = useState('');
    const [groupImage, setGroupImage] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [userSearchResults, setUserSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { setCurrentChatList } = useChat();
    const searchTermDebounce = useDebounce(searchTerm, 500);

    // Function to fetch users based on search term
    useEffect(() => {
        const fetchUsers = async () => {
            if (searchTermDebounce.trim() !== '') {
                try {
                    const result =
                        await userService.getUsersBySearchTerms(
                            searchTermDebounce,
                        );
                    // Remove the current user from the search results
                    const filteredResult = result.filter(
                        (user) => user._id !== userVerified._id,
                    );
                    setUserSearchResults(filteredResult);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            } else {
                setUserSearchResults([]);
            }
        };
        fetchUsers();
    }, [searchTermDebounce, userVerified._id]);

    // Function to handle changes in group name
    const handleGroupNameChange = (e) => {
        setGroupName(e.target.value);
    };

    // Function to handle changes in group image
    const handleGroupImageChange = (e) => {
        const imageFile = e.target.files[0];
        setGroupImage(imageFile);
    };

    // Function to toggle user selection
    const toggleUserSelection = (user) => {
        const isSelected = selectedUsers.some((u) => u._id === user._id);
        if (isSelected) {
            setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    // Function to remove selected user
    const removeSelectedUser = (userId) => {
        setSelectedUsers(selectedUsers.filter((user) => user._id !== userId));
    };

    // Function to handle create group
    const handleCreateGroup = async () => {
        try {
            // members = array of userIds of selected users + current user
            const selectedUserIdList = selectedUsers.map((user) => user._id);
            const members = [userVerified._id, ...selectedUserIdList];

            const result = await chatService.createGroup({
                name: groupName,
                members: members,
                senderId: userVerified._id,
            });

            console.log('Created Group:', result);
            console.log('Group Image:', groupImage);

            // update current chat list
            setCurrentChatList((prevList) => [...prevList, result]);

            // real-time update
            socket.emit('messageChatGroup', result);
        } catch (error) {
            console.error('Error creating group:', error);
            toast.error('Error creating group');
        } finally {
            // Clear the form
            setGroupName('');
            setGroupImage(null);
            setSelectedUsers([]);
            setUserSearchResults([]);
            setSearchTerm('');
            // fetch chat list
            const chatList = await chatService.getAllExistingChats(
                userVerified._id,
            );
            setCurrentChatList(chatList);
            toast.success('Group created successfully');
            onCloseModal(); // Close the modal after group creation
        }
    };

    // Function to handle search input with debounce
    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
    };

    return (
        <div className="flex h-full items-center justify-center">
            <div className="w-96 rounded bg-white p-6">
                <h2 className="mb-4 text-2xl font-semibold">
                    Create New Group
                </h2>

                <div className="mb-4 flex items-center">
                    <label
                        htmlFor="group-image"
                        className="mr-4 flex cursor-pointer items-center justify-center rounded-full bg-gray-300 p-4 hover:bg-gray-400"
                    >
                        <FaCamera className="text-xl" />
                        <input
                            type="file"
                            id="group-image"
                            className="hidden"
                            onChange={handleGroupImageChange}
                        />
                    </label>
                    <input
                        type="text"
                        className="flex-1 rounded border border-gray-300 px-4 py-2 focus:outline-none"
                        placeholder="Group Name"
                        value={groupName}
                        onChange={handleGroupNameChange}
                    />
                </div>

                {/* Search users */}
                <input
                    type="text"
                    className="mb-4 w-full rounded border border-gray-300 px-4 py-2 focus:outline-none"
                    placeholder="Search Users"
                    onChange={handleSearchChange}
                />

                {/* User search results */}
                <div className="mb-4 max-h-40 overflow-y-auto">
                    {userSearchResults.map((user) => (
                        <div
                            key={user._id}
                            className={`flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-100 ${selectedUsers.some((u) => u._id === user._id) && 'bg-blue-100'}`}
                            onClick={() => toggleUserSelection(user)}
                        >
                            <div className="flex items-center">
                                {user.profilePic ? (
                                    <img
                                        src={user.profilePic}
                                        alt={user.username}
                                        className="h-10 w-10 rounded-full"
                                    />
                                ) : (
                                    <FallbackAvatar name={user.username} />
                                )}

                                <span className="ml-2">{user.username}</span>
                            </div>
                            <span>
                                {selectedUsers.some(
                                    (u) => u._id === user._id,
                                ) && 'Selected'}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Selected users */}
                <div className="mb-4">
                    {selectedUsers.map((user) => (
                        <div
                            key={user._id}
                            className="mb-2 flex items-center justify-between rounded-md bg-blue-100 px-4 py-2"
                        >
                            <div className="flex items-center">
                                {user.profilePic ? (
                                    <img
                                        src={user.profilePic}
                                        alt={user.username}
                                        className="h-8 w-8 rounded-full"
                                    />
                                ) : (
                                    <FallbackAvatar name={user.username} />
                                )}

                                <span className="ml-2">{user.username}</span>
                            </div>
                            <button
                                className="text-red-500"
                                onClick={() => removeSelectedUser(user._id)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                {/* Create group button */}
                <button
                    className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    onClick={handleCreateGroup}
                >
                    Create Group
                </button>
            </div>
        </div>
    );
};

export default AddGroupModal;
