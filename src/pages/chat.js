import { useEffect, useState } from "react";
import ChatRoom from "../components/ChatRoom";
// import unorm from "unorm";
import { useChat } from "../hooks/useChat";
import userService from "../services/userService";
import chatService from "../services/chatService";
import { useAuth } from "../hooks/useAuth";

function ChatPage() {
    const { selectedRoom, isSidebarVisible } = useChat();

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
            <Sidebar />
            {renderChatRoom()}
        </div>
    );
}

export default ChatPage;

const Sidebar = () => {
    const { userVerified } = useAuth();
    const { selectedRoom, setSidebarVisibility, isSidebarVisible, setSelectedRoom, currentChatList } = useChat();
    const [searchTermUser, setSearchTermUser] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        // Fetch users when searchTermUser changes
        const fetchUsers = async () => {
            if (searchTermUser.trim() !== "") {
                try {
                    const result = await userService.getUsersByNameAndPhoneNumber(searchTermUser);
                    console.log("Fetched users:", result);
                    setSearchResults(result);
                } catch (error) {
                    console.error("Error fetching users:", error);
                }
            } else {
                setSearchResults([]);
            }
        };

        fetchUsers();
    }, [searchTermUser]);

    const handleUserSelect = async (user) => {
        // Handle selecting a user, for example, start a new chat with the selected user
        console.log("Selected user:", user);
        const chat = await chatService.start1v1Chat({
            senderId: userVerified._id,
            receiverId: user._id,
            message: "Hello!",
        });

        console.log("Started 1v1 chat:", chat);

        // Fetch chat list
        // setSelectedRoom(chat);
    };

    const handleRoomSelect = (room) => {
        setSelectedRoom(room);
    };

    const toggleSidebar = () => {
        setSidebarVisibility(!isSidebarVisible);
    };

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

            <div className="mb-4">
                <input
                    type="text"
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                    placeholder="Search"
                    value={searchTermUser}
                    onChange={(e) => setSearchTermUser(e.target.value)}
                />
                <ul>
                    {searchResults.map((user, index) => (
                        <li key={user._id} onClick={() => handleUserSelect(user)}>
                            {user.username}
                        </li>
                    ))}
                </ul>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Chat Rooms</h2>
            <ul>
                {currentChatList.map((room, index) => (
                    <li
                        key={index}
                        className={`cursor-pointer py-2 px-4 mb-2 rounded ${
                            selectedRoom && selectedRoom._id === room._id
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "hover:bg-gray-700"
                        }`}
                        onClick={() => handleRoomSelect(room)}
                    >
                        {room.receiver.username}
                    </li>
                ))}
            </ul>
        </div>
    );
};
