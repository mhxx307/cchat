import React, { useState } from "react";
import ChatRoom from "../components/ChatRoom";

function ChatPage() {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isSidebarVisible, setSidebarVisibility] = useState(true);

    const handleRoomSelect = (room) => {
        setSelectedRoom(room);
    };

    const toggleSidebar = () => {
        setSidebarVisibility(!isSidebarVisible);
    };

    const renderSidebar = () => {
        const chatList = ["User 1", "User 2", "Group 1", "Group 2"];

        return (
            <div
                className={`flex flex-col h-full w-3/4 md:w-[270px] lg:w-[270px] bg-gray-800 text-white p-4 transition-all duration-300 fixed ${
                    isSidebarVisible ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <button
                    className="text-[#000] text-xl focus:outline-none absolute top-1/2 -right-[20px] transform -translate-y-1/2"
                    onClick={toggleSidebar}
                >
                    {isSidebarVisible ? "←" : "→"}
                </button>
                <h2 className="text-2xl font-semibold mb-4">Chat Rooms</h2>
                <ul>
                    {chatList.map((room, index) => (
                        <li
                            key={index}
                            className={`cursor-pointer py-2 px-4 mb-2 rounded ${
                                selectedRoom === room ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-gray-700"
                            }`}
                            onClick={() => handleRoomSelect(room)}
                        >
                            {room}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const renderChatRoom = () => {
        return (
            <div className={`flex-1 p-4 md:p-8 ${isSidebarVisible ? "w-full md:pl-[270px] lg:pl-[270px]" : "w-full"}`}>
                {selectedRoom ? (
                    <>
                        {/* <h2 className="text-2xl font-semibold mb-4">Chatting in {selectedRoom}</h2> */}
                        {/* Add your chat component here */}
                        {/* Example: <ChatRoom room={selectedRoom} /> */}
                        <ChatRoom room={selectedRoom} />
                    </>
                ) : (
                    <div className="text-center text-gray-600">
                        Select a user or group from the sidebar to start chatting.
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col md:flex-row flex-1">
            {renderSidebar()}
            {renderChatRoom()}
        </div>
    );
}

export default ChatPage;
