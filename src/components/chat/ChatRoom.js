import { useEffect, useRef, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { useAuth } from '~/hooks/useAuth';
import chatService from '~/services/chatService';
import socket from '~/configs/socket';
import { useChat } from '~/hooks/useChat';
import MessageItem from './MessageItem';
import GroupProfileModal from './GroupProfileModal';
import Modal from 'react-responsive-modal';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '~/configs/firebase';

const ChatRoom = () => {
    const { selectedRoom, fetchUpdatedRooms } = useChat();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const { userVerified } = useAuth();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const messagesEndRef = useRef(null);
    const [img, setImg] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const imageRef = ref(storage);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);

    console.log('selected room:', selectedRoom);
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

    const handleOpenAddGroupModal = () => {
        onOpenModal();
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        setLoading(true);
        try {
            if (newMessage.trim() === '' && !selectedImage) {
                return;
            }

            // Tạo một reference cho ảnh trong Firebase Storage
            let imageUrl = '';
            if (selectedImage) {
                const imageRef = ref(storage, `images/${selectedImage.name}`);
                await uploadBytes(imageRef, selectedImage);
                imageUrl = await getDownloadURL(imageRef);
            }

            // Tạo một đối tượng message chứa thông tin tin nhắn và URL của ảnh (nếu có)
            const message = {
                senderId: userVerified._id,
                content: newMessage,
                images: imageUrl ? [imageUrl] : [],
                roomId: selectedRoom._id,
            };

            // Thêm tin nhắn vào Firestore
            const docRef = await addDoc(collection(db, 'messages'), message);

            // Gửi tin nhắn mới qua socket
            socket.emit('send-message', {
                savedMessage: { ...message, _id: docRef.id },
            });

            // Cập nhật trạng thái
            setLoading(false);
            setNewMessage('');
            setSelectedImage(null);
            fetchUpdatedRooms();
            socket.emit('sort-room', {
                userId: userVerified._id,
            });
        } catch (error) {
            console.error('Error sending message:', error);
            setLoading(false);
        }
    };

    const MAX_FILE_SIZE = 2 * 1024 * 1024;

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

    // Send image message
    const handleSendImage = async () => {
        setLoading(true);
        try {
            if (!img) {
                return;
            }

            if (selectedRoom.type === '1v1') {
                const receiverId = selectedRoom.members.find(
                    (member) => member._id !== userVerified._id,
                );

                const responseImg = await uploadBytes(imageRef, img);
                const url = await getDownloadURL(responseImg.ref);

                const response = await chatService.sendMessage({
                    senderId: userVerified._id,
                    receiverId: receiverId,
                    images: [url],
                    roomId: selectedRoom._id,
                });

                setMessages([...messages, response]);
                setNewMessage('');

                socket.emit('send-message', {
                    savedMessage: response,
                });
            } else if (selectedRoom.type === 'group') {
                const responseImg = await uploadBytes(imageRef, img);
                const url = await getDownloadURL(responseImg.ref);

                const response = await chatService.sendMessage({
                    senderId: userVerified._id,
                    images: [url],
                    roomId: selectedRoom._id,
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
            setLoading(false);
            fetchUpdatedRooms();
            socket.emit('sort-room', {
                userId: userVerified._id,
            });
        }
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleRemoveImage = (index) => {
        const newSelectedImages = [...selectedImages];
        newSelectedImages.splice(index, 1);
        setSelectedImages(newSelectedImages);
    };

    return (
        <div className="flex h-[80vh] flex-col justify-between rounded-md bg-gray-100 px-3 pb-2 md:h-full">
            <div className="">
                {selectedRoom.type === '1v1' && (
                    <h2 className="">Chatting in</h2>
                )}
                {selectedRoom.type === 'group' && (
                    <>
                        <h3 onClick={handleOpenAddGroupModal}>
                            {selectedRoom.name}
                        </h3>
                        <Modal open={open} onClose={onCloseModal} center>
                            <GroupProfileModal />
                        </Modal>
                    </>
                )}
            </div>

            <div className="mb-2 max-h-[60vh] flex-1 overflow-y-auto">
                {messages.length > 0 &&
                    messages.map((message) => (
                        <MessageItem key={message._id} message={message} />
                    ))}
                <div ref={messagesEndRef} />
            </div>
            <div>
                <div className="flex space-x-2">
                    {selectedImages.map((image, index) => (
                        <div key={index} className="relative">
                            <img
                                src={image.preview}
                                alt={`Preview ${index}`}
                                className="h-20 w-20 rounded-md object-cover"
                            />
                            <button
                                className="absolute right-0 top-0 flex items-center justify-center rounded-full p-1 text-xs text-white"
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
                <div className="flex items-end">
                    {showEmojiPicker && (
                        <div className="absolute right-[5%] top-[20%] mt-8">
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
                    />
                    <input
                        type="file"
                        accept="image/*"
                        multiple
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
        </div>
    );
};

export default ChatRoom;
