// Question Bank — per-language pools with levels (Easy, Moderate, Hard).
// Each match: pick ONE language, level/difficulty, 10 MCQ questions + up to 5 code-typing questions (12-15 total).

export const LANGUAGES = ["c", "cpp", "java", "python", "javascript", "html", "css"];

// Fisher-Yates (Knuth) Shuffle Algorithm for true uniform randomness
export function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ---------------- MCQ VALIDATION ENGINE ----------------
export function validateMcq(question, targetLang = null) {
  if (!question || typeof question !== "object") {
    console.warn("❌ Invalid MCQ: Question object is missing or null", question);
    return false;
  }
  if (question.type !== "mcq") return true; // Only validate MCQs

  if (!Array.isArray(question.options) || question.options.length !== 4) {
    console.warn(`❌ Invalid MCQ: Must have exactly 4 options [ID: ${question.id || 'unknown'}]`);
    return false;
  }

  const uniqueOptions = new Set(question.options.map(o => String(o).trim().toLowerCase()));
  if (uniqueOptions.size !== 4) {
    console.warn(`❌ Invalid MCQ: All 4 options must be unique [ID: ${question.id || 'unknown'}]`);
    return false;
  }

  const hasIndex = Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex <= 3;
  const hasAnswer = typeof question.correctAnswer === "string" && question.correctAnswer.trim().length > 0;

  if (!hasIndex && !hasAnswer) {
    console.warn(`❌ Invalid MCQ: Missing correctIndex or correctAnswer [ID: ${question.id || 'unknown'}]`);
    return false;
  }

  if (hasAnswer) {
    const matchCount = question.options.filter(opt => opt.trim() === question.correctAnswer.trim()).length;
    if (matchCount !== 1) {
      console.warn(`❌ Invalid MCQ: correctAnswer "${question.correctAnswer}" must match exactly 1 option in [${question.options.join(", ")}]`);
      return false;
    }
  }

  if (targetLang) {
    const qLang = (question.language || question.id || "").toLowerCase();
    const tLang = String(targetLang).toLowerCase();
    const langPrefixes = {
      javascript: ["js", "javascript"],
      python: ["py", "python"],
      java: ["java"],
      cpp: ["cpp", "c++"],
      c: ["c_"],
      html: ["html"],
      css: ["css"]
    };
    const validPrefixes = langPrefixes[tLang] || [tLang];
    const isMatched = validPrefixes.some(prefix => qLang.includes(prefix) || (question.id && question.id.toLowerCase().startsWith(prefix)));
    if (qLang && !isMatched) {
      console.warn(`❌ Invalid MCQ: Language mismatch. Expected ${tLang}, question belongs to ${qLang}`);
      return false;
    }
  }

  return true;
}

// Shuffles MCQ options dynamically for every match so correct option is randomly placed at A, B, C, or D (~25% distribution)
export function normalizeMcqOptions(question) {
  if (question.type !== "mcq") return question;
  const originalOptions = Array.isArray(question.options) ? [...question.options] : [];
  
  let correctAnswer = question.correctAnswer;
  if (!correctAnswer && Number.isInteger(question.correctIndex) && originalOptions[question.correctIndex] !== undefined) {
    correctAnswer = originalOptions[question.correctIndex];
  }
  if (!correctAnswer) {
    correctAnswer = originalOptions[0];
  }

  // Shuffle options using Fisher-Yates
  const shuffledOptions = shuffle(originalOptions);
  let newCorrectIndex = shuffledOptions.indexOf(correctAnswer);
  if (newCorrectIndex === -1) {
    shuffledOptions[0] = correctAnswer;
    newCorrectIndex = 0;
  }

  const normalized = {
    ...question,
    options: shuffledOptions,
    correctIndex: newCorrectIndex,
    correctAnswer: correctAnswer
  };

  validateMcq(normalized);
  return normalized;
}

// ---------------- MCQ QUESTIONS (Categorized by difficulty levels for all languages) ----------------
export const mcqQuestions = {
  html: [
    { id: "html_e1", type: "mcq", difficulty: "easy", question: "Which HTML tag is used to create a hyperlink?", options: ["<a>", "<link>", "<href>", "<nav>"], correctIndex: 0, correctAnswer: "<a>" },
    { id: "html_e2", type: "mcq", difficulty: "easy", question: "Which tag is used for the largest heading in HTML?", options: ["<h6>", "<heading>", "<h1>", "<head>"], correctIndex: 2, correctAnswer: "<h1>" },
    { id: "html_e3", type: "mcq", difficulty: "easy", question: "Which tag defines an unordered (bulleted) list?", options: ["<ol>", "<ul>", "<list>", "<li>"], correctIndex: 1, correctAnswer: "<ul>" },
    { id: "html_e4", type: "mcq", difficulty: "easy", question: "Which attribute specifies alternate text for an image?", options: ["title", "src", "desc", "alt"], correctIndex: 3, correctAnswer: "alt" },
    { id: "html_e5", type: "mcq", difficulty: "easy", question: "Which HTML element is used to insert a line break?", options: ["<lb>", "<break>", "<br>", "<newline>"], correctIndex: 2, correctAnswer: "<br>" },
    { id: "html_e6", type: "mcq", difficulty: "easy", question: "Which HTML tag is used to define an internal style sheet?", options: ["<css>", "<style>", "<script>", "<stylesheet>"], correctIndex: 1, correctAnswer: "<style>" },
    { id: "html_m1", type: "mcq", difficulty: "moderate", question: "Which HTML5 tag is used to play video content natively?", options: ["<media>", "<movie>", "<stream>", "<video>"], correctIndex: 3, correctAnswer: "<video>" },
    { id: "html_m2", type: "mcq", difficulty: "moderate", question: "Which attribute makes a form input field mandatory before submission?", options: ["mandatory", "required", "validate", "needed"], correctIndex: 1, correctAnswer: "required" },
    { id: "html_m3", type: "mcq", difficulty: "moderate", question: "Which tag is used to embed JavaScript code inside HTML?", options: ["<script>", "<js>", "<javascript>", "<code>"], correctIndex: 0, correctAnswer: "<script>" },
    { id: "html_m4", type: "mcq", difficulty: "moderate", question: "Which semantic element represents self-contained content like a blog post?", options: ["<section>", "<div>", "<article>", "<aside>"], correctIndex: 2, correctAnswer: "<article>" },
    { id: "html_h1", type: "mcq", difficulty: "hard", question: "What does the 'defer' attribute on a <script> tag do?", options: ["Executes script after document is parsed", "Executes script immediately and blocks HTML parsing", "Prevents script execution until user clicks", "Loads script synchronously"], correctIndex: 0, correctAnswer: "Executes script after document is parsed" },
    { id: "html_h2", type: "mcq", difficulty: "hard", question: "Which HTML5 API allows storing data locally in the browser without expiration?", options: ["sessionStorage", "localStorage", "Cookies", "WebSQL"], correctIndex: 1, correctAnswer: "localStorage" }
  ],

  css: [
    { id: "css_e1", type: "mcq", difficulty: "easy", question: "Which CSS property changes the text color of an element?", options: ["color", "font-color", "text-color", "background-color"], correctIndex: 0, correctAnswer: "color" },
    { id: "css_e2", type: "mcq", difficulty: "easy", question: "Which CSS property controls the outer spacing around an element?", options: ["padding", "margin", "spacing", "border"], correctIndex: 1, correctAnswer: "margin" },
    { id: "css_e3", type: "mcq", difficulty: "easy", question: "How do you select an element with id 'header' in CSS?", options: [".header", "*header", "#header", "header{}"], correctIndex: 2, correctAnswer: "#header" },
    { id: "css_e4", type: "mcq", difficulty: "easy", question: "Which property sets the size of text in CSS?", options: ["text-style", "text-size", "font-style", "font-size"], correctIndex: 3, correctAnswer: "font-size" },
    { id: "css_m1", type: "mcq", difficulty: "moderate", question: "Which CSS layout model arranges items flexibly in a row or column?", options: ["Grid", "Flexbox", "Float", "Table"], correctIndex: 1, correctAnswer: "Flexbox" },
    { id: "css_m2", type: "mcq", difficulty: "moderate", question: "Which property sets the gap between flex or grid items?", options: ["gap", "item-spacing", "flex-gap", "grid-space"], correctIndex: 0, correctAnswer: "gap" },
    { id: "css_h1", type: "mcq", difficulty: "hard", question: "In CSS specificity, which selector combination has the highest precedence?", options: ["Element selector (div)", "Class selector (.card)", "ID selector (#hero)", "Universal selector (*)"], correctIndex: 2, correctAnswer: "ID selector (#hero)" }
  ],

  javascript: [
    { id: "js_e1", type: "mcq", difficulty: "easy", question: "Which keyword declares a block-scoped variable in JavaScript?", options: ["var", "let", "static", "def"], correctIndex: 1, correctAnswer: "let" },
    { id: "js_e2", type: "mcq", difficulty: "easy", question: "What does the '===' operator check in JavaScript?", options: ["Value only", "Type only", "Value and type", "Memory address"], correctIndex: 2, correctAnswer: "Value and type" },
    { id: "js_e3", type: "mcq", difficulty: "easy", question: "Which array method appends an element to the end of an array?", options: ["push()", "pop()", "shift()", "unshift()"], correctIndex: 0, correctAnswer: "push()" },
    { id: "js_e4", type: "mcq", difficulty: "easy", question: "Which keyword declares a constant variable that cannot be reassigned?", options: ["const", "final", "static", "val"], correctIndex: 0, correctAnswer: "const" },
    { id: "js_m1", type: "mcq", difficulty: "moderate", question: "What does Array.prototype.reduce() do?", options: ["Filters array elements", "Reduces array to a single accumulated value", "Sorts array in place", "Transforms each element into a new array"], correctIndex: 1, correctAnswer: "Reduces array to a single accumulated value" },
    { id: "js_m2", type: "mcq", difficulty: "moderate", question: "What is a JavaScript closure?", options: ["A function that executes immediately", "A function bundled with references to its surrounding lexical environment", "A method to close browser tabs", "A block statement wrapped in curly braces"], correctIndex: 1, correctAnswer: "A function bundled with references to its surrounding lexical environment" },
    { id: "js_m3", type: "mcq", difficulty: "moderate", question: "Which method converts a JavaScript object into a JSON string?", options: ["JSON.parse()", "JSON.stringify()", "Object.toJSON()", "JSON.encode()"], correctIndex: 1, correctAnswer: "JSON.stringify()" },
    { id: "js_h1", type: "mcq", difficulty: "hard", question: "What is the output of typeof NaN in JavaScript?", options: ["'NaN'", "'undefined'", "'number'", "'object'"], correctIndex: 2, correctAnswer: "'number'" },
    { id: "js_h2", type: "mcq", difficulty: "hard", question: "In the Event Loop, which queue takes priority right after call stack empties?", options: ["Macrotask queue (setTimeout)", "Microtask queue (Promise callbacks / process.nextTick)", "RequestAnimationFrame queue", "I/O polling queue"], correctIndex: 1, correctAnswer: "Microtask queue (Promise callbacks / process.nextTick)" }
  ],

  python: [
    { id: "py_e1", type: "mcq", difficulty: "easy", question: "What is the standard file extension for Python scripts?", options: [".py", ".pt", ".pyt", ".python"], correctIndex: 0, correctAnswer: ".py" },
    { id: "py_e2", type: "mcq", difficulty: "easy", question: "How do you write a single-line comment in Python?", options: ["// comment", "# comment", "<!-- comment -->", "/* comment */"], correctIndex: 1, correctAnswer: "# comment" },
    { id: "py_e3", type: "mcq", difficulty: "easy", question: "Which built-in function returns the total number of items in a list?", options: ["size()", "count()", "len()", "length()"], correctIndex: 2, correctAnswer: "len()" },
    { id: "py_e4", type: "mcq", difficulty: "easy", question: "Which Python collection stores key-value pairs?", options: ["List", "Tuple", "Set", "Dictionary"], correctIndex: 3, correctAnswer: "Dictionary" },
    { id: "py_e5", type: "mcq", difficulty: "easy", question: "Which data type in Python represents an ordered, immutable sequence?", options: ["list", "dict", "tuple", "set"], correctIndex: 2, correctAnswer: "tuple" },
    { id: "py_m1", type: "mcq", difficulty: "moderate", question: "What is the result of list comprehension `[x * 2 for x in range(3)]`?", options: ["[0, 2, 4]", "[1, 2, 3]", "[0, 1, 2]", "[2, 4, 6]"], correctIndex: 0, correctAnswer: "[0, 2, 4]" },
    { id: "py_m2", type: "mcq", difficulty: "moderate", question: "What does the 'yield' keyword do inside a Python function?", options: ["Returns a final value and terminates function", "Turns function into a generator producing values lazily", "Raises a runtime exception", "Pauses execution without returning values"], correctIndex: 1, correctAnswer: "Turns function into a generator producing values lazily" },
    { id: "py_h1", type: "mcq", difficulty: "hard", question: "What is the average time complexity of key lookup in a Python dict?", options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], correctIndex: 2, correctAnswer: "O(1)" }
  ],

  java: [
    { id: "java_e1", type: "mcq", difficulty: "easy", question: "Which method serves as the entry point for a standalone Java application?", options: ["public static void main(String[] args)", "public void start()", "public static void run()", "public void init()"], correctIndex: 0, correctAnswer: "public static void main(String[] args)" },
    { id: "java_e2", type: "mcq", difficulty: "easy", question: "Which keyword is used to declare a class in Java?", options: ["class", "object", "define", "structure"], correctIndex: 0, correctAnswer: "class" },
    { id: "java_e3", type: "mcq", difficulty: "easy", question: "Which keyword is used for class inheritance in Java?", options: ["implements", "extends", "inherits", "super"], correctIndex: 1, correctAnswer: "extends" },
    { id: "java_e4", type: "mcq", difficulty: "easy", question: "Which keyword is used to implement an interface in Java?", options: ["extends", "implements", "interface", "using"], correctIndex: 1, correctAnswer: "implements" },
    { id: "java_e5", type: "mcq", difficulty: "easy", question: "Which data type is used for double-precision decimal values in Java?", options: ["int", "boolean", "double", "char"], correctIndex: 2, correctAnswer: "double" },
    { id: "java_e6", type: "mcq", difficulty: "easy", question: "Which access modifier restricts visibility to the defining class only?", options: ["public", "protected", "package-private", "private"], correctIndex: 3, correctAnswer: "private" },
    { id: "java_m1", type: "mcq", difficulty: "moderate", question: "What is the time complexity of retrieving an element by index in an ArrayList?", options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], correctIndex: 2, correctAnswer: "O(1)" },
    { id: "java_m2", type: "mcq", difficulty: "moderate", question: "Which keyword prevents a class from being subclassed in Java?", options: ["static", "private", "final", "sealed"], correctIndex: 2, correctAnswer: "final" },
    { id: "java_m3", type: "mcq", difficulty: "moderate", question: "Which collection interface in Java does NOT allow duplicate elements?", options: ["List", "Set", "Map", "Queue"], correctIndex: 1, correctAnswer: "Set" },
    { id: "java_h1", type: "mcq", difficulty: "hard", question: "What memory visibility guarantee does the 'volatile' keyword provide in Java?", options: ["Atomic execution of compound statements", "Immediate visibility of variable writes across thread CPU caches", "Prevents deadlocks", "Locks the object monitor"], correctIndex: 1, correctAnswer: "Immediate visibility of variable writes across thread CPU caches" }
  ],

  cpp: [
    { id: "cpp_e1", type: "mcq", difficulty: "easy", question: "Which standard header file is required for console I/O (std::cout) in C++?", options: ["<stdio.h>", "<iostream>", "<io.h>", "<stream>"], correctIndex: 1, correctAnswer: "<iostream>" },
    { id: "cpp_e2", type: "mcq", difficulty: "easy", question: "Which keyword declares a constant variable in C++?", options: ["final", "const", "static", "readonly"], correctIndex: 1, correctAnswer: "const" },
    { id: "cpp_e3", type: "mcq", difficulty: "easy", question: "Which symbol is used for pointer variable declaration in C++?", options: ["&", "*", "#", "@"], correctIndex: 1, correctAnswer: "*" },
    { id: "cpp_e4", type: "mcq", difficulty: "easy", question: "Which operator allocates dynamic memory on heap in C++?", options: ["malloc", "new", "alloc", "create"], correctIndex: 1, correctAnswer: "new" },
    { id: "cpp_m1", type: "mcq", difficulty: "moderate", question: "Which STL container stores unique elements in sorted order?", options: ["std::vector", "std::set", "std::list", "std::deque"], correctIndex: 1, correctAnswer: "std::set" },
    { id: "cpp_m2", type: "mcq", difficulty: "moderate", question: "Which STL container provides dynamic contiguous array storage with O(1) random access?", options: ["std::vector", "std::list", "std::map", "std::forward_list"], correctIndex: 0, correctAnswer: "std::vector" },
    { id: "cpp_h1", type: "mcq", difficulty: "hard", question: "What does the `virtual` keyword enable on a C++ class member function?", options: ["Faster execution", "Dynamic dispatch for runtime polymorphism", "Static compilation", "Memory pooling"], correctIndex: 1, correctAnswer: "Dynamic dispatch for runtime polymorphism" }
  ],

  c: [
    { id: "c_e1", type: "mcq", difficulty: "easy", question: "Which header file is required for printf() and scanf() in C?", options: ["<stdio.h>", "<stdlib.h>", "<math.h>", "<string.h>"], correctIndex: 0, correctAnswer: "<stdio.h>" },
    { id: "c_e2", type: "mcq", difficulty: "easy", question: "What is the return type of the main() function in standard C?", options: ["void", "int", "float", "char"], correctIndex: 1, correctAnswer: "int" },
    { id: "c_e3", type: "mcq", difficulty: "easy", question: "Which format specifier is used to print an integer in printf()?", options: ["%f", "%s", "%d", "%c"], correctIndex: 2, correctAnswer: "%d" },
    { id: "c_e4", type: "mcq", difficulty: "easy", question: "Which operator is used to get the memory address of a variable in C?", options: ["*", "&", "->", "%"], correctIndex: 1, correctAnswer: "&" },
    { id: "c_e5", type: "mcq", difficulty: "easy", question: "How do you declare a pointer to an integer in C?", options: ["int &p;", "int *p;", "pointer int p;", "int p*;"], correctIndex: 1, correctAnswer: "int *p;" },
    { id: "c_m1", type: "mcq", difficulty: "moderate", question: "Which function allocates memory dynamically from heap in C?", options: ["malloc()", "new()", "alloc()", "create()"], correctIndex: 0, correctAnswer: "malloc()" },
    { id: "c_m2", type: "mcq", difficulty: "moderate", question: "Which operator is used to access structure members via a pointer?", options: [".", "->", "*", "&"], correctIndex: 1, correctAnswer: "->" },
    { id: "c_h1", type: "mcq", difficulty: "hard", question: "What is a dangling pointer in C?", options: ["A pointer set to NULL", "A pointer referencing memory that has been deallocated", "A pointer to a function", "An uninitialized local pointer"], correctIndex: 1, correctAnswer: "A pointer referencing memory that has been deallocated" }
  ]
};

// ---------------- CODE-TYPING QUESTIONS (write real code, auto-graded) ----------------
export const codeQuestions = {
  c: [
    { id: "c_c1", type: "code", difficulty: "easy", title: "Hello World in C", statement: "Write a C main function that prints 'Hello World' using printf.", starter: "#include <stdio.h>\nint main() {\n  /* Write code here */\n  return 0;\n}\n", keywords: ["printf", "Hello World"] },
    { id: "c_c2", type: "code", difficulty: "easy", title: "Sum Function", statement: "Write a C function int add(int a, int b) that returns the sum of a and b.", starter: "int add(int a, int b) {\n  /* Write code here */\n}\n", keywords: ["return", "a + b"] }
  ],
  html: [
    { id: "html_c1", type: "code", difficulty: "easy", title: "Basic Link", statement: "Write an HTML anchor tag that links to 'https://example.com' with the visible text 'Visit Site'.", starter: "<!-- Write your code here -->\n", keywords: ["<a", "href=", "example.com", "</a>"] },
    { id: "html_c2", type: "code", difficulty: "easy", title: "Heading Tag", statement: "Write a primary <h1> heading containing the text 'Welcome to Battle Arena'.", starter: "<!-- Write your code here -->\n", keywords: ["<h1>", "Welcome to Battle Arena", "</h1>"] }
  ],
  css: [
    { id: "css_c1", type: "code", difficulty: "easy", title: "Text Color & Size", statement: "Write CSS for selector '.title' setting color to '#38BDF8' and font-size to 24px.", starter: ".title {\n  /* Write your code here */\n}\n", keywords: [".title", "color", "#38BDF8", "font-size", "24px"] },
    { id: "css_c2", type: "code", difficulty: "easy", title: "Margin & Padding", statement: "Write CSS for selector '.container' setting margin to 0 auto and padding to 16px.", starter: ".container {\n  /* Write your code here */\n}\n", keywords: [".container", "margin", "0", "auto", "padding", "16px"] }
  ],
  javascript: [
    { id: "js_c1", type: "code", difficulty: "easy", title: "Sum Function", statement: "Write a JavaScript function sum(a, b) that returns the sum of a and b.", starter: "function sum(a, b) {\n  // Write your code here\n}\n", keywords: ["function sum", "return", "a", "+", "b"] },
    { id: "js_c2", type: "code", difficulty: "easy", title: "Is Even", statement: "Write a function isEven(n) returning true if n is even and false otherwise.", starter: "function isEven(n) {\n  // Write your code here\n}\n", keywords: ["function isEven", "%", "2", "return"] }
  ],
  python: [
    { id: "py_c1", type: "code", difficulty: "easy", title: "Sum Function", statement: "Write a Python function sum_two(a, b) that returns the sum of a and b.", starter: "def sum_two(a, b):\n    # Write your code here\n    pass\n", keywords: ["def sum_two", "return", "a", "+", "b"] },
    { id: "py_c2", type: "code", difficulty: "easy", title: "Is Even", statement: "Write a function is_even(n) that returns True if n is even, else False.", starter: "def is_even(n):\n    # Write your code here\n    pass\n", keywords: ["def is_even", "%", "2", "return"] }
  ],
  java: [
    { id: "java_c1", type: "code", difficulty: "easy", title: "Sum Method", statement: "Write a Java method 'public static int sum(int a, int b)' that returns the sum of a and b.", starter: "public static int sum(int a, int b) {\n    // Write your code here\n    return 0;\n}\n", keywords: ["public static int sum", "return", "a", "+", "b"] },
    { id: "java_c2", type: "code", difficulty: "easy", title: "Is Even", statement: "Write a method 'public static boolean isEven(int n)' that returns true if n is even.", starter: "public static boolean isEven(int n) {\n    // Write your code here\n    return false;\n}\n", keywords: ["public static boolean isEven", "%", "2", "return"] }
  ],
  cpp: [
    { id: "cpp_c1", type: "code", difficulty: "easy", title: "Sum Function", statement: "Write a C++ function 'int sum(int a, int b)' that returns the sum of a and b.", starter: "int sum(int a, int b) {\n    // Write your code here\n    return 0;\n}\n", keywords: ["int sum", "return", "a", "+", "b"] },
    { id: "cpp_c2", type: "code", difficulty: "easy", title: "Is Even", statement: "Write a function 'bool isEven(int n)' that returns true if n is even.", starter: "bool isEven(int n) {\n    // Write your code here\n    return false;\n}\n", keywords: ["bool isEven", "%", "2", "return"] }
  ]
};

function pickByDifficulty(pool, counts, excludeIds = new Set()) {
  const availablePool = pool.filter((q) => !excludeIds.has(q.id));
  const effectivePool = availablePool.length >= 10 ? availablePool : pool;
  const picked = [];
  const difficulties = ["easy", "moderate", "hard"];
  for (const level of difficulties) {
    const questions = effectivePool.filter((q) => q.difficulty === level);
    const count = counts[level] || 0;
    if (questions.length > 0 && count > 0) {
      picked.push(...shuffle(questions).slice(0, Math.min(count, questions.length)));
    }
  }
  if (picked.length < 10) {
    const pickedIds = new Set(picked.map((q) => q.id));
    const remainingPool = effectivePool.filter((q) => !pickedIds.has(q.id));
    picked.push(...shuffle(remainingPool).slice(0, 10 - picked.length));
  }
  return shuffle(picked);
}

// 10-Level Difficulty Presets with weighted distributions
export const LEVEL_PRESETS = {
  1: { level: 1, name: "Level 1: Novice Basics", icon: "🌱", color: "#22C55E", mcq: { easy: 10, moderate: 0, hard: 0 }, botAccuracy: 0.30, botDelayMs: 9000, desc: "Fundamental tags, core syntax & simple output" },
  2: { level: 2, name: "Level 2: Beginner", icon: "☘️", color: "#4ADE80", mcq: { easy: 8, moderate: 2, hard: 0 }, botAccuracy: 0.36, botDelayMs: 8500, desc: "Basic elements, loops & selectors" },
  3: { level: 3, name: "Level 3: Elementary", icon: "⚡", color: "#A3E635", mcq: { easy: 6, moderate: 4, hard: 0 }, botAccuracy: 0.42, botDelayMs: 8000, desc: "Common attributes, arrays & layout" },
  4: { level: 4, name: "Level 4: Intermediate Novice", icon: "🔥", color: "#FACC15", mcq: { easy: 4, moderate: 6, hard: 0 }, botAccuracy: 0.48, botDelayMs: 7500, desc: "Functions, semantic structure & positioning" },
  5: { level: 5, name: "Level 5: Intermediate", icon: "⚔️", color: "#FB923C", mcq: { easy: 2, moderate: 7, hard: 1 }, botAccuracy: 0.55, botDelayMs: 7000, desc: "Flexbox, media tags, objects & methods" },
  6: { level: 6, name: "Level 6: Upper Intermediate", icon: "🛡️", color: "#F97316", mcq: { easy: 1, moderate: 7, hard: 2 }, botAccuracy: 0.62, botDelayMs: 6500, desc: "Forms, grid, list comprehensions & exceptions" },
  7: { level: 7, name: "Level 7: Advanced Novice", icon: "🔮", color: "#EC4899", mcq: { easy: 0, moderate: 6, hard: 4 }, botAccuracy: 0.70, botDelayMs: 6000, desc: "Async/Promises, specificity, closures & RAII" },
  8: { level: 8, name: "Level 8: Advanced", icon: "💎", color: "#A855F7", mcq: { easy: 0, moderate: 4, hard: 6 }, botAccuracy: 0.76, botDelayMs: 5500, desc: "Event loop, memory allocation & GIL" },
  9: { level: 9, name: "Level 9: Expert", icon: "👑", color: "#8B5CF6", mcq: { easy: 0, moderate: 2, hard: 8 }, botAccuracy: 0.82, botDelayMs: 5000, desc: "Performance optimization, virtual tables & GC" },
  10: { level: 10, name: "Level 10: Grandmaster", icon: "🏆", color: "#EF4444", mcq: { easy: 0, moderate: 0, hard: 10 }, botAccuracy: 0.88, botDelayMs: 4500, desc: "Peak challenge, edge cases & rapid execution" }
};

export function parseLevel(difficultyInput) {
  if (typeof difficultyInput === "number" && LEVEL_PRESETS[difficultyInput]) {
    return LEVEL_PRESETS[difficultyInput];
  }
  if (typeof difficultyInput === "string") {
    const match = difficultyInput.match(/^(?:level_?)?(\d+)$/i);
    if (match) {
      const lvlNum = parseInt(match[1], 10);
      if (LEVEL_PRESETS[lvlNum]) return LEVEL_PRESETS[lvlNum];
    }
    if (difficultyInput === "easy") return LEVEL_PRESETS[1];
    if (difficultyInput === "moderate") return LEVEL_PRESETS[5];
    if (difficultyInput === "hard") return LEVEL_PRESETS[9];
  }
  return LEVEL_PRESETS[5];
}

export function buildLanguageSeries(language, difficultyLevel = 1, codeCount = 4, excludeList = [], isMobile = false) {
  const lang = LANGUAGES.includes(language) ? language : "javascript";
  const mcqPool = mcqQuestions[lang] || mcqQuestions.javascript;
  const codePool = codeQuestions[lang] || codeQuestions.javascript;
  const excludeSet = new Set(excludeList);

  const levelConfig = parseLevel(difficultyLevel);
  const mcqDistribution = levelConfig.mcq;

  const mcqPicked = pickByDifficulty(mcqPool, mcqDistribution, excludeSet);

  if (isMobile) {
    const pickedIds = new Set(mcqPicked.map((q) => q.id));
    const extraCandidates = mcqPool.filter((q) => !pickedIds.has(q.id));
    const extraPicked = shuffle(extraCandidates).slice(0, 4);
    const fullMcqList = shuffle([...mcqPicked, ...extraPicked]).map(normalizeMcqOptions);
    return fullMcqList;
  }

  let codeSubPool = codePool.filter((q) => !excludeSet.has(q.id));
  if (codeSubPool.length < 2) codeSubPool = codePool;

  if (levelConfig.level <= 3) {
    const easyCode = codeSubPool.filter((q) => q.difficulty === "easy");
    if (easyCode.length >= 2) codeSubPool = easyCode;
  } else if (levelConfig.level >= 8) {
    const hardCode = codeSubPool.filter((q) => q.difficulty === "hard" || q.difficulty === "moderate");
    if (hardCode.length >= 2) codeSubPool = hardCode;
  }

  const clampedCodeCount = Math.max(2, Math.min(5, codeCount));
  const codePicked = shuffle(codeSubPool).slice(0, Math.min(clampedCodeCount, codeSubPool.length));

  const normalizedMcq = mcqPicked.map(normalizeMcqOptions);

  return [...normalizedMcq, ...codePicked];
}

export function stripAnswer(question, isSinglePlayer = false) {
  if (question.type === "mcq") {
    if (isSinglePlayer) {
      // In single player / campaign mode, preserve correctIndex and correctAnswer so local validation never defaults to 0
      return { ...question };
    }
    const { correctIndex, ...rest } = question;
    return rest;
  }
  const { keywords, ...rest } = question;
  return rest;
}

export function gradeCodeAnswer(question, submittedCode) {
  if (!submittedCode || !submittedCode.trim()) return { correct: false, score: 0 };
  const code = submittedCode.toLowerCase();
  const hits = question.keywords.filter((k) => code.includes(k.toLowerCase())).length;
  const score = hits / question.keywords.length;
  return { correct: score >= 0.6, score };
}

// ---------------- HINT GENERATION & VALIDATION ENGINE ----------------
export function getQuestionHints(question, language = "javascript") {
  if (!question) {
    return [
      "Focus on the core concepts of the question.",
      "Identify the main language construct being tested.",
      `Think about standard rules and behaviors in ${String(language).toUpperCase()}.`
    ];
  }

  if (Array.isArray(question.hints) && question.hints.length >= 3) {
    return question.hints;
  }
  if (question.hint && question.guidedHint && question.strongHint) {
    return [question.hint, question.guidedHint, question.strongHint];
  }

  const lang = String(language || "javascript").toUpperCase();

  if (question.type === "code") {
    const title = question.title || question.statement || "Coding Challenge";
    const keywords = Array.isArray(question.keywords) ? question.keywords.slice(0, 3) : [];
    
    const level1 = `Think about breaking down "${title}" into logical sub-tasks in ${lang}.`;
    const level2 = keywords.length > 0 
      ? `Consider using core operations or helpers like: ${keywords.join(", ")}.`
      : `Identify how to iterate or manipulate inputs efficiently in ${lang}.`;
    const level3 = `Structure your solution: initialize state → process inputs with conditionals/loops → return/output the final result.`;
    return [level1, level2, level3];
  }

  const text = question.question || "";
  const opts = Array.isArray(question.options) ? question.options : [];
  const correct = Number.isInteger(question.correctIndex) ? question.correctIndex : 0;
  
  let level1 = `Recall the fundamental definitions and syntax rules of ${lang}.`;
  if (text.includes("keyword")) level1 = `Focus on language keywords in ${lang} used for this specific control structure or declaration.`;
  else if (text.includes("tag") || text.includes("element")) level1 = `Think about standard HTML/markup tags used to define this specific structure.`;
  else if (text.includes("property")) level1 = `Consider the CSS property responsible for controlling visual appearance or layout.`;
  else if (text.includes("method") || text.includes("function")) level1 = `Recall the built-in function or method signature in ${lang}.`;

  let level2 = `Consider eliminating options that are invalid syntax or from a different programming language.`;
  if (opts.length >= 4) {
    const wrongIdx = opts.findIndex((o, idx) => idx !== correct);
    if (wrongIdx >= 0) {
      level2 = `You can eliminate "${opts[wrongIdx]}" — it is either invalid syntax or serves a different purpose.`;
    }
  }

  let level3 = `Look closely at the remaining choices: focus on the exact naming convention and expected behavior in ${lang}.`;
  if (opts[correct]) {
    const answerOpt = String(opts[correct]).replace(/<[^>]+>/g, "").trim();
    if (answerOpt.length > 0 && answerOpt.length < 20) {
      level3 = `The target answer relates directly to concepts matching: "${answerOpt.slice(0, Math.ceil(answerOpt.length / 2))}..."`;
    }
  }

  return [level1, level2, level3];
}

export function validateHint(hintText) {
  if (!hintText || typeof hintText !== "string" || hintText.trim().length < 8) return false;
  const cleanHint = hintText.toLowerCase().trim();
  if (cleanHint.includes("failed") || cleanHint.includes("error") || cleanHint.includes("undefined")) return false;
  return true;
}
