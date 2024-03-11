import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { toast } from 'react-toastify';
import { useAuth } from '~/hooks/useAuth';
import authService from '~/services/authService';

function VerifyOtp() {
    const [otp, setOtp] = useState('');
    const { userForVerified, setUserForVerified } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await authService.verifyOtp(
                userForVerified.userId,
                otp,
            );
            console.log(result);
            toast.success(result.message);
            setUserForVerified(null);
            navigate('/login');
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
                    Enter your otp
                </h2>

                <div className="mb-4 flex justify-center">
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderSeparator={<span>-</span>}
                        renderInput={(props) => <input {...props} />}
                        inputStyle="w-12 h-12 text-2xl border rounded focus:outline-none focus:shadow-outline"
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

export default VerifyOtp;
