import { useEffect, useRef, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { useAuth } from '~/hooks/useAuth';
import chatService from '~/services/chatService';
import socket from '~/configs/socket';
import { useChat } from '~/hooks/useChat';
import MessageItem from './MessageItem';

const ChatRoom = () => {
    const { selectedRoom, fetchUpdatedRooms } = useChat();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const { userVerified } = useAuth();
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    console.log('selected room:', selectedRoom);
    console.log('messages:', messages);

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

    return (
        <div className="chat-room flex h-[80vh] flex-col justify-between rounded-md bg-gray-100 p-4 md:h-full">
            <h2 className="mb-4 text-2xl font-semibold">Chatting in</h2>
            <div className="chat-messages mb-4 max-h-[60vh] flex-1 overflow-y-auto">
                {messages.length > 0 &&
                    messages.map((message) => (
                        <MessageItem key={message._id} message={message} />
                    ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input flex items-center">
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
