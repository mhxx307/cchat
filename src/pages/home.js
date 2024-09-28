import { Link } from 'react-router-dom';

function HomePage() {
    const bgImageStyle = {
        backgroundImage: `url(${process.env.PUBLIC_URL}/bg1.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <div
            className="flex flex-1 items-center justify-center bg-gray-100"
            style={bgImageStyle}
        >
            <div
                style={{ height: '100%' }}
                className="rounded-lg bg-white p-10 shadow-lg transition-shadow duration-300 hover:shadow-xl"
            >
                <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">
                    CChat
                </h2>
                <div className="flex justify-center space-x-6">
                    <Link
                        to={'/login'}
                        className="rounded-lg bg-blue-600 px-6 py-3 text-white transition duration-200 hover:bg-blue-700 focus:outline-none"
                    >
                        Login
                    </Link>
                    <Link
                        to={'/register'}
                        className="rounded-lg bg-green-600 px-6 py-3 text-white transition duration-200 hover:bg-green-700 focus:outline-none"
                    >
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
