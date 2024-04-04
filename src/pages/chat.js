import ChatRoom from '~/components/chat/ChatRoom';
import Sidebar from '~/components/chat/Sidebar';
import { useChat } from '~/hooks/useChat';

function ChatPage() {
    const { selectedRoom, isSidebarVisible } = useChat();

    const renderChatRoom = () => {
        return (
            <div
                className={`flex-1 p-4 md:p-8 ${isSidebarVisible ? 'w-full md:pl-[270px] lg:pl-[270px]' : 'w-full'}`}
            >
                {selectedRoom ? (
                    <ChatRoom />
                ) : (
                    <div className="text-center text-gray-600">
                        Select a user or group from the sidebar to start
                        chatting.
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-1 flex-col md:flex-row">
            <Sidebar />
            {renderChatRoom()}
        </div>
    );
}

export default ChatPage;
