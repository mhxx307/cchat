import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { InputField, Loading } from '~/components/shared';
import { useAuth } from '~/hooks/useAuth';
import authService from '~/services/authService';
import socket from '~/configs/socket';

const schema = yup.object({
    email: yup
        .string()
        .required('Please enter your email')
        .matches(
            /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
            'Incorrect format of email',
        ),
    password: yup
        .string()
        .required('Please enter your password')
        .min(8, 'Password must be at least 8 characters long'),
});

function LoginPage() {
    const navigate = useNavigate();
    const { handleSubmit, control } = useForm({
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            username: '',
        },
        resolver: yupResolver(schema),
    });
    const [loading, setLoading] = useState(false);
    const { setUserVerified } = useAuth();

    const handleLogin = async (payload) => {
        const { email, password } = payload;
        setLoading(true);
        try {
            const result = await authService.login(email, password);

            if (result.user.verify) {
                toast.success('Login successful');
                setUserVerified(result.user);
                socket.emit('join', { userId: result.user._id });
                navigate('/chat');
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error(
                error.response.data.message ||
                    'An error occurred. Please try again.',
            );
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const bgImageStyle = {
        backgroundImage: `url(${process.env.PUBLIC_URL}/bg1.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <section
            className="flex flex-1 items-center justify-center bg-gray-100"
            style={bgImageStyle}
        >
            <div className="mx-auto flex w-[600px] flex-col items-center justify-center px-6 py-8 lg:py-0">
                <Link
                    to="/"
                    className="mb-6 flex items-center text-2xl font-semibold text-white"
                >
                    <img
                        className="mr-2 h-8 w-8"
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                        alt="logo"
                    />
                    CCHAT LOGIN
                </Link>
                <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
                    <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <form
                            className="space-y-4 md:space-y-6"
                            onSubmit={handleSubmit(handleLogin)}
                        >
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Your email
                                </label>
                                <InputField
                                    name="email"
                                    control={control}
                                    type="email"
                                    placeholder="Email"
                                    className="focus:border-primary-500 w-full rounded border-2 border-gray-200 p-3 outline-none"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Password
                                </label>
                                <InputField
                                    name="password"
                                    control={control}
                                    type="password"
                                    pLaceholder="Password"
                                    className="focus:border-primary-500 w-full rounded border-2 border-gray-200 p-3 outline-none"
                                />
                            </div>
                            <div className="bg-primary flex items-center justify-between">
                                <Link
                                    to="/forgot-password"
                                    className="text-primary-600 dark:text-primary-500 text-sm font-medium hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <button
                                type="submit"
                                className={`bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 ${
                                    loading
                                        ? 'cursor-not-allowed opacity-50'
                                        : ''
                                }`}
                            >
                                {loading ? <Loading /> : 'Sign in'}
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don’t have an account yet?{' '}
                                <Link
                                    to="/register"
                                    className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default LoginPage;
