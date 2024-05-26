import ChatRoom from '~/components/chat/ChatRoom';
import IncomingCall from '~/components/chat/IncomingCall';
import Sidebar from '~/components/chat/Sidebar';
import { useChat } from '~/hooks/useChat';
import { useVideoCall } from '~/hooks/useVideoCall';
import Modal from 'react-responsive-modal';
import { useEffect } from 'react';
import socket from '~/configs/socket';
import chatService from '~/services/chatService';
import { FaSpinner, FaPhoneSlash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
// import { FaSpinner } from 'react-icons/fa';

function ChatPage() {
    const { selectedRoom, isSidebarVisible } = useChat();
    const {
        showIncomingCall,
        handleAcceptCall,
        handleRejectCall,
        onCloseModal,
        showIsCalling,
        onCloseModalIsCalling,
        recipient,
    } = useVideoCall();
    const { setSelectedRoom, fetchUpdatedRooms } = useChat();

    const { t } = useTranslation();

    console.log('recipient:', recipient);
    console.log('showIsCalling:', showIsCalling);

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
                className={`flex-1 ${isSidebarVisible ? 'w-full md:pl-[270px] lg:pl-[270px]' : 'w-full'}`}
            >
                {selectedRoom ? (
                    <ChatRoom />
                ) : (
                    <div className="text-center text-gray-600">
                        {`${t('top')}`}
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
                <div className="flex h-[500px] w-[500px] flex-col items-center justify-center rounded-lg bg-green-500 p-4 text-white shadow-lg">
                    <p className="mb-4 text-2xl font-bold">
                        Calling {recipient?.username}...
                    </p>
                    <FaSpinner className="mb-4 animate-spin text-4xl" />
                    {/* <button
                        onClick={handleRejectCall}
                        className="flex items-center rounded-full bg-red-500 px-4 py-2 font-bold text-white transition duration-300 hover:bg-red-600"
                    >
                        <FaPhoneSlash className="mr-2" /> Cancel Call
                    </button> */}
                </div>
            </Modal>
            <Sidebar />
            {renderChatRoom()}
        </div>
    );
}

export default ChatPage;
