import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '~/hooks/useAuth';
import authService from '~/services/authService';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const { setUserForVerified } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await authService.forgotPassword(email);
            if (result.data) {
                setUserForVerified(result.data);
                toast.success(result.message);
                navigate('/verify-password');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
            console.log(error);
        }
    };

    return (
        <div className="flex items-center justify-center">
            <form
                className="w-full max-w-md rounded-lg bg-white p-6 shadow-md"
                onSubmit={handleSubmit}
            >
                <h2 className="mb-4 text-center text-2xl font-semibold">
                    Forgot Password
                </h2>

                <div className="mb-4">
                    <label
                        className="mb-2 block text-sm font-bold text-gray-700"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <input
                        className="focus:shadow-outline w-full rounded border px-3 py-2 focus:outline-none"
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
                        className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
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
