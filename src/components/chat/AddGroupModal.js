import { useEffect, useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import socket from '~/configs/socket';
import { useChat } from '~/hooks/useChat';
import useDebounce from '~/hooks/useDebounce';
import chatService from '~/services/chatService';
import userService from '~/services/userService';
import { toast } from 'react-toastify';
import FriendListForInvite from './FriendListForInvite';

const AddGroupModal = ({ onCloseModal, userVerified }) => {
    // State variables
    const [groupName, setGroupName] = useState('');
    const [groupImage, setGroupImage] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [friendList, setFriendList] = useState([]);
    const { setRoomList } = useChat();
    const [searchResults, setSearchResults] = useState([]);
    const searchTermDebounce = useDebounce(searchTerm, 500);

    const fetchFriendList = async () => {
        try {
            const response = await userService.getFriendList(userVerified._id);
            setFriendList(response);
        } catch (error) {
            console.error('Error fetching friend list:', error);
        }
    };

    // Fetch friend list
    useEffect(() => {
        fetchFriendList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userVerified]);

    // Function to fetch users based on search term
    useEffect(() => {
        if (searchTermDebounce.trim() !== '') {
            const result = friendList.filter((user) =>
                user.username
                    .toLowerCase()
                    .includes(searchTermDebounce.toLowerCase()),
            );
            setSearchResults(result);
        } else {
            setSearchResults([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTermDebounce]);

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
        console.log('Creating group...');
        try {
            const members = selectedUsers.map((user) => user._id);
            members.push(userVerified._id);

            if (members.length < 3) {
                toast.error('Please select at least 3 user');
                return;
            } else {
                const response = await chatService.createChatRoom({
                    members,
                    type: 'group',
                    name: groupName || 'New Group',
                    image: groupImage,
                    adminId: userVerified._id,
                });

                setRoomList((prev) => [...prev, response]);

                // Emit a socket event to the server to notify the other user
                socket.emit('create-room', {
                    createdRoom: response,
                });
            }
        } catch (error) {
            console.error('Error creating group:', error);
            toast.error('Error creating group');
        } finally {
            onCloseModal();
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

                <FriendListForInvite
                    friendList={friendList}
                    searchResults={searchResults}
                    removeSelectedUser={removeSelectedUser}
                    selectedUsers={selectedUsers}
                    searchTermDebounce={searchTermDebounce}
                    toggleUserSelection={toggleUserSelection}
                />

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
