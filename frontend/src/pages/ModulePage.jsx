import { ArrowLeft, Download, ArrowRight, Check, Copy, Loader2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Aicontext } from "../context/Aicontext";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import toast from "react-hot-toast";

function ModulePage() {
  const { generateModule, moduleData, markModuleComplete } = useContext(Aicontext);
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);
  const [completing, setCompleting] = useState(false);  
  const { roadmapId, moduleId } = useParams();

  const handleStatus = async () => {
    try {
      setCompleting(true);
      const success = await markModuleComplete(roadmapId, moduleId);
      if (success) {
        navigate(`/roadmap?id=${roadmapId}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
      setCompleting(false);
    }
  };

  useEffect(() => {
    const loadModule = async () => {
      try {
        setPageLoading(true);
        await generateModule(roadmapId, moduleId);
      } finally {
        setPageLoading(false);
      }
    };

    if (roadmapId && moduleId) {
      loadModule();
    }
  }, [roadmapId, moduleId]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
  };

  if (!roadmapId || !moduleId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-8">
        <p className="text-sm text-[#6B756E]">roadmapId and moduleId are required.</p>
      </div>
    );
  }

  if (pageLoading
     || !moduleData) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#C98A3E]" />
        <p className="text-sm font-medium text-[#6B756E]">Generating module content...</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6 md:p-8">
      <div
        className="mb-3 flex cursor-pointer items-center gap-1 text-xs text-[#B4B2A9]"
        onClick={() => navigate(`/roadmap?id=${roadmapId}`)}
      >
        <ArrowLeft size={12} /> Back to roadmap
      </div>

      {/* <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="font-['Fraunces'] text-xl text-[#1F2421]">{moduleData.title}</h2>
        <button className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#E8E6DF] px-3 py-1.5 text-sm text-[#1F2421] transition-colors hover:border-[#C98A3E] hover:text-[#C98A3E]">
          <Download size={14} /> Download PDF
        </button>
      </div> */}

      <p className="mb-5 text-sm leading-7 text-[#6B756E]">{moduleData.explanation}</p>

      {moduleData.examples?.length > 0 && (
        <>
          <p className="mb-2 text-sm font-medium text-[#1F2421]">Examples</p>
          <ul className="mb-5 list-disc pl-5 text-sm leading-8 text-[#6B756E]">
            {moduleData.examples.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </>
      )}

      {moduleData.codeSnippets?.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-[#1F2421]">Code</p>
          <div className="flex flex-col gap-3">
            {moduleData.codeSnippets.map((code, i) => {
              const formattedCode = typeof code === "string" ? code.replace(/\\n/g, "\n") : code;

              return (
                <div key={i} className="relative h-auto w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <button
                    onClick={() => handleCopy(formattedCode)}
                    className="absolute right-3 top-3 z-10 rounded-md border border-transparent bg-white p-1.5 text-gray-400 transition-all hover:border-gray-200 hover:bg-gray-50 hover:text-gray-700"
                    title="Copy code"
                  >
                    <Copy size={16} />
                  </button>

                  <SyntaxHighlighter
                    language="javascript"
                    style={docco}
                    wrapLines={true}
                    lineProps={{
                      style: { wordBreak: "break-all", whiteSpace: "pre-wrap" },
                    }}
                    customStyle={{
                      margin: 0,
                      padding: "0 2.5rem 0 0",
                      fontSize: "14px",
                      background: "transparent",
                      border: "none",
                      overflow: "hidden",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {formattedCode}
                  </SyntaxHighlighter>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {moduleData.practiceQuestions?.length > 0 && (
        <>
          <p className="mb-2 text-sm font-medium text-[#1F2421]">Practice</p>
          <ul className="mb-5 list-disc pl-5 text-sm leading-8 text-[#6B756E]">
            {moduleData.practiceQuestions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </>
      )}

      {moduleData.connectionToNext && (
        <p className="mb-5 flex items-center gap-1 text-sm italic text-[#B4B2A9]">
          {moduleData.connectionToNext} <ArrowRight size={13} />
        </p>
      )}

      <button
        className="flex items-center gap-1.5 rounded-xl border border-[#C98A3E] px-4 py-2 text-sm text-[#C98A3E] transition-colors hover:bg-[#C98A3E] hover:text-white"
        onClick={handleStatus}
      >
        {completing ? (
          "checking..."
        ) : (
          <>
            <Check size={13} className="mt-0.5" /> Mark as complete
          </>
        )}
      </button>
    </div>
  );
}

export default ModulePage;