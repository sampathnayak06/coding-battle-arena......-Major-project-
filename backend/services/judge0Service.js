// Judge0 Code Sandbox Service
// Set USE_MOCK_JUDGE0=false and provide JUDGE0_API_KEY in .env to run real submissions.

const LANGUAGE_IDS = {
  javascript: 63, // Node.js
  python: 71, // Python 3
  cpp: 54, // C++ (GCC 9.2.0) — bump to 20 if your Judge0 instance offers it
  java: 62 // Java (OpenJDK 13)
};

const USE_MOCK = (process.env.USE_MOCK_JUDGE0 ?? "true") === "true";

/**
 * Runs a user's submission against a problem's test cases.
 * Returns { passed, total, accuracy, results: [{ passed, expected, actual }] }
 */
export async function runSubmission({ code, language, tests }) {
  if (USE_MOCK) return mockRun({ code, tests });
  return realJudge0Run({ code, language, tests });
}

function mockRun({ code, tests }) {
  // Lightweight heuristic mock: rewards non-empty code, simulates partial credit
  // so the frontend battle loop (accuracy %, HP damage) has real numbers to work with.
  const hasBody = code && code.replace(/\s/g, "").length > 30;
  const results = tests.map((t) => {
    const passed = hasBody ? Math.random() > 0.25 : false;
    return { passed, expected: t.expected, actual: passed ? t.expected : "—" };
  });
  const passed = results.filter((r) => r.passed).length;
  return {
    passed,
    total: tests.length,
    accuracy: Math.round((passed / tests.length) * 100),
    results,
    mocked: true
  };
}

async function realJudge0Run({ code, language, tests }) {
  const languageId = LANGUAGE_IDS[language];
  if (!languageId) throw new Error(`Unsupported language: ${language}`);

  const apiUrl = process.env.JUDGE0_API_URL;
  const apiKey = process.env.JUDGE0_API_KEY;
  if (!apiUrl || !apiKey) {
    throw new Error("Judge0 API not configured — set JUDGE0_API_URL and JUDGE0_API_KEY in .env");
  }

  const results = [];
  for (const test of tests) {
    const submission = await fetch(`${apiUrl}/submissions?base64_encoded=false&wait=true`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": new URL(apiUrl).host
      },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin: JSON.stringify(test.input)
      })
    });
    const data = await submission.json();
    const actual = (data.stdout || "").trim();
    const passed = actual === JSON.stringify(test.expected);
    results.push({ passed, expected: test.expected, actual });
  }

  const passed = results.filter((r) => r.passed).length;
  return {
    passed,
    total: tests.length,
    accuracy: Math.round((passed / tests.length) * 100),
    results,
    mocked: false
  };
}
