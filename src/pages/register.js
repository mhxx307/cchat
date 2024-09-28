import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useState } from 'react';
import { InputField, Loading } from '~/components/shared';
import { useAuth } from '~/hooks/useAuth';
import authService from '~/services/authService';

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
    // .matches(
    //     /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
    //     'At least 8 characters must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number Can contain special characters.',
    // ),
    confirmPassword: yup
        .string()
        .required('Please retype your password.')
        .oneOf([yup.ref('password')], 'Your passwords do not match.'),
    username: yup.string().required('Please enter your username'),
});

function RegisterPage() {
    const { handleSubmit, control } = useForm({
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            username: '',
        },
        resolver: yupResolver(schema),
    });
    const { setUserForVerified } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (payload) => {
        // Add registration logic here
        setLoading(true);
        try {
            const result = await authService.register(
                payload.username,
                payload.email,
                payload.password,
            );
            if (result.data) {
                setUserForVerified(result.data);
                toast.success(result.message);
                navigate('/verify-otp');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex flex-1 items-center justify-center bg-gray-100"
            style={{
                backgroundImage: `url(${process.env.PUBLIC_URL}/bg1.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <form
                className="w-full max-w-md rounded-lg bg-white p-6 shadow-md"
                onSubmit={handleSubmit(handleRegister)}
            >
                <h2 className="mb-4 text-center text-2xl font-semibold">
                    Create an Account
                </h2>
                <div className="mb-4">
                    <label
                        className="mb-2 block text-sm font-bold text-gray-700"
                        htmlFor="username"
                    >
                        Username
                    </label>
                    <InputField
                        name="username"
                        control={control}
                        type="username"
                        placeholder="Username"
                        className="focus:border-primary-500 w-full rounded border-2 border-gray-200 p-3 outline-none"
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="mb-2 block text-sm font-bold text-gray-700"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <InputField
                        name="email"
                        control={control}
                        type="email"
                        placeholder="Email"
                        className="focus:border-primary-500 w-full rounded border-2 border-gray-200 p-3 outline-none"
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="mb-2 block text-sm font-bold text-gray-700"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <InputField
                        name="password"
                        control={control}
                        type="password"
                        placeholder="Password"
                        className="focus:border-primary-500 w-full rounded border-2 border-gray-200 p-3 outline-none"
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="mb-2 block text-sm font-bold text-gray-700"
                        htmlFor="password"
                    >
                        Confirm Password
                    </label>
                    <InputField
                        name="confirmPassword"
                        control={control}
                        type="password"
                        placeholder="Confirm Password"
                        className="focus:border-primary-500 w-full rounded border-2 border-gray-200 p-3 outline-none"
                    />
                </div>
                <div className="flex items-center justify-center">
                    <button
                        className={`focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white transition duration-300 hover:bg-blue-700 focus:outline-none ${
                            loading ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                        type="submit"
                    >
                        {loading ? <Loading /> : 'Register'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RegisterPage;
