import ChatHeader from "../partials/ChatHeader";
import { Link } from "react-router-dom";

function SettingsLayout({ children }) {
    return (
        <main className="min-h-screen flex flex-col">
            <ChatHeader />
            <div className="h-full grid grid-cols-12">
                <div className="col-span-3 items-center space-y-2">
                    <ul className="flex flex-col p-4 space-y-6">
                        <Link to="/settings/profile" className="">
                            Profile
                        </Link>
                        <Link to="/settings/password" >
                            Password
                        </Link>
                    </ul>
                </div>
               <div className="col-span-9">
               {children}
               </div>
            </div>
        </main>
    );
}

export default SettingsLayout;
