import { useAuth } from '~/hooks/useAuth';
import FallbackAvatar from '../shared/FallbackAvatar';

function MessageItem({ message }) {
    const { userVerified } = useAuth();
    console.log('Message:', message);
    return (
        <div>
            {message.sender._id === userVerified._id ? (
                <div className="mb-4 flex flex-col items-end">
                    <div className="flex space-x-2">
                        <div className="max-w-[100%] rounded-md bg-blue-500 p-2 text-white">
                            {message.content}
                        </div>

                        {message.sender.profilePic ? (
                            <img
                                src={message.sender.profilePic}
                                alt="profile"
                                className="h-6 w-6 rounded-full"
                            />
                        ) : (
                            <FallbackAvatar name={message.sender.username} />
                        )}
                    </div>

                    <div className="mt-1 text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleString()}
                    </div>
                </div>
            ) : (
                <div className="mb-4 flex flex-col items-start">
                    <div className="flex space-x-2">
                        {message.sender.profilePic ? (
                            <img
                                src={message.sender.profilePic}
                                alt="profile"
                                className="h-6 w-6 rounded-full"
                            />
                        ) : (
                            <FallbackAvatar name={message.sender.username} />
                        )}

                        <div className="max-w-[100%] rounded-md bg-gray-300 p-2">
                            {message.content}
                        </div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleString()}
                    </div>
                </div>
            )}
        </div>
    );
}

export default MessageItem;
