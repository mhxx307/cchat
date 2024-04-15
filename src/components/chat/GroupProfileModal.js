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
    const [image, setImage] = useState({
        preview: selectedRoom.image,
        raw: '',
    });
    const [loading, setLoading] = useState(false);

    console.log(selectedRoom);

    const handleSave = async () => {
        setLoading(true);
        try {
            const updatedRoom = await chatService.updateChatGroup({
                chatroomId: selectedRoom._id,
                members,
                name: groupName,
                image: selectedRoom.image || '',
                adminId: selectedRoom.admin._id,
                newAdminId: selectedRoom.admin._id, // Assuming admin remains the same
            });
            setSelectedRoom(updatedRoom); // Assuming response contains updated room data
            setRoomList((prevRooms) =>
                prevRooms.map((room) =>
                    room._id === updatedRoom._id ? updatedRoom : room,
                ),
            );
            toast.success('Group updated successfully');

            // Emit event to update group details in other clients
            socket.emit('update-group', updatedRoom);
        } catch (error) {
            console.error('Error updating group:', error);
            toast.error('Failed to update group');
        } finally {
            setLoading(false);
        }
    };

    const removeMember = async (memberId) => {
        const updatedMembers = members.filter(
            (member) => member._id !== memberId,
        );
        setMembers(updatedMembers);
    };

    const handleLeaveGroup = async () => {
        // Implement logic to leave the group
        // You can use APIs or other methods to perform this action
        // After leaving the group, you can handle the UI or redirect the user accordingly
        setLoading(true);
        try {
            await chatService.updateChatGroup({
                chatroomId: selectedRoom._id,
                members: members.filter(
                    (member) => member._id !== userVerified._id,
                ),
                name: groupName,
                image: selectedRoom.image || '',
                adminId: selectedRoom.admin._id,
                newAdminId: selectedRoom.admin._id,
            });
            setSelectedRoom(null);
            setRoomList((prevRooms) =>
                prevRooms.filter((room) => room._id !== selectedRoom._id),
            );
            toast.success('Left group successfully');
        } catch (error) {
            console.error('Error leaving group:', error);
            toast.error('Failed to leave group');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage({
            preview: URL.createObjectURL(file),
            raw: file,
        });
    };

    const handleRemoveGroup = async () => {
        setLoading(true);
        try {
            await chatService.removeChatroom({
                chatroomId: selectedRoom._id,
                admin: selectedRoom.admin._id,
            });
            setRoomList((prevRooms) =>
                prevRooms.filter((room) => room._id !== selectedRoom._id),
            );
            setSelectedRoom(null);

            // Emit event to remove group from other clients
            socket.emit('update-group', {
                _id: selectedRoom._id,
            });
            toast.success('Group removed successfully');
        } catch (error) {
            console.error('Error removing group:', error);
            toast.error('Failed to remove group');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-4 w-[400px] space-y-4 rounded bg-white px-8 pb-8 pt-6">
            <div className="flex items-center">
                <label htmlFor="imageUpload" className="cursor-pointer">
                    {image.preview ? (
                        <img
                            src={image.preview}
                            alt="Group Avatar"
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
                {userVerified._id === selectedRoom.admin._id ? (
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
