import ChatRoom from '~/components/chat/ChatRoom';
import IncomingCall from '~/components/chat/IncomingCall';
import Sidebar from '~/components/chat/Sidebar';
import { useChat } from '~/hooks/useChat';
import { useVideoCall } from '~/hooks/useVideoCall';
import Modal from 'react-responsive-modal';
import { useEffect } from 'react';
import socket from '~/configs/socket';
import chatService from '~/services/chatService';

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
    const { setSelectedRoom, fetchUpdatedRooms } = useChat();

    useEffect(() => {
        socket.on('updated-group', async (data) => {
            console.log('Received updated group:', data);
            fetchUpdatedRooms();

            // updated selected room for modal real time
            if (selectedRoom?._id === data._id) {
                const response = await chatService.getChatroomById(data._id);
                setSelectedRoom(response);
            }
        });

        return () => {
            socket.off('updated-group');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

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
