import { Link } from "react-router-dom";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { HiSun, HiMoon } from "react-icons/hi";
import { CiSettings } from "react-icons/ci";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";

function ChatHeader() {
    const { isDarkMode, toggleDarkMode } = useTheme();
    const { setUserVerified } = useAuth();

    const handleLogout = () => {
        setUserVerified(null);
    };

    return (
        <header className={`${isDarkMode ? "text-white bg-black" : "text-black bg-white"} p-4`}>
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-semibold">
                    <Link to="/">Website Name</Link>
                </h1>
                <nav>
                    <ul className="flex space-x-4 items-center">
                        <li className="cursor-pointer" onClick={toggleDarkMode}>
                            {isDarkMode ? (
                                <HiSun className="inline-block" size={24} />
                            ) : (
                                <HiMoon className="inline-block" size={24} />
                            )}
                        </li>

                        {/* sett */}
                        <li className="cursor-pointer">
                            <Link to="/settings">
                                <CiSettings size={24} />
                            </Link>
                        </li>

                        <li className="cursor-pointer" onClick={handleLogout}>
                            <RiLogoutBoxRLine className="inline-block" size={24} />
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default ChatHeader;
