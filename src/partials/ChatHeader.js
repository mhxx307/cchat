import { Link } from "react-router-dom";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { HiSun, HiMoon } from "react-icons/hi";
import { useTheme } from "../hooks/useTheme";

function ChatHeader() {
    const { isDarkMode, toggleDarkMode } = useTheme();

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

                        <li className="cursor-pointer">
                            <RiLogoutBoxRLine className="inline-block" size={24} />
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default ChatHeader;
