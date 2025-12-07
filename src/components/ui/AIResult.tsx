interface Props {
  aiResult: string;
  setAiResult: (result: string) => void;
}

export default function AIResult({ aiResult, setAiResult }: Props) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-3 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-semibold text-[#a371f7]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
          </svg>
          AI 분석 결과
        </label>
        <button
          onClick={() => setAiResult('')}
          className="text-[#8b949e] transition-colors hover:text-[#c9d1d9]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" x2="6" y1="6" y2="18" />
            <line x1="6" x2="18" y1="6" y2="18" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-auto rounded-md border border-[#30363d] bg-[#0d1117] p-4 font-mono text-sm leading-relaxed text-[#c9d1d9]">
        <pre className="whitespace-pre-wrap">{aiResult}</pre>
      </div>
    </div>
  );
}
