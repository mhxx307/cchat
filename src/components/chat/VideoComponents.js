import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
    LocalUser,
    RemoteUser,
    useJoin,
    useLocalCameraTrack,
    useLocalMicrophoneTrack,
    usePublish,
    useRemoteAudioTracks,
    useRemoteUsers,
} from 'agora-rtc-react';

export const ConnectForm = ({ connectToVideo }) => {
    const [channelName, setChannelName] = useState('');
    const [invalidInputMsg, setInvalidInputMsg] = useState('');

    const handleConnect = (e) => {
        // trim spaces
        const trimmedChannelName = channelName.trim();

        // validate input: make sure channelName is not empty
        if (trimmedChannelName === '') {
            e.preventDefault(); // keep the page from reloading on form submission
            setInvalidInputMsg("Channel name can't be empty."); // show warning
            setChannelName(''); // resets channel name value in case user entered blank spaces
            return;
        }

        connectToVideo(trimmedChannelName);
    };

    return (
        <form onSubmit={handleConnect}>
            {/* <img src={logo} className="logo" alt="logo" /> */}
            <div className="card">
                <input
                    id="channelName"
                    type="text"
                    placeholder="Channel Name"
                    value={channelName}
                    onChange={(e) => {
                        setChannelName(e.target.value);
                        setInvalidInputMsg(''); // clear the error message
                    }}
                />
                <button>Connect</button>
                {invalidInputMsg && (
                    <p style={{ color: 'red' }}> {invalidInputMsg} </p>
                )}
            </div>
        </form>
    );
};

export const LiveVideo = () => {
    const appId = '09fb9fed08b346c7aabdf141f45ad627';
    // const agoraEngine = useRTCClient( AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })); // Initialize Agora Client
    const { channelName } = useParams(); //pull the channel name from the param

    // set the connection state
    const [activeConnection, setActiveConnection] = useState(true);

    // track the mic/video state - Turn on Mic and Camera On
    const [micOn, setMic] = useState(true);
    const [cameraOn, setCamera] = useState(true);

    // get local video and mic tracks
    const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
    const { localCameraTrack } = useLocalCameraTrack(cameraOn);

    // to leave the call
    const navigate = useNavigate();

    // Join the channel
    useJoin(
        {
            appid: appId,
            channel: channelName,
            token: null,
        },
        activeConnection,
    );

    usePublish([localMicrophoneTrack, localCameraTrack]);

    //remote users
    const remoteUsers = useRemoteUsers();
    const { audioTracks } = useRemoteAudioTracks(remoteUsers);

    // play the remote user audio tracks
    audioTracks.forEach((track) => track.play());

    return (
        <>
            <div id="remoteVideoGrid">
                {remoteUsers.map((user) => (
                    <div key={user.uid} className="remote-video-container">
                        <RemoteUser user={user} />
                    </div>
                ))}
            </div>
            <div id="localVideo">
                <LocalUser
                    audioTrack={localMicrophoneTrack}
                    videoTrack={localCameraTrack}
                    cameraOn={cameraOn}
                    micOn={micOn}
                    playAudio={micOn}
                    playVideo={cameraOn}
                    className=""
                />
                <div id="controlsToolbar">
                    <div id="mediaControls">
                        <button
                            className={`control-btn ${micOn ? 'active' : ''}`}
                            onClick={() => setMic(!micOn)}
                        >
                            Mic
                        </button>
                        <button
                            className={`control-btn ${cameraOn ? 'active' : ''}`}
                            onClick={() => setCamera(!cameraOn)}
                        >
                            Camera
                        </button>
                    </div>
                    <button
                        id="endConnection"
                        onClick={() => {
                            setActiveConnection(false);
                            navigate('/');
                        }}
                    >
                        Disconnect
                    </button>
                </div>
            </div>
        </>
    );
};
