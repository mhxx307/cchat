import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";

const ChatRoom = ({ room }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleSendMessage = () => {
        if (newMessage.trim() === "") return;

        setMessages((prevMessages) => [...prevMessages, { text: newMessage, user: "You" }]);

        setNewMessage("");
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    return (
        <div className="chat-room p-4 flex flex-col justify-between h-[80vh] md:h-full bg-gray-100 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">Chatting in {room}</h2>
            <div className="chat-messages flex-1 overflow-y-auto max-h-[60vh] mb-4">
                {messages.map((message, index) => (
                    <div key={index} className="message mb-4 flex items-start">
                        <img
                            src={`https://avatars.dicebear.com/api/bottts/${message.user}.svg`}
                            alt="Avatar"
                            className="w-8 h-8 rounded-full mr-2"
                        />
                        <div className="flex flex-col">
                            <div>
                                <span className="message-user font-bold">{message.user}</span>{" "}
                                <span className="message-text">{message.text}</span>{" "}
                            </div>
                        </div>
                    </div>
                ))}
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
