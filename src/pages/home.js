import { Link } from 'react-router-dom';
import { useTheme } from '~/hooks/useTheme';

function HomePage() {
    const { themeStyles } = useTheme(); // Access theme styles

    const bgImageStyle = {
        backgroundImage: `url(${process.env.PUBLIC_URL}/bg1.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <div
            className="flex flex-1 items-center justify-center"
            style={{ ...bgImageStyle, backgroundColor: themeStyles.background }} // Apply background color
        >
            <div
                className="rounded-lg p-10 shadow-lg transition-shadow duration-300 hover:shadow-xl"
                style={{ backgroundColor: themeStyles.text, height: '100%' }} // Apply text color as background
            >
                <h2
                    className="mb-8 text-center text-3xl font-bold"
                    style={{ color: 'black' }}
                >
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
