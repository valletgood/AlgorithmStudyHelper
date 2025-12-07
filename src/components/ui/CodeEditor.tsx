import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface Props {
  code: string;
  setCode: (code: string) => void;
  isAIEnabled: boolean;
  isLoading: boolean;
  aiResult: string;
  handleRunCode: () => void;
}

export default function CodeEditor({
  code,
  setCode,
  isAIEnabled,
  isLoading,
  aiResult,
  handleRunCode,
}: Props) {
  return (
    <main className="flex flex-1 flex-col overflow-y-scroll">
      {/* 헤더 */}
      <header className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-6 py-3">
        <h1 className="flex items-center gap-3 text-lg font-bold text-[#f0f6fc]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-[#f78166]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          Algorithm Study Helper
        </h1>
        <div className="flex items-center gap-3 text-xs text-[#8b949e]">
          {isAIEnabled && (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              AI 활성화
            </span>
          )}
          <Button
            onClick={handleRunCode}
            disabled={isLoading}
            className="gap-2 bg-[#238636] text-white hover:bg-[#2ea043] focus-visible:ring-[#238636]/50 disabled:opacity-50"
          >
            {isLoading ? (
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
            {isLoading ? '분석 중...' : '실행'}
          </Button>
        </div>
      </header>

      {/* 코드 입력 & AI 결과 영역 */}
      <div className="flex flex-1 gap-4 p-6">
        {/* 코드 입력 영역 */}
        <div className={`flex flex-col ${aiResult ? 'flex-1' : 'flex-1'}`}>
          <div className="mb-3 flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#ffa657]">
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
                <path d="m18 16 4-4-4-4" />
                <path d="m6 8-4 4 4 4" />
                <path d="m14.5 4-5 16" />
              </svg>
              코드 (Code)
            </label>
          </div>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="여기에 알고리즘 코드를 작성하세요..."
            className="flex-1 resize-none border-[#30363d] bg-[#0d1117] font-mono text-sm leading-relaxed text-[#c9d1d9] placeholder:text-[#484f58] focus-visible:border-[#58a6ff] focus-visible:ring-[#58a6ff]/20"
          />
        </div>

        {/* AI 분석 결과 영역 */}
        {aiResult && (
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
        )}
      </div>
    </main>
  );
}
