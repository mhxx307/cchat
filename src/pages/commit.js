import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

function CommitPage() {
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    };

    return (
        <div className="flex justify-center items-center">
            <form className="w-full max-w-md bg-white rounded-lg shadow-md p-6" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h2>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
                        Otp
                    </label>
                    <input
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:shadow-outline"
                        type="otp"
                        id="otp"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        placeholder="Enter OTP sent to your email"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
                        Email
                    </label>
                    <input
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:shadow-outline"
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter OTP sent to your email"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
                        New password
                    </label>
                    <input
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:shadow-outline"
                        type="password"
                        id="password"
                        name="email"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter PASSWORD sent to your email"
                    />
                </div>

                <div className="flex items-center justify-center">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CommitPage;
