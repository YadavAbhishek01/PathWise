import { useContext, useState } from "react";
import { Aicontext } from "../context/Aicontext";
import { useNavigate } from "react-router-dom";

function Home() {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const { createRoadmap } = useContext(Aicontext);
  const navigate = useNavigate();

  const data = {
    topic,
    level,
    language,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await createRoadmap(data);
      if (result?._id) {
        navigate(`/roadmap?id=${result._id}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAF8] px-4 py-8 sm:px-6">
        <div className="w-full max-w-[420px] text-center">
          <h1 className="mb-1 font-['Fraunces'] text-[24px] text-[#1F2421] sm:text-[28px]">
            PathWise
          </h1>
          <p className="mb-6 text-sm text-[#6B756E]">
            Tell us what you want to learn.
          </p>

          <input
            placeholder="e.g. React, Python, Guitar"
            className="mb-3 w-full rounded-xl border border-[#E8E6DF] px-4 py-2.5 text-[#1F2421] placeholder-[#B4B2A9] outline-none transition-colors focus:border-[#C98A3E]"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <div className="mb-3 flex flex-col gap-2 sm:flex-row">
            <select
              className="flex-1 rounded-xl border border-[#E8E6DF] px-3 py-2.5 text-sm text-[#1F2421] outline-none transition-colors focus:border-[#C98A3E]"
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              className="flex-1 rounded-xl border border-[#E8E6DF] px-3 py-2.5 text-sm text-[#1F2421] outline-none transition-colors focus:border-[#C98A3E]"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>English</option>
              <option>Hinglish</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl border border-[#C98A3E] py-2.5 text-sm font-medium text-[#C98A3E] transition-colors ${
              loading
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-[#C98A3E] hover:text-white"
            }`}
          >
            {loading ? "Generating..." : "Generate roadmap"}
          </button>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              className="rounded-lg border border-[#E8E6DF] bg-white px-3 py-1.5 text-xs text-[#6B756E] transition-colors hover:border-[#C98A3E] hover:text-[#C98A3E]"
              type="button"
              onClick={() => setTopic("React")}
            >
              React
            </button>
            <button
              className="rounded-lg border border-[#E8E6DF] bg-white px-3 py-1.5 text-xs text-[#6B756E] transition-colors hover:border-[#C98A3E] hover:text-[#C98A3E]"
              type="button"
              onClick={() => setTopic("python")}
            >
              Python
            </button>
            <button
              className="rounded-lg border border-[#E8E6DF] bg-white px-3 py-1.5 text-xs text-[#6B756E] transition-colors hover:border-[#C98A3E] hover:text-[#C98A3E]"
              onClick={() => setTopic("Guitar")}
              type="button"
            >
              Guitar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Home;
