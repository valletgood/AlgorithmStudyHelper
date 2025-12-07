import { GoogleGenAI } from '@google/genai';

const genai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_GEN_API_KEY,
});

interface AnalyzeCodeRequest {
  code: string;
  input?: string;
  expectedOutput?: string;
}

interface AnalyzeCodeResponse {
  analysis: string;
  suggestions?: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
}

/**
 * 알고리즘 코드를 분석하고 피드백을 제공합니다.
 */
export async function analyzeCode({
  code,
  input,
  expectedOutput,
}: AnalyzeCodeRequest): Promise<AnalyzeCodeResponse> {
  const prompt = buildAnalysisPrompt(code, input, expectedOutput);

  const response = await genai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  const text = response.text ?? '';

  return {
    analysis: text,
  };
}

/**
 * 코드의 오류를 찾아 수정 방안을 제안합니다.
 */
export async function debugCode(code: string, error?: string): Promise<string> {
  const prompt = `
다음 코드에서 발생하는 문제를 분석하고 수정 방안을 제안해주세요.

## 코드
\`\`\`
${code}
\`\`\`

${error ? `## 에러 메시지\n${error}` : ''}

다음 형식으로 응답해주세요:
1. **문제점**: 코드에서 발견된 문제
2. **원인**: 문제가 발생한 이유
3. **해결책**: 수정된 코드와 설명
`;

  const response = await genai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text ?? '';
}

/**
 * 알고리즘 힌트를 제공합니다.
 */
export async function getHint(problemDescription: string, currentCode?: string): Promise<string> {
  const prompt = `
알고리즘 문제를 풀고 있는 학생에게 힌트를 제공해주세요. 직접적인 답을 주지 말고, 생각할 수 있는 방향을 제시해주세요.

## 문제/상황
${problemDescription}

${currentCode ? `## 현재 작성 중인 코드\n\`\`\`\n${currentCode}\n\`\`\`` : ''}

힌트는 다음 순서로 점진적으로 제공해주세요:
1. **접근 방향**: 어떤 알고리즘/자료구조를 고려해볼 수 있는지
2. **핵심 아이디어**: 문제 해결의 핵심 포인트
3. **구현 팁**: 구현 시 주의할 점
`;

  const response = await genai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text ?? '';
}

/**
 * 코드의 시간/공간 복잡도를 분석합니다.
 */
export async function analyzeComplexity(code: string): Promise<{
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
}> {
  const prompt = `
다음 코드의 시간 복잡도와 공간 복잡도를 분석해주세요.

\`\`\`
${code}
\`\`\`

다음 JSON 형식으로만 응답해주세요 (다른 텍스트 없이):
{
  "timeComplexity": "O(?)",
  "spaceComplexity": "O(?)",
  "explanation": "복잡도에 대한 간단한 설명"
}
`;

  const response = await genai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  try {
    const text = response.text ?? '{}';
    // JSON 부분만 추출
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {
      timeComplexity: '분석 실패',
      spaceComplexity: '분석 실패',
      explanation: text,
    };
  } catch {
    return {
      timeComplexity: '분석 실패',
      spaceComplexity: '분석 실패',
      explanation: response.text ?? '',
    };
  }
}

// 프롬프트 빌더 함수
function buildAnalysisPrompt(code: string, input?: string, expectedOutput?: string): string {
  let prompt = `
당신은 알고리즘 튜터입니다. 다음 코드를 분석하고 피드백을 제공해주세요.

## 코드
\`\`\`
${code}
\`\`\`
`;

  if (input) {
    prompt += `
## 입력
\`\`\`
${input}
\`\`\`
`;
  }

  if (expectedOutput) {
    prompt += `
## 기대 출력
\`\`\`
${expectedOutput}
\`\`\`
`;
  }

  prompt += `
다음 항목들을 분석해주세요:
1. **코드 정확성**: 코드가 올바르게 동작하는지
2. **시간 복잡도**: Big-O 표기법으로 분석
3. **공간 복잡도**: Big-O 표기법으로 분석
4. **개선 제안**: 더 효율적인 방법이 있다면 제안
5. **코드 스타일**: 가독성, 네이밍 등에 대한 피드백
`;

  return prompt;
}
