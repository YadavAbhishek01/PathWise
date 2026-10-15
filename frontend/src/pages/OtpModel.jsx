import { useContext, useState } from "react";
import { Authcontext } from "../context/Auth.context";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Otp({ email }) {
  const { VerifyEmail } = useContext(Authcontext);
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading,setLoading]=useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("6 digit ka OTP daalo");
      return;
    }
    try {
      setLoading(true)
      const success = await VerifyEmail({ email, otp });
    if (success) {
      localStorage.removeItem("otpModel");
      localStorage.removeItem("otpEmail");
      navigate("/home");
    }
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
    
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Verify your email</h2>
        <p className="mt-1.5 mb-6 text-sm text-slate-500">
          Enter the 6-digit code we sent to{" "}
          <span className="font-medium text-slate-700">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            inputMode="numeric"
            autoFocus
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="······"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-center text-2xl font-semibold tracking-[0.5em] text-slate-900 outline-none placeholder-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white ${
              loading ? "cursor-not-allowed bg-teal-400" : "bg-teal-700 hover:bg-teal-800"
            }`}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <div className="mt-6 space-y-2 text-center text-sm text-slate-500">
          <p>
            Didn't get the code?{" "}
            <button type="button" className="font-medium text-teal-700 hover:underline">
              Resend code
            </button>
          </p>
          <p className="text-slate-400">You can request a new code in 00:30</p>
        </div>
      </div>
    </div>
  );
}