import { createContext, useEffect, useState } from "react";
import { axiosInstants, isTokenExpire } from "../units/axios.instants";
import toast from "react-hot-toast";

export const Authcontext = createContext();
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  useEffect(() => {
    const loadUser = async () => {
      if (!token || isTokenExpire(token)) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setLoading(false);
        return;
      }

      // Token valid hai — backend se current user ki details mangwao
      try {
        const res = await axiosInstants.get("/auth/getme");
        if (res.data.success) {
          setUser(res.data.data);
        } else {
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.log(error);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);
  const Login = async (data) => {
    try {
      const res = await axiosInstants.post("/auth/signin", data);
      if (res.data.isVerify && res.data.success) {
        toast.success("login successful");
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setUser(res.data.data);
        return true;
      } else {
        toast.error(res.data.message || "failed to login");
      }
    } catch (error) {
      console.log(error.response.data?.message);
      toast.error(error.response.data?.message);
    }
  };
  const SignUp = async (data) => {
    try {
      const res = await axiosInstants.post("/auth/signup", data);
      if (res.data.success) {
        toast.success("Vefication code send to your email");
        return true;
      } else {
        toast.error(res.data.message || "failed to login");
      }
    } catch (error) {
      toast.error(error.response.data?.message);
    }
  };

  const VerifyEmail = async (data) => {
    try {
      const res = await axiosInstants.post("/auth/verify-email", data);
      if (res.data.success) {
        toast.success("Email verify successfully");
        return true;
      } else {
        toast.error(res.data.message || "failed to verify");
      }
    } catch (error) {
      console.log(error.response.data?.message);
      toast.error(error.response.data?.message);
    }
  };
  const Logout=()=>{
    setToken(null)
    localStorage.clear();
    setUser(null)
  }
  const values = { SignUp, loading, VerifyEmail, Login, user,Logout };
  return <Authcontext.Provider value={values}>{children}</Authcontext.Provider>;
};
