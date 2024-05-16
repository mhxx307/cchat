import { useAuth } from '~/hooks/useAuth';
import FallbackAvatar from '../shared/FallbackAvatar';
import { useTheme } from '~/hooks/useTheme';

function RoomSidebarItem({ room, selectedRoom, handleRoomSelect }) {
    const { userVerified } = useAuth();
    const { isDarkMode } = useTheme();
    const receiver = room.members.find(
        (member) => member._id !== userVerified._id,
    );
    const isSelected = selectedRoom && selectedRoom._id === room._id;

    return (
        <li
            key={room._id}
            className={`mb-2 cursor-pointer rounded px-4 py-2 font-['Helvetica'] text-[15px] font-medium ${
                isSelected
                    ? `${isDarkMode ? 'shadow-roomItem bg-[#2c2c30]' : ' shadow-roomItem bg-[#ffffff] text-[#000000]'}`
                    : `duration-75 ${isDarkMode ? 'hover:shadow-roomItem hover:bg-[#2c2c30]' : 'hover:shadow-roomItem hover:bg-[#ffffff] '}`
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
