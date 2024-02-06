import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import authService from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

function VerifyOtp() {
    const [otp, setOtp] = useState("");
    const { userForVerified, setUserForVerified } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await authService.verifyOtp(userForVerified.userId, otp);
            console.log(result);
            toast.success(result.message);
            setUserForVerified(null);
            navigate("/login");
        } catch (error) {
            toast.error("An error occurred. Please try again.");
            console.log(error);
        }
    };

    return (
        <div className="flex justify-center items-center">
            <form className="w-full max-w-md bg-white rounded-lg shadow-md p-6" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-semibold mb-4 text-center">Enter your otp</h2>

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

export default VerifyOtp;
