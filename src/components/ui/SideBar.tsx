import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  problemNumber: string;
  setProblemNumber: (problemNumber: string) => void;
  input: string;
  setInput: (input: string) => void;
  output: string;
  setOutput: (output: string) => void;
  isAIEnabled: boolean;
  setIsAIEnabled: (isAIEnabled: boolean) => void;
}

export default function SideBar({
  problemNumber,
  setProblemNumber,
  input,
  setInput,
  output,
  setOutput,
  isAIEnabled,
  setIsAIEnabled,
}: Props) {
  return (
    <aside className="flex w-80 flex-col gap-4 border-r border-[#30363d] bg-[#161b22] p-4">
      {/* AI 연동 스위치 */}
      <div className="flex items-center justify-between rounded-lg bg-[#21262d] px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${isAIEnabled ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-gray-500'}`}
          />
          <span className="text-sm font-medium text-[#c9d1d9]">AI 연동</span>
        </div>
        <Switch checked={isAIEnabled} onCheckedChange={setIsAIEnabled} />
      </div>

      {/* 문제 번호 입력 영역 */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-[#f78166]">
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
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
            <path d="M8 11h8" />
            <path d="M8 7h6" />
          </svg>
          문제 번호
        </label>
        <input
          type="text"
          value={problemNumber}
          onChange={(e) => setProblemNumber(e.target.value)}
          placeholder="예: 1000, 1001..."
          className="rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 font-mono text-sm text-[#c9d1d9] placeholder:text-[#484f58] outline-none transition-colors focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/20"
        />
      </div>

      {/* 입력 영역 */}
      <div className="flex flex-1 flex-col gap-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-[#7ee787]">
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
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
          입력 (Input)
        </label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="테스트 케이스 입력을 붙여넣으세요..."
          className="flex-1 resize-none border-[#30363d] bg-[#0d1117] font-mono text-sm text-[#c9d1d9] placeholder:text-[#484f58] focus-visible:border-[#58a6ff] focus-visible:ring-[#58a6ff]/20"
        />
      </div>

      {/* 출력 영역 */}
      <div className="flex flex-1 flex-col gap-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-[#79c0ff]">
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
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" x2="20" y1="19" y2="19" />
          </svg>
          출력 (Output)
        </label>
        <Textarea
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          placeholder="기대 출력값을 붙여넣으세요..."
          className="flex-1 resize-none border-[#30363d] bg-[#0d1117] font-mono text-sm text-[#c9d1d9] placeholder:text-[#484f58] focus-visible:border-[#58a6ff] focus-visible:ring-[#58a6ff]/20"
        />
      </div>
    </aside>
  );
}
