import React from 'react';
import { useVideoCall } from '~/hooks/useVideoCall';

const IncomingCall = ({ onAccept, onReject }) => {
    const { caller } = useVideoCall();
    console.log('Incoming call from:', caller);
    return (
        <div className="h-[500px] w-[500px] bg-green-500 text-white">
            <p>{caller.username} is calling...</p>
            <button onClick={onAccept}>Accept</button>
            <button onClick={onReject}>Reject</button>
        </div>
    );
};

export default IncomingCall;
