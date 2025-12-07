import { useState } from 'react';
import { analyzeCode } from '@/apis/gemini';
import SideBar from '@/components/ui/SideBar';
import CodeEditor from '@/components/ui/CodeEditor';

export default function Main() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [code, setCode] = useState('');
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');

  const handleRunCode = async () => {
    if (!code.trim()) return;

    if (isAIEnabled) {
      setIsLoading(true);
      try {
        const result = await analyzeCode({
          code,
          input: input || undefined,
          expectedOutput: output || undefined,
        });
        setAiResult(result.analysis);
      } catch (error) {
        console.error('AI 분석 실패:', error);
        setAiResult('AI 분석 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('코드 실행:', code);
    }
  };

  return (
    <div className="flex h-full w-full bg-[#0d1117] font-['Pretendard']">
      {/* 왼쪽 사이드바 - 입력/출력 영역 */}
      <SideBar
        input={input}
        setInput={setInput}
        output={output}
        setOutput={setOutput}
        isAIEnabled={isAIEnabled}
        setIsAIEnabled={setIsAIEnabled}
      />
      {/* 오른쪽 메인 영역 - 코드 에디터 */}
      <CodeEditor
        code={code}
        setCode={setCode}
        isAIEnabled={isAIEnabled}
        isLoading={isLoading}
        aiResult={aiResult}
        handleRunCode={handleRunCode}
      />
    </div>
  );
}
