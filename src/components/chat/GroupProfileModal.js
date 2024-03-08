import { useState } from 'react';
import FallbackAvatar from '../shared/FallbackAvatar';
import { useAuth } from '~/hooks/useAuth';
import chatService from '~/services/chatService';
import { toast } from 'react-toastify';
import Loading from '../shared/Loading';
import { useChat } from '~/hooks/useChat';

function GroupProfileModal() {
    const { userVerified } = useAuth();
    const { selectedRoom, setSelectedRoom, setCurrentChatList } = useChat();
    const [groupName, setGroupName] = useState(selectedRoom.group.name);
    const [members, setMembers] = useState(selectedRoom.members);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    console.log('selectedRoom', selectedRoom);

    const handleSave = async () => {
        setLoading(true);
        try {
            // Implement logic to save changes to group profile
            // You can use APIs or other methods to update group information
            // After saving, you can close the modal
            await chatService.updateGroup({
                groupId: selectedRoom.group._id,
                name: groupName,
                members: members.map((member) => member._id),
                profilePic: selectedRoom.group.profilePic,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setSelectedRoom((prevRoom) => ({
                ...prevRoom,
                group: {
                    ...prevRoom.group,
                    name: groupName,
                    profilePic: selectedRoom.group.profilePic,
                },
                members,
            }));
            setCurrentChatList((prevList) => {
                const index = prevList.findIndex(
                    (chat) => chat._id === selectedRoom._id,
                );
                const updatedChat = {
                    ...prevList[index],
                    group: {
                        ...prevList[index].group,
                        name: groupName,
                        profilePic: selectedRoom.group.profilePic,
                    },
                };
                prevList.splice(index, 1, updatedChat);
                return prevList;
            });
            toast.success('Group profile updated successfully');
            // REAL-TIME UPDATE
        }
    };

    const removeMember = (memberId) => {
        // Implement logic to remove a member from the group
        // Update the members state accordingly
        setMembers((prevMembers) =>
            prevMembers.filter((member) => member._id !== memberId),
        );
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

    return (
        <div className="mb-4 space-y-4 rounded bg-white px-8 pb-8 pt-6">
            <div className="flex items-center">
                <label htmlFor="imageUpload" className="cursor-pointer">
                    {image ? (
                        <img
                            src={URL.createObjectURL(image)}
                            alt="Group Avatar"
                            className="h-8 w-8 rounded-full"
                        />
                    ) : selectedRoom.group.profilePic ? (
                        <img
                            src={selectedRoom.group.profilePic}
                            alt="Avatar"
                            className="h-8 w-8 rounded-full"
                        />
                    ) : (
                        <FallbackAvatar name={selectedRoom.group.name} />
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
                    disabled={userVerified._id !== selectedRoom.group.admin}
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
                                <span>{member.username}</span>
                            </div>
                            {userVerified._id === selectedRoom.group.admin && (
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
                {userVerified._id === selectedRoom.group.admin ? (
                    <button
                        className="focus:shadow-outline rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700 focus:outline-none"
                        onClick={() =>
                            console.log('Implement logic to remove group')
                        }
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
