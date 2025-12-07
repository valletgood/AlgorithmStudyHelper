interface CodeRunResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
}

/**
 * Node.js 입력 패턴을 감지하고 제거합니다.
 * 지원하는 패턴:
 * - const fs = require('fs');
 * - const input = fs.readFileSync(0, 'utf8')...
 * - const input = fs.readFileSync('/dev/stdin')...
 * - const readline = require('readline');
 */
function preprocessCode(code: string): string {
  let processedCode = code;

  // require('fs') 관련 패턴 제거
  // const fs = require('fs'); 또는 var fs = require('fs'); 등
  processedCode = processedCode.replace(
    /^\s*(const|let|var)\s+fs\s*=\s*require\s*\(\s*['"]fs['"]\s*\)\s*;?\s*$/gm,
    '// [removed] fs require',
  );

  // fs.readFileSync 패턴 제거 및 input 변수 선언 감지
  // const input = fs.readFileSync(0, 'utf8').trim().split('\n');
  // const input = fs.readFileSync('/dev/stdin').toString().trim().split('\n');
  // 다양한 변형 지원
  processedCode = processedCode.replace(
    /^\s*(const|let|var)\s+input\s*=\s*fs\.readFileSync\s*\([^)]*\)[^;]*;?\s*$/gm,
    '// [removed] fs.readFileSync - input is provided',
  );

  // require('readline') 패턴 제거
  processedCode = processedCode.replace(
    /^\s*(const|let|var)\s+readline\s*=\s*require\s*\(\s*['"]readline['"]\s*\)\s*;?\s*$/gm,
    '// [removed] readline require',
  );

  // readline 인터페이스 생성 패턴 제거
  processedCode = processedCode.replace(
    /^\s*(const|let|var)\s+rl\s*=\s*readline\.createInterface\s*\([^)]*\)\s*;?\s*$/gm,
    '// [removed] readline interface',
  );

  // process.stdin 관련 패턴 제거
  processedCode = processedCode.replace(
    /^\s*(const|let|var)\s+input\s*=\s*require\s*\(\s*['"]fs['"]\s*\)\.readFileSync\s*\([^)]*\)[^;]*;?\s*$/gm,
    '// [removed] inline fs.readFileSync - input is provided',
  );

  return processedCode;
}

/**
 * JavaScript 코드를 실행하고 결과를 반환합니다.
 * console.log 출력을 캡처하여 결과로 보여줍니다.
 */
export function runJavaScriptCode(code: string, input: string): CodeRunResult {
  const startTime = performance.now();
  const outputs: string[] = [];

  try {
    // Node.js 패턴 전처리
    const processedCode = preprocessCode(code);

    // 입력값을 줄 단위로 파싱
    const inputData = input.trim();
    const inputLines = inputData ? inputData.split('\n') : [];

    // console.log를 캡처하는 커스텀 console 객체
    const customConsole = {
      log: (...args: unknown[]) => {
        outputs.push(args.map((arg) => formatOutput(arg)).join(' '));
      },
      error: (...args: unknown[]) => {
        outputs.push(`[ERROR] ${args.map((arg) => formatOutput(arg)).join(' ')}`);
      },
      warn: (...args: unknown[]) => {
        outputs.push(`[WARN] ${args.map((arg) => formatOutput(arg)).join(' ')}`);
      },
    };

    // 코드 실행을 위한 Function 생성
    // 사용자 코드에서 input, readline을 사용할 수 있도록 주입
    const wrappedCode = `
      // 입력 데이터 제공
      const __inputData__ = ${JSON.stringify(inputData)};
      const __inputLines__ = ${JSON.stringify(inputLines)};
      let __inputIndex__ = 0;
      
      // input 변수 제공 (배열 형태)
      const input = __inputLines__;
      
      // readline 함수 제공 (한 줄씩 읽기)
      function readline() {
        return __inputIndex__ < __inputLines__.length ? __inputLines__[__inputIndex__++] : '';
      }
      
      // Node.js 호환성을 위한 더미 객체들
      const fs = {
        readFileSync: () => __inputData__
      };
      const process = {
        stdin: __inputData__
      };
      
      // 사용자 코드 실행
      ${processedCode}
    `;

    // Function 생성자를 사용하여 코드 실행
    const executeCode = new Function('console', wrappedCode);
    executeCode(customConsole);

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    return {
      success: true,
      output: outputs.length > 0 ? outputs.join('\n') : '(출력 없음)',
      executionTime,
    };
  } catch (error) {
    const endTime = performance.now();
    const executionTime = endTime - startTime;

    return {
      success: false,
      output: outputs.join('\n'),
      error: error instanceof Error ? error.message : String(error),
      executionTime,
    };
  }
}

/**
 * 다양한 타입의 값을 문자열로 포맷팅합니다.
 */
function formatOutput(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

/**
 * 실행 결과와 기대 출력을 비교합니다.
 */
export function compareOutput(
  actual: string,
  expected: string,
): {
  isMatch: boolean;
  diff?: string;
} {
  const actualTrimmed = actual.trim();
  const expectedTrimmed = expected.trim();

  if (actualTrimmed === expectedTrimmed) {
    return { isMatch: true };
  }

  // 줄 단위로 비교
  const actualLines = actualTrimmed.split('\n');
  const expectedLines = expectedTrimmed.split('\n');
  const diffLines: string[] = [];

  const maxLines = Math.max(actualLines.length, expectedLines.length);
  for (let i = 0; i < maxLines; i++) {
    const actualLine = actualLines[i] ?? '(없음)';
    const expectedLine = expectedLines[i] ?? '(없음)';

    if (actualLine !== expectedLine) {
      diffLines.push(`Line ${i + 1}:`);
      diffLines.push(`  기대: "${expectedLine}"`);
      diffLines.push(`  실제: "${actualLine}"`);
    }
  }

  return {
    isMatch: false,
    diff: diffLines.join('\n'),
  };
}
