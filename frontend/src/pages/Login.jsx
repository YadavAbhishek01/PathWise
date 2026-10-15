import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Authcontext } from "../context/Auth.context";
import toast from "react-hot-toast";

export default function Login() {
  const { Login } = useContext(Authcontext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("email or password is required");
      return true;
    }
    const data = { email, password };
    try {
      setLoading(true);
      const success = await Login(data);
      if (success) {
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-5 shadow-xl sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Welcome back</h2>
          <p className="mt-1.5 mb-6 text-sm text-slate-500">
            Log in to continue to your account.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-teal-700 hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white ${
                loading
                  ? "cursor-not-allowed bg-teal-400"
                  : "bg-teal-700 hover:bg-teal-800"
              }`}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            New here?{" "}
            <Link to="/signup" className="font-medium text-teal-700 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}