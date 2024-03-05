import { useEffect, useRef, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import chatService from '../services/chatService';
import { useAuth } from '../hooks/useAuth';
import socket from '../configs/socket';
import FallbackAvatar from './FallbackAvatar';

function GroupChatRoom({ selectedRoom }) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { userVerified } = useAuth();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const result = await chatService.getGroupChatMessages({
                    groupId: selectedRoom.group._id,
                });
                console.log('Fetched messages:', result);
                setMessages(result); // Assuming the messages are returned as an array
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        fetchMessages();
    }, [selectedRoom]);

    useEffect(() => {
        socket.on('newChatGroup', (data) => {
            console.log('Received new chat:', data);
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.off('newChatGroup');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        try {
            if (newMessage.trim() === '') return;
            const chat = await chatService.startGroupChat({
                groupId: selectedRoom.group._id,
                message: newMessage,
                senderId: userVerified._id,
            });
            setMessages([...messages, chat]);
            socket.emit('messageChatGroup', chat);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleFileChange = (e) => {
        // Handle file upload logic here
        const file = e.target.files[0];
        console.log('Uploaded file:', file);
    };

    console.log('Messages:', messages);

    return (
        <div className="chat-room flex h-[80vh] flex-col justify-between rounded-md bg-gray-100 p-4 md:h-full">
            <h2 className="mb-4 text-2xl font-semibold">Group Chat Room</h2>
            <div className="chat-messages mb-4 max-h-[60vh] flex-1 overflow-y-auto">
                {messages.length > 0 &&
                    messages.map((message, index) =>
                        message.sender._id === userVerified._id ? (
                            <div
                                key={message._id}
                                className="mb-4 flex justify-end"
                            >
                                {/* messages */}
                                <div className="mr-4 max-w-[60%]">
                                    <div className="rounded-md bg-blue-500 p-2 text-white">
                                        {message.message}
                                    </div>
                                    <div className="mt-1 text-xs text-gray-500">
                                        {new Date(
                                            message.timestamp,
                                        ).toLocaleString()}
                                    </div>
                                </div>

                                {/* sender's profile pic */}
                                {message.sender.profilePic ? (
                                    <img
                                        src={message.sender.profilePic}
                                        alt="Avatar"
                                        className="h-6 w-6 rounded-full"
                                    />
                                ) : (
                                    <FallbackAvatar
                                        name={message.sender.username}
                                    />
                                )}
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
                    className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default GroupChatRoom;
