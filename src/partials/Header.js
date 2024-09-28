// Header.js
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="bg-gray-800 p-4 text-white">
            <div className="container mx-auto flex items-center justify-between">
                <h1 className="text-2xl font-semibold">
                    <Link to="/" className="text-white">
                        CCHAT
                    </Link>
                </h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link to="/" className="hover:text-gray-300">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:text-gray-300">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/services"
                                className="hover:text-gray-300"
                            >
                                Services
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-gray-300">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
