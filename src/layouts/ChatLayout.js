import ChatHeader from '../partials/ChatHeader';

function ChatLayout({ children }) {
    return (
        <main className="flex min-h-screen flex-col">
            <ChatHeader />
            <div className="flex flex-1 flex-col justify-center bg-[#e0e8ef]">
                {children}
            </div>
        </main>
    );
}

export default ChatLayout;
