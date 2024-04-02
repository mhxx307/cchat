import { useAuth } from '~/hooks/useAuth';
import FallbackAvatar from '../shared/FallbackAvatar';

function RoomSidebarItem({ room, selectedRoom, handleRoomSelect }) {
    const { userVerified } = useAuth();
    const receiver = room.members.find(
        (member) => member._id !== userVerified._id,
    );
    return (
        <li
            key={room._id}
            className={`mb-2 cursor-pointer rounded px-4 py-2 ${
                selectedRoom && selectedRoom._id === room._id
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'hover:bg-gray-700'
            }`}
            onClick={() => handleRoomSelect(room)}
        >
            {room.type === '1v1' ? (
                <div className="flex items-center">
                    {receiver.profilePic ? (
                        <img
                            src={receiver.profilePic}
                            alt="profile"
                            className="h-8 w-8 rounded-full"
                        />
                    ) : (
                        <FallbackAvatar name={receiver.username} />
                    )}
                    <p className="ml-2">{receiver.username}</p>
                </div>
            ) : (
                <div className="flex items-center">
                    {room.image ? (
                        <img
                            src={room.image}
                            alt="group"
                            className="h-8 w-8 rounded-full"
                        />
                    ) : (
                        <FallbackAvatar name={room.name} />
                    )}
                    <p className="ml-2">{room.name}</p>
                </div>
            )}
        </li>
    );
}

export default RoomSidebarItem;
