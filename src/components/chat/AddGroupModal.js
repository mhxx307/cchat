import { useEffect, useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import socket from '~/configs/socket';
import { useChat } from '~/hooks/useChat';
import useDebounce from '~/hooks/useDebounce';
import chatService from '~/services/chatService';
import userService from '~/services/userService';
import { toast } from 'react-toastify';
import FriendListForInvite from './FriendListForInvite';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '~/configs/firebase';
import { v4 } from 'uuid';

const AddGroupModal = ({ onCloseModal, userVerified }) => {
    // State variables
    const [groupName, setGroupName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [friendList, setFriendList] = useState([]);
    const { setRoomList } = useChat();
    const [searchResults, setSearchResults] = useState([]);
    const searchTermDebounce = useDebounce(searchTerm, 500);
    const [image, setImage] = useState({ preview: '', raw: '' });

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

        // Create object URL for preview
        const imageUrl = URL.createObjectURL(imageFile);

        // Update image state with both preview and raw image
        setImage({ preview: imageUrl, raw: imageFile });
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

    const uploadToFirebase = async () => {
        const imageFile = image.raw;
        // Tạo một reference đến vị trí lưu trữ trên Firebase Storage, có thể dùng tên file hoặc unique ID (ví dụ: UUID)
        const imageRef = ref(storage, `imagesGroup/${imageFile?.name + v4()}`);
        // Thực hiện tải lên ảnh vào Firebase Storage
        const snapshot = await uploadBytes(imageRef, imageFile);
        // Lấy đường dẫn tải xuống (URL) của ảnh đã tải lên
        const imageUrl = await getDownloadURL(snapshot.ref);

        return imageUrl;
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
                let groupImage = '';
                if (image.raw) {
                    groupImage = await uploadToFirebase();
                }
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
                <div className="mb-4 flex items-center space-x-2">
                    <label htmlFor="imageUpload" className="cursor-pointer">
                        {image.preview ? (
                            <img
                                src={image.preview}
                                alt="Group Avatar"
                                className="h-8 w-8 rounded-full"
                            />
                        ) : (
                            <FaCamera />
                        )}
                    </label>
                    <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleGroupImageChange}
                    />
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
