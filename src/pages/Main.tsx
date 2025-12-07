import { useState } from 'react';
import { analyzeCode, debugCode, getHint } from '@/apis/gemini';
import { runJavaScriptCode, compareOutput } from '@/utils/codeRunner';
import SideBar from '@/components/ui/SideBar';
import CodeEditor from '@/components/ui/CodeEditor';

export default function Main() {
  const [problemNumber, setProblemNumber] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [code, setCode] = useState('');
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [codeResult, setCodeResult] = useState('');

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
      // 실제 코드 실행
      const result = runJavaScriptCode(code, input);

      let resultText = '';

      if (result.success) {
        resultText += `✅ 실행 성공 (${result.executionTime.toFixed(2)}ms)\n\n`;
        resultText += `출력:\n${result.output}`;

        // 기대 출력과 비교
        if (output.trim()) {
          const comparison = compareOutput(result.output, output);
          resultText += '\n\n─────────────────────────────\n';
          if (comparison.isMatch) {
            resultText += '정답! 기대 출력과 일치합니다.';
          } else {
            resultText += '❌ 오답! 기대 출력과 다릅니다.\n\n';
            resultText += comparison.diff;
          }
        }
      } else {
        resultText += `실행 오류 (${result.executionTime.toFixed(2)}ms)\n\n`;
        resultText += `🔴 에러:\n${result.error}`;
        if (result.output) {
          resultText += `\n\n📤 에러 전 출력:\n${result.output}`;
        }
      }

      setCodeResult(resultText);
    }
  };

  const handleDebugCode = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    try {
      // 최근 에러가 있으면 함께 전달
      const lastError = codeResult.includes('에러') ? codeResult : undefined;
      const result = await debugCode(code, lastError);
      setAiResult(result);
    } catch (error) {
      console.error('디버그 실패:', error);
      setAiResult('디버그 분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetHint = async () => {
    if (!code.trim() && !problemNumber.trim()) {
      setAiResult('힌트를 받으려면 코드를 작성하거나 문제 번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const problemDescription = problemNumber
        ? `백준 ${problemNumber}번 문제를 풀고 있습니다.`
        : '알고리즘 문제를 풀고 있습니다.';
      const result = await getHint(problemDescription, code || undefined);
      setAiResult(result);
    } catch (error) {
      console.error('힌트 요청 실패:', error);
      setAiResult('힌트 요청 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full bg-[#0d1117] font-['Pretendard']">
      {/* 왼쪽 사이드바 - 입력/출력 영역 */}
      <SideBar
        problemNumber={problemNumber}
        setProblemNumber={setProblemNumber}
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
        setAiResult={setAiResult}
        codeResult={codeResult}
        handleRunCode={handleRunCode}
        handleDebugCode={handleDebugCode}
        handleGetHint={handleGetHint}
      />
    </div>
  );
}
