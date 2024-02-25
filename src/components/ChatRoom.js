import React, { useEffect, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import chatService from "../services/chatService";
import { useAuth } from "../hooks/useAuth";
import socket from "../configs/socket";

const ChatRoom = ({ room }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const { userVerified } = useAuth();

    console.log("selected room:", room);

    const handleSendMessage = async () => {
        if (newMessage.trim() === "") return;
        await chatService.start1v1Chat({
            senderId: userVerified._id,
            receiverId: room.receiver._id,
            message: newMessage,
        });
        setMessages((prevMessages) => [
            ...prevMessages,
            {
                sender: userVerified,
                receiver: room.receiver,
                message: newMessage,
                timestamp: new Date().toISOString(),
            },
        ]);

        // Emit a message event to the server
        socket.emit("message", {
            sender: userVerified,
            receiver: room.receiver,
            message: newMessage,
            timestamp: new Date().toISOString(),
        });

        setNewMessage("");
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    useEffect(() => {
        // Fetch messages when room changes
        const fetchMessages = async () => {
            if (room) {
                // Fetch messages from the server
                const messages = await chatService.getChatMessages({
                    senderId: room.sender._id,
                    receiverId: room.receiver._id,
                });
                console.log("Fetched messages:", messages);
                setMessages(messages);
            }
        };

        fetchMessages();
    }, [room]);

    useEffect(() => {
        // Listen for new messages
        socket.on("newChat", (data) => {
            console.log("Received new chat:", data);
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            // Clean up
            socket.off("newChat");
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    return (
        <div className="chat-room p-4 flex flex-col justify-between h-[80vh] md:h-full bg-gray-100 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">Chatting in</h2>
            <div className="chat-messages flex-1 overflow-y-auto max-h-[60vh] mb-4">
                {messages.map((message, index) =>
                    message.sender._id === userVerified._id ? (
                        <div key={index} className="flex flex-col items-end mb-4">
                            <div className="bg-blue-500 text-white p-2 rounded-md max-w-[60%]">{message.message}</div>
                            <div className="text-xs text-gray-500 mt-1">
                                {new Date(message.timestamp).toLocaleString()}
                            </div>
                        </div>
                    ) : (
                        <div key={index} className="flex flex-col items-start mb-4">
                            <div className="bg-gray-300 p-2 rounded-md max-w-[60%]">{message.message}</div>
                            <div className="text-xs text-gray-500 mt-1">
                                {new Date(message.timestamp).toLocaleString()}
                            </div>
                        </div>
                    )
                )}
            </div>
            <div className="chat-input flex items-center">
                {showEmojiPicker && (
                    <div className="absolute top-[20%] right-[5%] mt-8">
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
                    className="flex-1 p-2 mr-2 border rounded-md focus:outline-none focus:border-blue-500"
                />
                <button onClick={toggleEmojiPicker} className="text-2xl focus:outline-none">
                    😊
                </button>
                <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatRoom;
