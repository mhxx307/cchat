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
        <section
            className="flex flex-1 items-center justify-center bg-gray-100"
            style={{
                backgroundImage: `url(${process.env.PUBLIC_URL}/bg1.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="mx-auto flex w-[600px] flex-col items-center justify-center px-6 py-8 lg:py-0">
                <h2 className="mb-6 flex items-center text-2xl font-semibold text-white">
                    <img
                        className="mr-2 h-8 w-8"
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                        alt="logo"
                    />
                    Forgot Password
                </h2>
                <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
                    <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Reset your password
                        </h1>
                        <form
                            className="space-y-4 md:space-y-6"
                            onSubmit={handleSubmit}
                        >
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Email
                                </label>
                                <input
                                    className="focus:border-primary-500 w-full rounded border-2 border-gray-200 p-3 outline-none"
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ForgotPasswordPage;
