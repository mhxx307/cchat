import { useState } from 'react';
import { BsTelephoneFill, BsFillShieldLockFill } from 'react-icons/bs';
import { CgSpinner } from 'react-icons/cg';
import PhoneInput from 'react-phone-input-2';
import { toast } from 'react-toastify';
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import OtpInput from 'react-otp-input';
import { auth } from '../configs/firebase';
import authService from '../services/authService';

import 'react-phone-input-2/lib/style.css';

const PhoneLogin = () => {
    const [otp, setOtp] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [user, setUser] = useState(null);

    const sendOtp = async () => {
        console.log('phone', phone); // log: 84788778579
        try {
            setShowOTP(true);
            setLoading(true);
            const recaptchaVerifier = new RecaptchaVerifier(
                auth,
                'recaptcha',
                {},
            );
            const phoneNumber = `+${phone}`;
            const confirmation = await signInWithPhoneNumber(
                auth,
                phoneNumber,
                recaptchaVerifier,
            );

            setUser(confirmation);
            console.log('confirmation', confirmation);
            toast.success('OTP sent to your phone');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        try {
            setLoading(true);
            const data = await user.confirm(otp);
            console.log('data', data);
            // add user to database
            await authService.register();

            toast.success('OTP verified successfully');
        } catch (error) {
            console.error(error);
            toast.error('Error verifying OTP code please try again');
            setLoading(false);
        }
    };

    return (
        <section className="flex h-screen items-center justify-center bg-emerald-500">
            <div>
                <div className="flex w-80 flex-col gap-4 rounded-lg p-4">
                    <h1 className="mb-6 text-center text-3xl font-medium leading-normal text-white">
                        Welcome to <br /> ...
                    </h1>
                    {showOTP ? (
                        <>
                            <div className="mx-auto w-fit rounded-full bg-white p-4 text-emerald-500">
                                <BsFillShieldLockFill size={30} />
                            </div>
                            <label
                                htmlFor="otp"
                                className="text-center text-xl font-bold text-white"
                            >
                                Enter your OTP
                            </label>
                            <OtpInput
                                value={otp}
                                onChange={setOtp}
                                numInputs={6}
                                renderSeparator={<span>-</span>}
                                renderInput={(props) => <input {...props} />}
                                inputStyle="w-12 h-12 text-2xl border rounded focus:outline-none focus:shadow-outline"
                            />
                            <button
                                onClick={handleVerifyOTP}
                                className="flex w-full items-center justify-center gap-1 rounded bg-emerald-600 py-2.5 text-white"
                            >
                                {loading && (
                                    <CgSpinner
                                        size={20}
                                        className="mt-1 animate-spin"
                                    />
                                )}
                                <span>Verify OTP</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <div id="recaptcha"></div>
                            <div className="mx-auto w-fit rounded-full bg-white p-4 text-emerald-500">
                                <BsTelephoneFill size={30} />
                            </div>
                            <label
                                htmlFor=""
                                className="text-center text-xl font-bold text-white"
                            >
                                Verify your phone number
                            </label>
                            <PhoneInput
                                country={'vn'}
                                value={phone}
                                onChange={setPhone}
                            />
                            <button
                                onClick={sendOtp}
                                className="flex w-full items-center justify-center gap-1 rounded bg-emerald-600 py-2.5 text-white"
                            >
                                {loading && (
                                    <CgSpinner
                                        size={20}
                                        className="mt-1 animate-spin"
                                    />
                                )}
                                <span>Send code via SMS</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PhoneLogin;
