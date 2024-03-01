// import { useState } from "react";
// import { BsTelephoneFill } from "react-icons/bs";
// import { BsFillShieldLockFill } from "react-icons/bs";
// import { CgSpinner } from "react-icons/cg";
// import 'react-phone-input-2/lib/style.css';
// import OtpInput from "otp-input-react";
// import PhoneInput from "react-phone-input-2";
// import {toast} from "react-toastify";
// import { signInWithPhoneNumber } from "firebase/auth";
// import { auth , app } from "../configs/firebase";
// // import firebase
// import firebase from "firebase/compat/app";

const PhoneLogin = () => {
    // const [otp, setOtp] = useState("");
    // const [ph, setPh] = useState("");
    // const [loading, setLoading] = useState(false);
    // const [showOTP, setShowOTP] = useState(false);
    // const [user, setUser] = useState(null);

    // function onCaptchVerify() {
    //     if (!window.recaptchaVerifier) {
    //         window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    //             "recaptcha-container",
    //             {
    //                 size: "invisible",
    //             },
    //             app
    //         )
    //     }
    // }

    // function onSignup() {
    //     setLoading(true);
    //     onCaptchVerify();

    //     const appVerifier = window.recaptchaVerifier;

    //     const formatPh = "+" + ph;

    //     signInWithPhoneNumber(auth, formatPh, appVerifier)
    //         .then((confirmationResult) => {
    //             window.confirmationResult = confirmationResult;
    //             setLoading(false);
    //             setShowOTP(true);
    //             toast.success("OTP sended successfully!");
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //             setLoading(false);
    //         });
    // }

    // function onOTPVerify() {
    //     setLoading(true);
    //     window.confirmationResult
    //         .confirm(otp)
    //         .then(async (res) => {
    //             console.log(res);
    //             setUser(res.user);
    //             setLoading(false);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             setLoading(false);
    //         });
    // }

    // return (
    //     <section className="bg-emerald-500 flex items-center justify-center h-screen">
    //         <div>
    //             <div id="recaptcha-container"></div>
    //             {user ? (
    //                 <h2 className="text-center text-white font-medium text-2xl">
    //                     👍Login Success
    //                 </h2>
    //             ) : (
    //                 <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
    //                     <h1 className="text-center leading-normal text-white font-medium text-3xl mb-6">
    //                         Welcome to <br /> CODE A PROGRAM
    //                     </h1>
    //                     {showOTP ? (
    //                         <>
    //                             <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
    //                                 <BsFillShieldLockFill size={30} />
    //                             </div>
    //                             <label
    //                                 htmlFor="otp"
    //                                 className="font-bold text-xl text-white text-center"
    //                             >
    //                                 Enter your OTP
    //                             </label>
    //                             <OtpInput
    //                                 value={otp}
    //                                 onChange={setOtp}
    //                                 OTPLength={6}
    //                                 otpType="number"
    //                                 disabled={false}
    //                                 autoFocus
    //                                 className="opt-container "
    //                             ></OtpInput>
    //                             <button
    //                                 onClick={onOTPVerify}
    //                                 className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
    //                             >
    //                                 {loading && (
    //                                     <CgSpinner size={20} className="mt-1 animate-spin" />
    //                                 )}
    //                                 <span>Verify OTP</span>
    //                             </button>
    //                         </>
    //                     ) : (
    //                         <>
    //                             <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
    //                                 <BsTelephoneFill size={30} />
    //                             </div>
    //                             <label
    //                                 htmlFor=""
    //                                 className="font-bold text-xl text-white text-center"
    //                             >
    //                                 Verify your phone number
    //                             </label>
    //                             <PhoneInput country={"in"} value={ph} onChange={setPh} />
    //                             <button
    //                                 onClick={onSignup}
    //                                 className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
    //                             >
    //                                 {loading && (
    //                                     <CgSpinner size={20} className="mt-1 animate-spin" />
    //                                 )}
    //                                 <span>Send code via SMS</span>
    //                             </button>
    //                         </>
    //                     )}
    //                 </div>
    //             )}
    //         </div>
    //     </section>


    // );

    return (
        <div>hello</div>
    )
}

export default PhoneLogin;