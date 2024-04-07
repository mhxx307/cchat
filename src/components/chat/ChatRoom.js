import { useEffect, useRef, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { useAuth } from '~/hooks/useAuth';
import chatService from '~/services/chatService';
import socket from '~/configs/socket';
import { useChat } from '~/hooks/useChat';
import MessageItem from './MessageItem';
import GroupProfileModal from './GroupProfileModal';
import Modal from 'react-responsive-modal';

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
            if (newMessage.trim() === '') {
                return;
            }

            if (selectedRoom.type === '1v1') {
                const receiverId = selectedRoom.members.find(
                    (member) => member._id !== userVerified._id,
                );

                const response = await chatService.sendMessage({
                    senderId: userVerified._id,
                    receiverId: receiverId,
                    content: newMessage,
                    images: [],
                    roomId: selectedRoom._id,
                });

                setMessages([...messages, response]);
                setNewMessage('');

                socket.emit('send-message', {
                    savedMessage: response,
                });
            } else if (selectedRoom.type === 'group') {
                const response = await chatService.sendMessage({
                    senderId: userVerified._id,
                    content: newMessage,
                    images: [],
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log('file:', file);
    };

    const handleReply = (message) => {
        setIsReplying(true);
        setReplyingMessage(message._id);
        console.log('Reply message:', message);
    };

    const handleDelete = (message) => {
        console.log('Delete message:', message);
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
                        <MessageItem
                            key={message._id}
                            message={message}
                            onReply={handleReply}
                            onDelete={handleDelete}
                        />
                    ))}
                <div ref={messagesEndRef} />
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
