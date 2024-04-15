import React from 'react';

const IncomingCall = ({ callerName, onAccept, onReject }) => {
    return (
        <div className="incoming-call">
            <p>{callerName} is calling...</p>
            <button onClick={onAccept}>Accept</button>
            <button onClick={onReject}>Reject</button>
        </div>
    );
};

export default IncomingCall;
