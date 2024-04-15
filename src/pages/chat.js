import ChatRoom from '~/components/chat/ChatRoom';
import IncomingCall from '~/components/chat/IncomingCall';
import Sidebar from '~/components/chat/Sidebar';
import { useChat } from '~/hooks/useChat';
import { useVideoCall } from '~/hooks/useVideoCall';
import Modal from 'react-responsive-modal';

function ChatPage() {
    const { selectedRoom, isSidebarVisible } = useChat();
    const {
        showIncomingCall,
        handleAcceptCall,
        handleRejectCall,
        onCloseModal,
        showIsCalling,
        onCloseModalIsCalling,
    } = useVideoCall();

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
            <Modal open={showIncomingCall} onClose={onCloseModal} center>
                <IncomingCall
                    onAccept={handleAcceptCall}
                    onReject={handleRejectCall}
                />
            </Modal>
            <Modal open={showIsCalling} onClose={onCloseModalIsCalling} center>
                <div className="h-[500px] w-[500px] bg-green-500 text-white">
                    Calling...
                </div>
            </Modal>
            <Sidebar />
            {renderChatRoom()}
        </div>
    );
}

export default ChatPage;
