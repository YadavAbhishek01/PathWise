import {  LogOut, Plus, Trash } from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Aicontext } from "../context/Aicontext";
import { Authcontext } from "../context/Auth.context";

function Sidebar({ onNavigate }) {
  const { getUserRoadmap, userRoadmapData ,deleteUserRoadamp} = useContext(Aicontext);
  const { Logout } = useContext(Authcontext);
  const navigate = useNavigate();
  const [searchparams] = useSearchParams();
  const id = searchparams.get("id");

  useEffect(() => {
    const RoadmapData = async () => {
      await getUserRoadmap();
    };
    RoadmapData();
  }, []);

  const handleLogOut = () => {
    Logout();
    onNavigate?.();
    navigate("/login");
  };

  const handleNavigate = (path) => {
    onNavigate?.();
    navigate(path);
  };
  const handleDelete=async(e,id)=>{
    e.stopPropagation();
    await deleteUserRoadamp(id)
  }
  return (
    <aside className="h-full w-full bg-white md:sticky md:top-0 md:h-screen md:w-[220px]">
      <div className="flex h-full flex-col p-4">
        <div>
          <h1 className="mb-3 px-1 font-['Fraunces'] text-lg text-[#1F2421] md:block hidden">
            PathWise
          </h1>

          <button
            className="mb-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#C98A3E] py-2 text-sm text-[#C98A3E] transition-colors hover:bg-[#C98A3E] hover:text-white"
            type="button"
            onClick={() => handleNavigate("/home")}
          >
            <Plus size={14} /> New roadmap
          </button>

          <p className="mb-1.5 px-1 text-[11px] tracking-wide text-[#B4B2A9]">
            YOUR ROADMAPS
          </p>
        </div>

        <div className="max-h-[220px] flex-1 overflow-y-auto md:max-h-none">
          <div className="flex flex-col gap-0.5">
            {userRoadmapData?.map((item) => {
              const isActive = item._id === id;
              return (
                <div
                  key={item._id}
                  onClick={() => handleNavigate(`/roadmap?id=${item._id}`)}
                  className={` relative group mb-2 flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#F5F3ED] text-[#1F2421]"
                      : "text-[#6B756E] hover:bg-[#F5F3ED]"
                  }`}
                >
                  <span className="truncate">{item.topic.toUpperCase()}</span>
                  <Trash size={15} onClick={(e)=>handleDelete(e,item._id)} className="absolute top-2 right-2 cursor-pointer opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"/>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-[#E8E6DF] pt-3">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-[#6B756E] transition-colors hover:bg-[#F5F3ED] hover:text-red-500"
            onClick={handleLogOut}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
