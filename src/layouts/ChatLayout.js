import ChatHeader from "../partials/ChatHeader";

function ChatLayout({ children }) {
    return (
        <main className="min-h-screen flex flex-col">
            <ChatHeader />
            <div className="flex-1 bg-[#e0e8ef] flex flex-col justify-center">{children}</div>
        </main>
    );
}

export default ChatLayout;
