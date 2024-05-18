import React from 'react';
import { useVideoCall } from '~/hooks/useVideoCall';
import { FaPhoneAlt, FaPhoneSlash } from 'react-icons/fa';

const IncomingCall = ({ onAccept, onReject }) => {
    const { caller } = useVideoCall();
    console.log('Incoming call from:', caller);

    return (
        <div className="flex h-[500px] w-[500px] flex-col items-center justify-center rounded-lg bg-green-500 p-4 text-white shadow-lg">
            <p className="mb-4 text-2xl font-bold">
                {caller?.username} is calling...
            </p>
            <div className="flex space-x-4">
                <button
                    onClick={onAccept}
                    className="flex items-center rounded-full bg-blue-500 px-4 py-2 font-bold text-white transition duration-300 hover:bg-blue-600"
                >
                    <FaPhoneAlt className="mr-2" /> Accept
                </button>
                <button
                    onClick={onReject}
                    className="flex items-center rounded-full bg-red-500 px-4 py-2 font-bold text-white transition duration-300 hover:bg-red-600"
                >
                    <FaPhoneSlash className="mr-2" /> Reject
                </button>
            </div>
        </div>
    );
};

export default IncomingCall;
