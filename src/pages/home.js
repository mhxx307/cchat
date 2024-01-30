import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
    return (
        <div className="flex justify-center items-center p-8">
            <div className="bg-white p-8 rounded shadow-md">
                <h2 className="text-2xl font-semibold mb-6">Welcome to Our Website</h2>
                <div className="flex justify-center space-x-4">
                    <Link
                        to={"/login"}
                        className="bg-blue-500 text-white px-4 py-2 rounded focus:outline-none hover:bg-blue-700"
                    >
                        Login
                    </Link>
                    <Link
                        to={"/register"}
                        className="bg-green-500 text-white px-4 py-2 rounded focus:outline-none hover:bg-green-700"
                    >
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
