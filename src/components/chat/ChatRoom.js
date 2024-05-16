import { useEffect, useRef, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { useAuth } from '~/hooks/useAuth';
import chatService from '~/services/chatService';
import socket from '~/configs/socket';
import { useChat } from '~/hooks/useChat';
import MessageItem from './MessageItem';
import GroupProfileModal from './GroupProfileModal';
import Modal from 'react-responsive-modal';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '~/configs/firebase';
import { v4 } from 'uuid';
import AddMembersModal from './AddMembersModal';
import { useVideoCall } from '~/hooks/useVideoCall';
import { useTheme } from '~/hooks/useTheme';
import { FaPhoneAlt } from 'react-icons/fa';
import { IoPersonAddSharp } from 'react-icons/io5';

const ChatRoom = () => {
    const { selectedRoom, fetchUpdatedRooms } = useChat();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const { userVerified } = useAuth();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [replyingMessage, setReplyingMessage] = useState(null);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const messagesEndRef = useRef(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [openModalInvite, setOpenModalInvite] = useState(false);
    const { handleCallRequest } = useVideoCall();
    const { isDarkMode } = useTheme();

    console.log('selectedImages', selectedImages);

    // console.log('selected room:', selectedRoom);
    // console.log('messages:', messages);

    // fetch messages when selected room changes
    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedRoom) {
                const response = await chatService.getAllMessagesInRoom(
                    selectedRoom._id,
                );
                setMessages(response);
            }
        };
        fetchMessages();
    }, [selectedRoom]);

    // scroll to the bottom of the chat messages
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // listen for new messages
    useEffect(() => {
        socket.on('receive-message', (data) => {
            console.log('Received message:', data);
            setMessages((prevMessages) => [...prevMessages, data.savedMessage]);
        });

        return () => {
            socket.off('receive-message');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    // listen for deleted messages
    useEffect(() => {
        socket.on('deleted-message', (data) => {
            console.log('Received deleted message:', data);
            setMessages((prevMessages) =>
                prevMessages.filter((msg) => msg._id !== data.messageId),
            );
        });

        return () => {
            socket.off('deleted-message');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    const handleOpenAddGroupModal = () => {
        onOpenModal();
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const uploadToFirebase = async () => {
        const imageUrls = [];
        // Upload each image to Firebase Storage
        for (const selectedImage of selectedImages) {
            const imageFile = selectedImage.file;
            // Tạo một reference đến vị trí lưu trữ trên Firebase Storage, có thể dùng tên file hoặc unique ID (ví dụ: UUID)
            const imageRef = ref(storage, `images/${imageFile?.name + v4()}`);
            // Thực hiện tải lên ảnh vào Firebase Storage
            const snapshot = await uploadBytes(imageRef, imageFile);
            // Lấy đường dẫn tải xuống (URL) của ảnh đã tải lên
            const imageUrl = await getDownloadURL(snapshot.ref);
            // Thêm URL của ảnh vào mảng imageUrls
            imageUrls.push(imageUrl);
        }

        console.log('Uploaded image URLs:', imageUrls);

        return imageUrls;
    };

    const handleSendMessage = async () => {
        setLoading(true);

        try {
            if (newMessage.trim() === '' && selectedImages.length === 0) {
                return;
            }

            const imageUrls = await uploadToFirebase();

            if (selectedRoom.type === '1v1') {
                const receiverId = selectedRoom.members.find(
                    (member) => member._id !== userVerified._id,
                );

                const response = await chatService.sendMessage({
                    senderId: userVerified._id,
                    receiverId: receiverId,
                    content: newMessage,
                    images: imageUrls.length > 0 ? imageUrls : [], // Thêm mảng imageUrls vào thông tin tin nhắn
                    roomId: selectedRoom._id,
                    replyMessageId: replyingMessage || null,
                });

                setMessages([...messages, response]);
                setNewMessage('');
                setSelectedImages([]);

                socket.emit('send-message', {
                    savedMessage: response,
                });
            } else if (selectedRoom.type === 'group') {
                const response = await chatService.sendMessage({
                    senderId: userVerified._id,
                    content: newMessage,
                    images: imageUrls, // Thêm mảng imageUrls vào thông tin tin nhắn
                    roomId: selectedRoom._id,
                    replyMessageId: replyingMessage || null,
                });

                setMessages([...messages, response]);
                setNewMessage('');

                socket.emit('send-message', {
                    savedMessage: response,
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSelectedImages([]);
            setLoading(false);
            fetchUpdatedRooms();
            setReplyingMessage(null);
            setIsReplying(false);
            socket.emit('sort-room', {
                userId: userVerified._id,
            });
        }
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        const selectedImagesArray = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setSelectedImages((prevImages) => [
            ...prevImages,
            ...selectedImagesArray,
        ]);
    };

    const handleReply = (message) => {
        setIsReplying(true);
        setReplyingMessage(message._id);
        // console.log('Reply message:', message);
    };

    const handleRemoveImage = (index) => {
        const newSelectedImages = [...selectedImages];
        newSelectedImages.splice(index, 1);
        setSelectedImages(newSelectedImages);
    };

    const handleDelete = async (message) => {
        // console.log('Delete message:', message);
        try {
            await chatService.deleteMessage(message._id);
            const updatedMessages = messages.filter(
                (msg) => msg._id !== message._id,
            );
            setMessages(updatedMessages);

            socket.emit('delete-message', {
                messageId: message._id,
            });
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const handleOpenInviteModal = () => {
        setOpenModalInvite(true);
    };

    const onCloseModalInvite = () => {
        setOpenModalInvite(false);
    };

    return (
        <div
            className={`flex h-[80vh] flex-col justify-between ${isDarkMode ? 'bg-[#282a2d]' : 'bg-[#fafafa]'} pb-2 md:h-full`}
        >
            <div className="flex justify-between">
                <div className="flex space-x-4">
                    {selectedRoom.type === '1v1' && (
                        <h2
                            className={`${isDarkMode ? 'text-white' : 'text-black'}`}
                        >
                            {
                                selectedRoom.members.find(
                                    (member) => member._id !== userVerified._id,
                                ).username
                            }
                        </h2>
                    )}

                    {selectedRoom.type === 'group' && (
                        <>
                            <button
                                className={`ml-4 focus:outline-none ${isDarkMode ? 'text-white' : 'text-black'}`}
                                onClick={handleOpenAddGroupModal}
                            >
                                {selectedRoom.name}
                            </button>
                            <Modal open={open} onClose={onCloseModal} center>
                                <GroupProfileModal />
                            </Modal>
                        </>
                    )}

                    <button
                        className={`focus:outline-none ${isDarkMode ? 'text-white' : 'text-black'}`}
                        onClick={() => {
                            console.log('Call video');
                            handleCallRequest(
                                selectedRoom.members.find(
                                    (member) => member._id !== userVerified._id,
                                ),
                            );
                        }}
                    >
                        <FaPhoneAlt />
                    </button>
                </div>

                {selectedRoom?.admin?._id === userVerified._id && (
                    <>
                        <button
                            className={`mr-4 ${isDarkMode ? 'text-white' : 'text-black'}`}
                            onClick={handleOpenInviteModal}
                        >
                            <IoPersonAddSharp />
                        </button>
                        <Modal
                            open={openModalInvite}
                            onClose={onCloseModalInvite}
                            center
                        >
                            <AddMembersModal
                                onCloseModal={onCloseModalInvite}
                            />
                        </Modal>
                    </>
                )}
            </div>

            <div className="max-h-[70vh] flex-1 overflow-y-auto px-2">
                {messages.length > 0 &&
                    messages.map((message) => (
                        <MessageItem
                            key={message._id}
                            message={message}
                            onReply={handleReply}
                            onDelete={handleDelete}
                        />
                    ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex space-x-2">
                {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                        <img
                            src={image.preview}
                            alt={`Preview ${index}`}
                            className="h-20 w-20 rounded-md object-cover"
                        />
                        <button
                            className="absolute right-0 top-0 flex items-center justify-center rounded-full bg-red-500 p-1 text-xs text-white"
                            style={{ backgroundColor: '#ed3b3b' }} // Thay đổi màu nền
                            onClick={() => handleRemoveImage(index)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="h-4 w-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            {isReplying && (
                <div className="rounded-md bg-gray-300 p-2">
                    <div className="flex items-center space-x-2">
                        <span>Replying to:</span>
                        <span className="text-sm">
                            {
                                messages.find(
                                    (message) =>
                                        message._id === replyingMessage,
                                ).content
                            }
                        </span>
                        <button
                            onClick={() => setIsReplying(false)}
                            className="text-red-500"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="flex items-center">
                {showEmojiPicker && (
                    <div className="absolute right-[5%] top-[40%]">
                        <EmojiPicker
                            onEmojiClick={(props) => {
                                setShowEmojiPicker(false);
                                setNewMessage(newMessage + props.emoji);
                            }}
                        />
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="mr-2 flex-1 rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage();
                        }
                    }}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="upload-image"
                />
                <label
                    htmlFor="upload-image"
                    className="mr-2 cursor-pointer text-2xl focus:outline-none"
                >
                    📎
                </label>
                <button
                    onClick={toggleEmojiPicker}
                    className="text-2xl focus:outline-none"
                >
                    😊
                </button>
                <button
                    onClick={handleSendMessage}
                    disabled={loading}
                    className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none"
                >
                    {loading ? 'Sending...' : 'Send'}
                </button>
            </div>
        </div>
    );
};

export default ChatRoom;
