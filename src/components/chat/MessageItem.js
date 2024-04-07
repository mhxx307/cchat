import { useAuth } from '~/hooks/useAuth';
import FallbackAvatar from '../shared/FallbackAvatar';
import Popover from '../shared/Popover';
import { FaReply } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

function MessageItem({ message, onReply, onDelete }) {
    const { userVerified } = useAuth();

    const handleReply = () => {
        onReply(message);
    };

    const handleDelete = () => {
        onDelete(message);
    };

    return (
        <>
            {message.sender._id === userVerified._id ? (
                <div className="mb-4 flex flex-col items-end">
                    <Popover
                        placement="left"
                        renderPopover={
                            <Options
                                message={message}
                                onReply={handleReply}
                                onDelete={handleDelete}
                            />
                        }
                    >
                        <div className="flex space-x-2">
                            <div className="inline max-w-[100%] rounded-md bg-blue-500 p-2 text-white">
                                {message.content}
                            </div>

                            {message.sender.profilePic ? (
                                <img
                                    src={message.sender.profilePic}
                                    alt="profile"
                                    className="h-6 w-6 rounded-full"
                                />
                            ) : (
                                <FallbackAvatar
                                    name={message.sender.username}
                                />
                            )}
                        </div>
                    </Popover>

                    <div className="mt-1 text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleString()}
                    </div>
                </div>
            ) : (
                <div className="mb-4 flex flex-col items-start">
                    <Popover
                        placement="right"
                        renderPopover={
                            <Options
                                message={message}
                                onReply={handleReply}
                                onDelete={handleDelete}
                            />
                        }
                    >
                        <div className="flex space-x-2">
                            {message.sender.profilePic ? (
                                <img
                                    src={message.sender.profilePic}
                                    alt="profile"
                                    className="h-6 w-6 rounded-full"
                                />
                            ) : (
                                <FallbackAvatar
                                    name={message.sender.username}
                                />
                            )}

                            <div className="max-w-[100%] rounded-md bg-gray-300 p-2">
                                {message.content}
                            </div>
                        </div>
                    </Popover>
                    <div className="mt-1 text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleString()}
                    </div>
                </div>
            )}
        </>
    );
}

export default MessageItem;

const Options = ({ message, onReply, onDelete }) => {
    return (
        <div className="flex space-x-2">
            <button
                onClick={onDelete}
                className="flex items-center space-x-1 text-red-500"
            >
                <MdDelete />
            </button>
            <button onClick={onReply} className="flex items-center space-x-1">
                <FaReply />
            </button>
        </div>
    );
};
