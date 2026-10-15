import { useContext } from "react"
import { Authcontext } from "../context/Auth.context"
import {Navigate} from 'react-router-dom'
export const PrivateRoute=({children})=>{
    const {user,loading}=useContext(Authcontext)
        if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <p className="text-ink-soft font-body text-sm">Loading...</p>
      </div>
    );
  }

   
  if(!user)
  {
     return <Navigate to={'/login'} replace />
  }
  return children;
}

export const PublicRoutes = ({ children }) => {
  const { user,loading } = useContext(Authcontext);

        if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <p className="text-ink-soft font-body text-sm">Loading...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to={'/home'} replace />
  }
  return children;
}