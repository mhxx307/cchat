import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
// import socket from '~/configs/socket';
import { useAuth } from '~/hooks/useAuth';
import { useChat } from '~/hooks/useChat';
import useDebounce from '~/hooks/useDebounce';
import chatService from '~/services/chatService';
import userService from '~/services/userService';
import FriendListForInvite from './FriendListForInvite';
import socket from '~/configs/socket';

const AddMembersModal = ({ onCloseModal }) => {
    const { userVerified } = useAuth();
    const { selectedRoom, setSelectedRoom } = useChat();
    const [searchResults, setSearchResults] = useState([]);
    const [friendList, setFriendList] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const searchTermDebounce = useDebounce(searchTerm, 500);

    const fetchFriendList = async () => {
        try {
            const response = await userService.getFriendList(userVerified._id);
            // filter out the current members of the room
            const filteredList = response.filter(
                (user) =>
                    !selectedRoom.members.some(
                        (member) => member._id === user._id,
                    ),
            );
            setFriendList(filteredList);
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

    // Function to handle search input with debounce
    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
    };

    const handleAddMembers = async () => {
        try {
            const updatedRoom = await chatService.updateChatGroup({
                chatroomId: selectedRoom._id,
                name: selectedRoom.name,
                image: selectedRoom.image,
                members: [
                    ...selectedRoom.members.map((member) => member._id),
                    ...selectedUsers.map((user) => user._id),
                ],
                adminId: selectedRoom.admin._id,
            });

            setSelectedRoom(updatedRoom);
            socket.emit('update-group', updatedRoom);

            toast.success('Members added successfully');
        } catch (error) {
            console.error('Error adding members:', error);
            toast.error('Failed to add members');
        } finally {
            setSelectedUsers([]);
            onCloseModal();
        }
    };

    return (
        <div className="min-w-[500px]">
            <input
                type="text"
                className="mb-4 w-full rounded border border-gray-300 px-4 py-2 focus:outline-none"
                placeholder="Search Users"
                onChange={handleSearchChange}
            />

            <FriendListForInvite
                friendList={friendList}
                searchTermDebounce={searchTerm}
                searchResults={searchResults}
                selectedUsers={selectedUsers}
                toggleUserSelection={toggleUserSelection}
                removeSelectedUser={removeSelectedUser}
            />

            <div className="mt-4 flex justify-end">
                <button
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none"
                    onClick={handleAddMembers}
                >
                    Add Members
                </button>
            </div>
        </div>
    );
};

export default AddMembersModal;
