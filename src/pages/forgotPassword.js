import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const { setUserForVerified } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await authService.forgotPassword(email);
            if (result.data) {
                setUserForVerified(result.data);
                toast.success(result.message);
                navigate("/verify-password");
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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
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

export default ForgotPasswordPage;
