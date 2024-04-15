import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import socket from '~/configs/socket';

const VideoCallContext = createContext();

export const useVideoCall = () => {
    return useContext(VideoCallContext);
};

export const VideoCallProvider = ({ children }) => {
    const { userVerified } = useAuth();
    const [showIncomingCall, setShowIncomingCall] = useState(false);
    const [showIsCalling, setShowIsCalling] = useState(false);
    const [caller, setCaller] = useState(null);
    const navigate = useNavigate();

    const handleCallRequest = (recipient) => {
        // Emit call request event to the server
        socket.emit('call-request', {
            caller: userVerified,
            recipient: recipient,
        });
    };

    useEffect(() => {
        socket.on('call-received', ({ caller }) => {
            // Show incoming call UI when call is received
            setCaller(caller);
            setShowIncomingCall(true);
        });

        return () => {
            socket.off('call-received');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    useEffect(() => {
        socket.on('call-accepted', ({ recipient }) => {
            // navigate to localhost:3000/via/:channelName
            navigate(`/via/${recipient._id}`);
        });

        return () => {
            socket.off('call-accepted');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    const handleAcceptCall = () => {
        // Emit accept call event to the server
        setShowIncomingCall(false);
        // navigate to localhost:3000/via/:channelName
        navigate(`/via/${caller._id}`);

        socket.emit('accept-call', { caller, recipient: userVerified });
    };

    const handleRejectCall = () => {
        // Emit reject call event to the server
        setShowIncomingCall(false);
    };

    const onCloseModal = () => {
        setShowIncomingCall(false);
    };

    const onCloseModalIsCalling = () => {
        setShowIsCalling(false);
    };

    return (
        <VideoCallContext.Provider
            value={{
                showIncomingCall,
                caller,
                handleCallRequest,
                handleAcceptCall,
                handleRejectCall,
                onCloseModal,
                showIsCalling,
                setShowIsCalling,
                onCloseModalIsCalling,
            }}
        >
            {children}
        </VideoCallContext.Provider>
    );
};
