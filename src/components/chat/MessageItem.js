import { useAuth } from '~/hooks/useAuth';
import FallbackAvatar from '../shared/FallbackAvatar';
import Popover from '../shared/Popover';
import { FaReply } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useState } from 'react';
import Modal from 'react-responsive-modal';

function MessageItem({ message, onReply, onDelete }) {
    const { userVerified } = useAuth();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const openModal = () => {
        setIsDeleteModalOpen(true);
    };

    const handleReply = () => {
        onReply(message);
    };

    const handleDelete = () => {
        onDelete(message);
    };

    const handleReferenceMessage = (message) => {
        const referencedMessageId = message.replyTo._id; // Assuming the ID of the referenced message is stored in message.replyTo._id
        const referencedMessageElement =
            document.getElementById(referencedMessageId);

        if (referencedMessageElement) {
            referencedMessageElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            });
        }
    };

    console.log('Message:', message);

    return (
        <div
            id={message._id}
            className={
                message.sender._id === userVerified._id
                    ? 'mb-4 flex flex-col items-end'
                    : 'mb-4 flex flex-col items-start'
            }
        >
            {message.sender._id === userVerified._id ? (
                <div className="mb-4 flex flex-col items-end">
                    {/* reply message */}
                    {message.replyTo && (
                        <ReplyMessageItem
                            message={message}
                            handleReferenceMessage={handleReferenceMessage}
                        />
                    )}
    
                    <Popover
                        placement="left"
                        renderPopover={
                            <Options
                                onReply={handleReply}
                                openModal={openModal}
                                message={message}
                            />
                        }
                    >
                        <div className="flex items-start justify-end space-x-2">
                            {/* Container chứa cả hình ảnh hồ sơ và nội dung tin nhắn, căn phải */}
                            <div className="max-w-[100%] rounded-md bg-blue-500 p-2 text-white">
                                {message.content && (
                                    <div className="mb-2">
                                        {message.content}
                                    </div>
                                )}
                                {message.images &&
                                    message.images.length > 0 && (
                                        <div className="flex flex-wrap justify-start">
                                            {message.images.map(
                                                (imageUrl, index) => (
                                                    <img
                                                        key={index}
                                                        src={imageUrl}
                                                        alt={`Image ${index}`}
                                                        className="message-image mb-2 mr-2 max-h-[200px] max-w-[200px] rounded-lg shadow-md"
                                                    />
                                                ),
                                            )}
                                        </div>
                                    )}
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
    
                    <div className="mt-1 text-xs text-gray-300">
                        {new Date(message.timestamp).toLocaleString()}
                    </div>
    
                    {/* Images display */}
                </div>
            ) : (
                <div className="mb-4 flex flex-col items-start">
                    {/* reply message */}
                    {message.replyTo && (
                        <ReplyMessageItem
                            message={message}
                            handleReferenceMessage={handleReferenceMessage}
                        />
                    )}
    
                    <Popover
                        placement="right"
                        renderPopover={
                            <Options
                                onReply={handleReply}
                                openModal={openModal}
                                message={message}
                            />
                        }
                    >
                        <div className="flex items-start space-x-2">
                            {/* Container chứa cả hình ảnh hồ sơ và nội dung tin nhắn */}
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
                            <div className="max-w-[100%] rounded-md bg-blue-500 p-2 text-white">
                                {message.content && (
                                    <div className="mb-2">
                                        {message.content}
                                    </div>
                                )}
                                {message.images &&
                                    message.images.length > 0 && (
                                        <div className="flex flex-wrap justify-start">
                                            {message.images.map(
                                                (imageUrl, index) => (
                                                    <img
                                                        key={index}
                                                        src={imageUrl}
                                                        alt={`Image ${index}`}
                                                        className="message-image mb-2 mr-2 max-h-[200px] max-w-[200px] rounded-lg shadow-md"
                                                    />
                                                ),
                                            )}
                                        </div>
                                    )}
                            </div>
                        </div>
                    </Popover>
    
                    <div className="mt-1 text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleString()}
                    </div>
    
                    {/* Images display */}
                </div>
            )}
    
            {/* modal confirm delete */}
            <Modal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                center
            >
                <div className="p-4">
                    <h2>Are you sure you want to delete this message?</h2>
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="rounded-md bg-gray-300 p-2"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="rounded-md bg-red-500 p-2 text-white"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
    
}

export default MessageItem;

const Options = ({ onReply, openModal, message }) => {
    const { userVerified } = useAuth();
    return (
        <div className="flex space-x-2">
            {message.sender._id === userVerified._id && (
                <button
                    onClick={() => openModal()}
                    className="flex items-center space-x-1 text-red-500"
                >
                    <MdDelete />
                </button>
            )}
            <button onClick={onReply} className="flex items-center space-x-1">
                <FaReply />
            </button>
        </div>
    );
};

const ReplyMessageItem = ({ message, handleReferenceMessage }) => {
    return (
        <div
            className="mb-2 cursor-pointer rounded-md bg-gray-300 p-2"
            onClick={() => handleReferenceMessage(message)}
        >
            <div className="text-xs text-gray-500">
                {message.replyTo.sender.username} replied:
            </div>
            <div>{message.replyTo.content}</div>
        </div>
    );
};
