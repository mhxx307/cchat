import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import authService from "../services/authService";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";

function VerifyPasswordPage() {
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const { userForVerified, setUserForVerified } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await authService.verifyOtp(userForVerified.userId, otp);
            console.log("result", result);
            if (result) {
                const resetPasswordResult = await authService.resetPassword(userForVerified.userId, password);
                console.log("reset", resetPasswordResult);
                toast.success(resetPasswordResult.message);
                setUserForVerified(null);
                navigate("/login");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
            console.log(error);
        }
    };

    return (
        <div className="flex justify-center items-center">
            <form className="w-full max-w-md bg-white rounded-lg shadow-md p-6" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h2>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
                        Enter your otp
                    </label>
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderSeparator={<span>-</span>}
                        renderInput={(props) => <input {...props} />}
                        inputStyle="w-12 h-12 text-2xl border rounded focus:outline-none focus:shadow-outline"
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

export default VerifyPasswordPage;
