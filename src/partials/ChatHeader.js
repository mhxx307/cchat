import { Link } from "react-router-dom";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { HiSun } from "react-icons/hi2";

function ChatHeader() {
    return (
        <header className="bg-gray-700 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-semibold">
                    <Link to="/" className="text-white">
                        Website Name
                    </Link>
                </h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li className="cursor-pointer">
                            <HiSun className="inline-block" size={24} />
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
