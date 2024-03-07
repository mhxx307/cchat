import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div className="flex items-center justify-center p-8">
            <div className="rounded bg-white p-8 shadow-md">
                <h2 className="mb-6 text-2xl font-semibold">
                    Welcome to Our Website
                </h2>
                <div className="flex justify-center space-x-4">
                    <Link
                        to={'/login'}
                        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none"
                    >
                        Login
                    </Link>
                    <Link
                        to={'/register'}
                        className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700 focus:outline-none"
                    >
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
