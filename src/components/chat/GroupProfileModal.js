import { useState } from 'react';
import FallbackAvatar from '../shared/FallbackAvatar';
import { useAuth } from '~/hooks/useAuth';
import chatService from '~/services/chatService';
import { toast } from 'react-toastify';
import Loading from '../shared/Loading';
import { useChat } from '~/hooks/useChat';
import socket from '~/configs/socket';

function GroupProfileModal() {
    const { userVerified } = useAuth();
    const { selectedRoom, setSelectedRoom, setRoomList } = useChat();
    const [groupName, setGroupName] = useState(selectedRoom.name);
    const [members, setMembers] = useState(selectedRoom.members);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {};

    const removeMember = (memberId) => {
        // Implement logic to remove a member from the group
        // You can use APIs or other methods to perform this action
        // After removing the member, you can handle the UI or redirect the user accordingly
    };

    const handleLeaveGroup = async () => {
        // Implement logic to leave the group
        // You can use APIs or other methods to perform this action
        // After leaving the group, you can handle the UI or redirect the user accordingly
    };

    const handleImageChange = (event) => {
        // Handle image selection
        const file = event.target.files[0];
        setImage(file);
    };

    const handleRemoveGroup = async () => {};

    return (
        <div className="mb-4 w-[400px] space-y-4 rounded bg-white px-8 pb-8 pt-6">
            <div className="flex items-center">
                <label htmlFor="imageUpload" className="cursor-pointer">
                    {image ? (
                        <img
                            src={URL.createObjectURL(image)}
                            alt="Group Avatar"
                            className="h-8 w-8 rounded-full"
                        />
                    ) : selectedRoom.image ? (
                        <img
                            src={selectedRoom.image}
                            alt="Avatar"
                            className="h-8 w-8 rounded-full"
                        />
                    ) : (
                        <FallbackAvatar name={selectedRoom.name} />
                    )}
                </label>
                <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                />
            </div>
            <div className="mb-4">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                    Group Name
                </label>
                <input
                    className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                    type="text"
                    disabled={userVerified._id !== selectedRoom.admin._id}
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Group Name"
                />
            </div>
            <div className="mb-6">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                    Group Members
                </label>
                <ul className="h-24 overflow-y-auto">
                    {members.map((member) => (
                        <li
                            key={member._id}
                            className="flex items-center justify-between border-b border-gray-300 px-3 py-2"
                        >
                            <div className="flex items-center">
                                {member.profilePic ? (
                                    <img
                                        src={member.profilePic}
                                        alt={member.username}
                                        className="mr-2 h-8 w-8 rounded-full"
                                    />
                                ) : (
                                    <FallbackAvatar name={member.username} />
                                )}
                                <span className="ml-2">{member.username}</span>
                            </div>
                            {userVerified._id === selectedRoom.admin._id &&
                                userVerified._id !== member._id && (
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => removeMember(member._id)}
                                    >
                                        Remove
                                    </button>
                                )}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex items-center justify-between">
                {userVerified._id === selectedRoom.admin ? (
                    <button
                        className="focus:shadow-outline rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700 focus:outline-none"
                        onClick={handleRemoveGroup}
                    >
                        Remove Group
                    </button>
                ) : (
                    <button
                        className="focus:shadow-outline rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700 focus:outline-none"
                        onClick={handleLeaveGroup}
                    >
                        Leave Group
                    </button>
                )}
                <button
                    className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? <Loading /> : 'Save'}
                </button>
            </div>
        </div>
    );
}

export default GroupProfileModal;
