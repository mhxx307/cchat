import { useAuth } from '~/hooks/useAuth';
import FallbackAvatar from '../shared/FallbackAvatar';
import Popover from '../shared/Popover';
import { FaReply } from 'react-icons/fa';
import { FaRightLong } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';
import { useEffect, useState } from 'react';
import Modal from 'react-responsive-modal';
import { useChat } from '~/hooks/useChat';
import chatService from '~/services/chatService';
import socket from '~/configs/socket';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '~/configs/firebase';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useTheme } from '~/hooks/useTheme';

function MessageItem({ message, onReply, onDelete }) {
    const { userVerified } = useAuth();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const { roomList, setSelectedRoom } = useChat();
    const [downloadUrlList, setDownloadUrlList] = useState([]);
    const { isDarkMode } = useTheme();

    const openModalShare = () => {
        setIsShareModalOpen(true);
    };

    const openModal = () => {
        setIsDeleteModalOpen(true);
    };

    const handleReply = () => {
        onReply(message);
    };

    const handleDelete = () => {
        onDelete(message);
    };

    useEffect(() => {
        async function fetchDownloadUrlList() {
            const mediaRefs = message.files.map((file) =>
                ref(storage, `files/${file.name}`),
            );
            const mediaInfo = await Promise.all(
                mediaRefs.map(async (mediaRef) => {
                    const url = await getDownloadURL(mediaRef);
                    return {
                        url,
                        name: mediaRef.name,
                    };
                }),
            );

            setDownloadUrlList(mediaInfo);
        }

        fetchDownloadUrlList();
    }, [message.files]);

    const handleDownloadFile = (file) => {
        console.log(file);
        const fileUrl = downloadUrlList.find(
            (media) => media.name === file.name,
        ).url;
        console.log(fileUrl);

        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = file.name; // Set the download attribute to the file's name
        document.body.appendChild(link); // Append the link to the document body
        link.click(); // Programmatically click the link to trigger the download
        document.body.removeChild(link); // Remove the link from the document
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

    const handleSendMessageToOtherRoom = async (message, room) => {
        // Send the message to the selected room
        console.log('Sending message to room:', room);

        try {
            const response = await chatService.sendMessage({
                senderId: userVerified._id,
                content: message.content,
                images: message.images,
                files: message.files,
                roomId: room._id,
                replyMessageId: message.replyTo?._id || null,
                fromId: message.sender._id,
            });

            console.log('Response:', response);

            socket.emit('send-message', {
                savedMessage: response,
            });
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSelectedRoom(room);
            socket.emit('sort-room', {
                userId: userVerified._id,
            });
        }
    };

    return (
        <div
            id={message._id}
            className={
                message.sender._id === userVerified._id
                    ? 'mb-4 flex flex-col items-end'
                    : 'mb-4 flex flex-col items-start'
            }
        >
            {/* Message content */}
            <div
                className={
                    message.sender._id === userVerified._id
                        ? 'mb-4 flex flex-col items-end'
                        : 'mb-4 flex flex-col items-start'
                }
            >
                {/* Reply message */}
                {message.replyTo && (
                    <ReplyMessageItem
                        message={message}
                        handleReferenceMessage={handleReferenceMessage}
                    />
                )}

                {/* Popover */}
                <Popover
                    placement={
                        message.sender._id === userVerified._id
                            ? 'left'
                            : 'right'
                    }
                    renderPopover={
                        <Options
                            onReply={handleReply}
                            openModal={openModal}
                            message={message}
                            openModalShare={openModalShare}
                        />
                    }
                >
                    <div
                        className={
                            message.sender._id === userVerified._id
                                ? 'flex items-start justify-end space-x-2'
                                : 'flex items-start space-x-2'
                        }
                    >
                        {userVerified._id !== message.sender._id && (
                            <div className="flex items-center space-x-2">
                                {message.sender.profilePic ? (
                                    <img
                                        src={message.sender.profilePic}
                                        alt="profile"
                                        className="h-6 w-6 rounded-full"
                                    />
                                ) : (
                                    <FallbackAvatar
                                        className={'h-6 w-6'}
                                        name={message.sender.username}
                                    />
                                )}
                            </div>
                        )}

                        {/* Message content container */}
                        <div className="max-w-[100%] rounded-md bg-blue-500 p-2 text-white">
                            {message.from && (
                                <div className="text-xs">
                                    from {message.from.username}
                                </div>
                            )}
                            {message.content && (
                                <div className="w-64 break-all">
                                    {message.content}
                                </div>
                            )}
                            {/* Render images */}
                            {message.images && message.images.length > 0 && (
                                <div className="flex flex-wrap justify-start">
                                    {message.images.map((imageUrl, index) => (
                                        <img
                                            key={index}
                                            src={imageUrl}
                                            alt={`${index}`}
                                            className="message-image mb-2 mr-2 max-h-[200px] max-w-[200px] rounded-lg shadow-md"
                                        />
                                    ))}
                                </div>
                            )}
                            {/* Render files */}
                            {message.files && message.files.length > 0 && (
                                <div className="flex flex-wrap justify-start">
                                    {message.files.map((file, index) => (
                                        <div
                                            key={index}
                                            className="message-file-container mb-2 mr-2 flex items-center rounded-lg bg-gray-200 p-2 text-black shadow-md"
                                        >
                                            <p>{file.name}</p>
                                            <button
                                                onClick={() =>
                                                    handleDownloadFile(file)
                                                }
                                                className="ml-auto rounded bg-blue-500 px-2 py-1 text-white"
                                            >
                                                Download
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sender avatar */}
                        {userVerified._id === message.sender._id &&
                            (message.sender.profilePic ? (
                                <img
                                    src={message.sender.profilePic}
                                    alt="profile"
                                    className="h-6 w-6 rounded-full"
                                />
                            ) : (
                                <FallbackAvatar
                                    name={message.sender.username}
                                />
                            ))}
                    </div>
                </Popover>

                {/* Timestamp */}
                <div
                    className={`mt-1 flex w-full text-xs ${isDarkMode ? 'text-white' : 'text-black'} ${userVerified._id === message.sender._id ? '' : 'flex-row-reverse'}`}
                >
                    {new Date(message.timestamp).toLocaleString()}
                </div>
            </div>

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
                            className="
                            rounded-md bg-gray-300 p-2"
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

            {/* modal share */}
            <Modal
                open={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                center
            >
                <div className="p-4">
                    <h2 className="w-80 truncate">
                        Share Message to Room: {message.content}
                    </h2>
                    <ul className="mt-4 max-h-60 overflow-y-auto">
                        {roomList.map((room) => (
                            <li
                                key={room._id}
                                className="mb-2 cursor-pointer rounded-md border p-2 hover:bg-gray-100"
                                onClick={() => {
                                    // handle sharing the message to the selected room
                                    handleSendMessageToOtherRoom(message, room);
                                    setIsShareModalOpen(false);
                                }}
                            >
                                {room.name ||
                                    room.members.find(
                                        (member) =>
                                            member._id !== userVerified._id,
                                    ).username}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 flex justify-end space-x-2">
                        <button
                            onClick={() => setIsShareModalOpen(false)}
                            className="rounded-md bg-gray-300 p-2"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default MessageItem;

const Options = ({ onReply, openModal, message, openModalShare }) => {
    const { userVerified } = useAuth();
    return (
        <div className="flex space-x-2">
            {message.sender._id === userVerified._id && (
                <Tippy content="Delete">
                    <button
                        onClick={() => openModal()}
                        className="flex items-center space-x-1 text-red-500"
                    >
                        <MdDelete />
                    </button>
                </Tippy>
            )}
            <Tippy content="Reply">
                <button
                    onClick={onReply}
                    className="flex items-center space-x-1"
                >
                    <FaReply />
                </button>
            </Tippy>
            <Tippy content="Share">
                <button
                    onClick={openModalShare}
                    className="flex items-center space-x-1"
                >
                    <FaRightLong />
                </button>
            </Tippy>
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
