import { useRouteElements } from './routes';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AgoraRTC, { AgoraRTCProvider, useRTCClient } from 'agora-rtc-react';
import { ConnectForm, LiveVideo } from './components/chat/VideoComponents';

function App() {
    const routeElements = useRouteElements();
    const navigate = useNavigate();
    const agoraClient = useRTCClient(
        AgoraRTC.createClient({ codec: 'vp8', mode: 'rtc' }),
    ); // Initialize Agora Client

    const handleConnect = (channelName) => {
        navigate(`/via/${channelName}`); // on form submit, navigate to new route
    };

    return (
        <div>
            <Routes>
                <Route
                    path="/connect"
                    element={<ConnectForm connectToVideo={handleConnect} />}
                />
                <Route
                    path="/via/:channelName"
                    element={
                        <AgoraRTCProvider client={agoraClient}>
                            <LiveVideo />
                        </AgoraRTCProvider>
                    }
                />
            </Routes>
            {routeElements}
        </div>
    );
}

export default App;
