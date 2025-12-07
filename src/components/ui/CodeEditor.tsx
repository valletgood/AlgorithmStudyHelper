import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import AIResult from '@/components/ui/AIResult';

interface Props {
  code: string;
  setCode: (code: string) => void;
  isAIEnabled: boolean;
  isLoading: boolean;
  aiResult: string;
  setAiResult: (result: string) => void;
  codeResult: string;
  handleRunCode: () => void;
  handleDebugCode: () => void;
  handleGetHint: () => void;
}

export default function CodeEditor({
  code,
  setCode,
  isAIEnabled,
  isLoading,
  aiResult,
  setAiResult,
  codeResult,
  handleRunCode,
  handleDebugCode,
  handleGetHint,
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
            <>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                AI 활성화
              </span>
              {/* 힌트 버튼 */}
              <Button
                onClick={handleGetHint}
                disabled={isLoading}
                variant="outline"
                className="gap-2 border-[#f0883e] text-[#f0883e] hover:bg-[#f0883e]/10 disabled:opacity-50"
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
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
                힌트
              </Button>
              {/* 디버그 버튼 */}
              <Button
                onClick={handleDebugCode}
                disabled={isLoading}
                variant="outline"
                className="gap-2 border-[#f85149] text-[#f85149] hover:bg-[#f85149]/10 disabled:opacity-50"
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
                  <path d="m8 2 1.88 1.88" />
                  <path d="M14.12 3.88 16 2" />
                  <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
                  <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
                  <path d="M12 20v-9" />
                  <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
                  <path d="M6 13H2" />
                  <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
                  <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
                  <path d="M22 13h-4" />
                  <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
                </svg>
                디버그
              </Button>
            </>
          )}
          {/* 실행 버튼 */}
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
        {/* 코드 입력 & 실행 결과 영역 (좌측) */}
        <div className="flex flex-1 flex-col gap-4">
          {/* 코드 입력 영역 */}
          <div className="flex flex-[2] flex-col">
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

          {/* 코드 실행 결과 영역 */}
          <div className="flex flex-1 flex-col">
            <div className="mb-3 flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-[#3fb950]">
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
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <polyline points="9 17 9 12 13 12" />
                  <path d="M13 17V7" />
                </svg>
                실행 결과 (Result)
              </label>
            </div>
            <div className="flex-1 overflow-auto rounded-md border border-[#30363d] bg-[#0d1117] p-4 font-mono text-sm leading-relaxed text-[#c9d1d9]">
              {codeResult ? (
                <pre className="whitespace-pre-wrap">{codeResult}</pre>
              ) : (
                <span className="text-[#484f58]">코드를 실행하면 결과가 여기에 표시됩니다...</span>
              )}
            </div>
          </div>
        </div>

        {/* AI 분석 결과 영역 (우측) */}
        {aiResult && <AIResult aiResult={aiResult} setAiResult={setAiResult} />}
      </div>
    </main>
  );
}
