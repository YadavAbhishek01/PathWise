import { ArrowLeft, Check, LockKeyhole } from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Aicontext } from "../context/Aicontext";

function RoadmapPage() {
  const navigate = useNavigate();
  const [searchparams] = useSearchParams();
  const id = searchparams.get("id");
  const { roadmapData, getRoadmapById, loading } = useContext(Aicontext);

  useEffect(() => {
    if (id) {
      getRoadmapById(id);
    } else {
      navigate("/");
    }
  }, [id]);

  if (loading || !roadmapData) {
    return <p className="p-8 text-center text-[#6B756E]">Loading...</p>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-1 flex items-center gap-1.5 text-sm text-gray-400">
        <ArrowLeft size={20} onClick={() => navigate("/home")} className="cursor-pointer" />
        <p>Back</p>
      </div>

      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="font-['Fraunces'] text-xl text-[#1F2421]">
          {roadmapData?.topic?.toUpperCase()}
        </h2>
        <span className="text-sm text-[#6B756E]">
          {roadmapData?.modules?.length} modules
        </span>
      </div>

      <div className="relative max-w-lg pl-7">
        <div className="absolute bottom-3 left-[11px] top-3 w-0.5 bg-[#E8E6DF]" />

        {roadmapData?.modules?.map((mod) => {
          const isUnlocked =
            mod.status === "completed" ||
            mod.prerequisiteStep.length === 0 ||
            mod.prerequisiteStep.every((preId) => {
              const preModule = roadmapData.modules.find((m) => m.moduleId === preId);
              return preModule?.status === "completed";
            });

          const isCompleted = mod.status === "completed";

          return (
            <div
              key={mod.moduleId}
              onClick={() => isUnlocked && navigate(`/moduledetails/${roadmapData._id}/${mod.moduleId}`)}
              className={`relative mb-4 flex items-center gap-3 rounded-xl border p-3 transition-all ${
                isCompleted
                  ? "cursor-pointer border-emerald-300 bg-emerald-50 hover:border-emerald-500"
                  : isUnlocked
                  ? "cursor-pointer border-sky-300 bg-sky-50 hover:border-[#C98A3E]"
                  : "pointer-events-none select-none border-gray-200 bg-gray-50 opacity-50"
              }`}
            >
              <div
                className={`absolute -left-7 top-3 flex h-[22px] w-[22px] items-center justify-center rounded-lg border ${
                  isCompleted
                    ? "border-emerald-500 bg-emerald-500"
                    : isUnlocked
                    ? "border-sky-400 bg-white"
                    : "border-[#E8E6DF] bg-white"
                }`}
              >
                {isCompleted ? (
                  <Check size={13} className="text-white" />
                ) : !isUnlocked ? (
                  <LockKeyhole size={13} className="text-[#9CA3AF]" />
                ) : (
                  <span className="text-xs font-medium text-sky-600">{mod.moduleId}</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#1F2421]">
                  {mod.moduleId}. {mod.title}
                </p>
                <p className="text-sm text-[#6B756E]">{mod.concept.join(", ")}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RoadmapPage;