import { useEffect, useRef, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import chatService from '../services/chatService';
import { useAuth } from '../hooks/useAuth';
import socket from '../configs/socket';

const ChatRoom = ({ room }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const { userVerified } = useAuth();
    const messagesEndRef = useRef(null);

    console.log('selected room:', room);

    useEffect(() => {
        // Fetch messages when room changes
        const fetchMessages = async () => {
            if (room) {
                // Fetch messages from the server
                const messages = await chatService.getChatMessages({
                    senderId: room.sender._id,
                    receiverId: room.receiver._id,
                });
                console.log('Fetched messages:', messages);
                setMessages(messages);
            }
        };

        fetchMessages();
    }, [room]);

    useEffect(() => {
        // Listen for new messages
        socket.on('newChat', (data) => {
            console.log('Received new chat:', data);
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            // Clean up
            socket.off('newChat');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    // scroll to the bottom of the chat messages
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;
        const chat = await chatService.start1v1Chat({
            senderId: userVerified._id,
            receiverId: room.receiver._id,
            message: newMessage,
        });
        setMessages((prevMessages) => [...prevMessages, chat]);

        // Emit a message event to the server
        socket.emit('message', chat);

        setNewMessage('');
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    return (
        <div className="chat-room flex h-[80vh] flex-col justify-between rounded-md bg-gray-100 p-4 md:h-full">
            <h2 className="mb-4 text-2xl font-semibold">Chatting in</h2>
            <div className="chat-messages mb-4 max-h-[60vh] flex-1 overflow-y-auto">
                {messages.length > 0 &&
                    messages.map((message, index) =>
                        message.sender._id === userVerified._id ? (
                            <div
                                key={index}
                                className="mb-4 flex flex-col items-end"
                            >
                                <div className="max-w-[60%] rounded-md bg-blue-500 p-2 text-white">
                                    {message.message}
                                </div>
                                <div className="mt-1 text-xs text-gray-500">
                                    {new Date(
                                        message.timestamp,
                                    ).toLocaleString()}
                                </div>
                            </div>
                        ) : (
                            <div
                                key={index}
                                className="mb-4 flex flex-col items-start"
                            >
                                <div className="max-w-[60%] rounded-md bg-gray-300 p-2">
                                    {message.message}
                                </div>
                                <div className="mt-1 text-xs text-gray-500">
                                    {new Date(
                                        message.timestamp,
                                    ).toLocaleString()}
                                </div>
                            </div>
                        ),
                    )}
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
                <button
                    onClick={toggleEmojiPicker}
                    className="text-2xl focus:outline-none"
                >
                    😊
                </button>
                <button
                    onClick={handleSendMessage}
                    className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatRoom;
