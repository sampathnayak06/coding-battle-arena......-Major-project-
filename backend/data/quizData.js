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

  if (!question.question || typeof question.question !== "string" || question.question.trim().length < 5) {
    console.warn(`❌ Invalid MCQ: Question text is missing or too short [ID: ${question.id || 'unknown'}]`);
    return false;
  }

  if (!Array.isArray(question.options) || question.options.length !== 4) {
    console.warn(`❌ Invalid MCQ: Must have exactly 4 options [ID: ${question.id || 'unknown'}]`);
    return false;
  }

  const uniqueOptions = new Set(question.options.map((o) => String(o).trim().toLowerCase()));
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
    const matchCount = question.options.filter((opt) => String(opt).trim() === String(question.correctAnswer).trim()).length;
    if (matchCount !== 1) {
      console.warn(`❌ Invalid MCQ: correctAnswer "${question.correctAnswer}" must match exactly 1 option in [${question.options.join(", ")}]`);
      return false;
    }
  }

  if (hasIndex && hasAnswer) {
    const expectedOpt = String(question.options[question.correctIndex]).trim();
    if (expectedOpt !== String(question.correctAnswer).trim()) {
      console.warn(`❌ Invalid MCQ: options[correctIndex] ("${expectedOpt}") does not match correctAnswer ("${question.correctAnswer}") [ID: ${question.id || 'unknown'}]`);
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
    const isMatched = validPrefixes.some((prefix) => qLang.includes(prefix) || (question.id && question.id.toLowerCase().startsWith(prefix)));
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

  let targetAnswer = question.correctAnswer;
  if (!targetAnswer && Number.isInteger(question.correctIndex) && originalOptions[question.correctIndex] !== undefined) {
    targetAnswer = originalOptions[question.correctIndex];
  }
  if (!targetAnswer) {
    targetAnswer = originalOptions[0];
  }

  // Shuffle options using Fisher-Yates
  const shuffledOptions = shuffle(originalOptions);
  let newCorrectIndex = shuffledOptions.findIndex((opt) => String(opt).trim() === String(targetAnswer).trim());
  if (newCorrectIndex === -1) {
    shuffledOptions[0] = targetAnswer;
    newCorrectIndex = 0;
  }

  const normalized = {
    ...question,
    options: shuffledOptions,
    correctIndex: newCorrectIndex,
    correctAnswer: shuffledOptions[newCorrectIndex]
  };

  validateMcq(normalized);
  return normalized;
}

// ---------------- MCQ QUESTIONS (Categorized by difficulty levels for all languages) ----------------
export const mcqQuestions = {
  html: [
    // --- EASY ---
    {
      id: "html_e1",
      type: "mcq",
      difficulty: "easy",
      question: "Which HTML tag is used to create a hyperlink?",
      options: ["<a>", "<link>", "<href>", "<nav>"],
      correctIndex: 0,
      correctAnswer: "<a>",
      explanation: "The <a> (anchor) tag with the href attribute defines hyperlinks pointing to external websites, local files, or page anchors.",
      hint: "Think of an anchor that links one page to another."
    },
    {
      id: "html_e2",
      type: "mcq",
      difficulty: "easy",
      question: "Which tag is used for the largest heading in HTML?",
      options: ["<h6>", "<heading>", "<h1>", "<head>"],
      correctIndex: 2,
      correctAnswer: "<h1>",
      explanation: "HTML supports heading tags from <h1> through <h6>, where <h1> designates top-level primary importance.",
      hint: "The lower the number in the heading tag, the higher its structural importance."
    },
    {
      id: "html_e3",
      type: "mcq",
      difficulty: "easy",
      question: "Which tag defines an unordered (bulleted) list?",
      options: ["<ol>", "<ul>", "<list>", "<li>"],
      correctIndex: 1,
      correctAnswer: "<ul>",
      explanation: "The <ul> element defines an unordered (bulleted) list, while <ol> creates an ordered (numbered) list.",
      hint: "Look for the abbreviation of 'unordered list'."
    },
    {
      id: "html_e4",
      type: "mcq",
      difficulty: "easy",
      question: "Which attribute specifies alternate text for an image?",
      options: ["title", "src", "desc", "alt"],
      correctIndex: 3,
      correctAnswer: "alt",
      explanation: "The alt attribute provides alternative text for accessibility screen readers and renders if image loading fails.",
      hint: "A three-letter abbreviation for 'alternative text'."
    },
    {
      id: "html_e5",
      type: "mcq",
      difficulty: "easy",
      question: "Which HTML element is used to insert a line break?",
      options: ["<lb>", "<break>", "<br>", "<newline>"],
      correctIndex: 2,
      correctAnswer: "<br>",
      explanation: "The <br> void tag inserts a standalone line break without creating a new block paragraph.",
      hint: "A two-letter tag that represents a line break."
    },
    {
      id: "html_e6",
      type: "mcq",
      difficulty: "easy",
      question: "Which HTML tag is used to define an internal style sheet?",
      options: ["<css>", "<style>", "<script>", "<stylesheet>"],
      correctIndex: 1,
      correctAnswer: "<style>",
      explanation: "Internal CSS styles are written inside the <style> element, typically placed within the <head> section.",
      hint: "Matches the English word used when modifying visual appearance."
    },
    {
      id: "html_e7",
      type: "mcq",
      difficulty: "easy",
      question: "Which HTML tag is used to embed an image into a web page?",
      options: ["<img>", "<image>", "<pic>", "<src>"],
      correctIndex: 0,
      correctAnswer: "<img>",
      explanation: "The <img> void element embeds an image and requires the 'src' attribute to point to the resource URL.",
      hint: "A common 3-letter abbreviation for image."
    },
    {
      id: "html_e8",
      type: "mcq",
      difficulty: "easy",
      question: "Which HTML attribute is used to apply inline CSS styling to an element?",
      options: ["class", "font", "styles", "style"],
      correctIndex: 3,
      correctAnswer: "style",
      explanation: "The style attribute allows writing inline CSS rules directly on an individual HTML element.",
      hint: "Use the singular noun form of style."
    },

    // --- MODERATE ---
    {
      id: "html_m1",
      type: "mcq",
      difficulty: "moderate",
      question: "Which HTML5 tag is used to play video content natively?",
      options: ["<media>", "<movie>", "<stream>", "<video>"],
      correctIndex: 3,
      correctAnswer: "<video>",
      explanation: "HTML5 introduced the standard <video> element to play media natively without external browser plugins.",
      hint: "Named directly after the audiovisual medium it renders."
    },
    {
      id: "html_m2",
      type: "mcq",
      difficulty: "moderate",
      question: "Which attribute makes a form input field mandatory before submission?",
      options: ["mandatory", "required", "validate", "needed"],
      correctIndex: 1,
      correctAnswer: "required",
      explanation: "The boolean 'required' attribute instructs the browser to block form submission if the field is empty.",
      hint: "An English adjective meaning necessary or compulsory."
    },
    {
      id: "html_m3",
      type: "mcq",
      difficulty: "moderate",
      question: "Which tag is used to embed JavaScript code inside HTML?",
      options: ["<script>", "<js>", "<javascript>", "<code>"],
      correctIndex: 0,
      correctAnswer: "<script>",
      explanation: "The <script> tag contains client-side executable JavaScript or references an external .js file via src.",
      hint: "A word meaning written programmatic instructions or screenplay."
    },
    {
      id: "html_m4",
      type: "mcq",
      difficulty: "moderate",
      question: "Which semantic element represents self-contained content like a blog post?",
      options: ["<section>", "<div>", "<article>", "<aside>"],
      correctIndex: 2,
      correctAnswer: "<article>",
      explanation: "The <article> semantic element denotes independent, self-contained content intended to be reusable and distributable.",
      hint: "Think of an entry in a newspaper, magazine, or blog publication."
    },
    {
      id: "html_m5",
      type: "mcq",
      difficulty: "moderate",
      question: "Which HTML5 input type provides a slider control for selecting a number in a range?",
      options: ["slider", "range", "number", "scroll"],
      correctIndex: 1,
      correctAnswer: "range",
      explanation: "The type='range' attribute turns an <input> into an interactive slider constrained between min and max values.",
      hint: "Refers to a continuous spectrum or span of numbers."
    },
    {
      id: "html_m6",
      type: "mcq",
      difficulty: "moderate",
      question: "Which element is used to group related form controls with a visual border?",
      options: ["<fieldset>", "<formgroup>", "<group>", "<box>"],
      correctIndex: 0,
      correctAnswer: "<fieldset>",
      explanation: "The <fieldset> element groups related form inputs together and is often captioned with a <legend> element.",
      hint: "A set of input fields combined together."
    },
    {
      id: "html_m7",
      type: "mcq",
      difficulty: "moderate",
      question: "What does target='_blank' on an anchor tag instruct the browser to do?",
      options: ["Opens link in a new tab or window", "Opens link in the same parent frame", "Replaces the entire browser history", "Clears form fields on click"],
      correctIndex: 0,
      correctAnswer: "Opens link in a new tab or window",
      explanation: "target='_blank' specifies that the hyperlink target should open in a fresh, new browsing context (tab or window).",
      hint: "The keyword 'blank' suggests starting with an empty, fresh context."
    },

    // --- HARD ---
    {
      id: "html_h1",
      type: "mcq",
      difficulty: "hard",
      question: "What does the 'defer' attribute on a <script> tag do?",
      options: ["Executes script after document is parsed", "Executes script immediately and blocks HTML parsing", "Prevents script execution until user clicks", "Loads script synchronously"],
      correctIndex: 0,
      correctAnswer: "Executes script after document is parsed",
      explanation: "The defer attribute downloads the script in parallel and executes it in sequential order only after HTML parsing finishes.",
      hint: "To defer something means to postpone execution until the document tree is ready."
    },
    {
      id: "html_h2",
      type: "mcq",
      difficulty: "hard",
      question: "Which HTML5 API allows storing key-value pairs locally in the browser with no expiration date?",
      options: ["sessionStorage", "localStorage", "Cookies", "WebSQL"],
      correctIndex: 1,
      correctAnswer: "localStorage",
      explanation: "localStorage stores data persistently across browser sessions until explicitly cleared by user or script.",
      hint: "Focus on client-side persistent storage bound to the local origin."
    },
    {
      id: "html_h3",
      type: "mcq",
      difficulty: "hard",
      question: "How does the 'async' attribute differ from 'defer' on external <script> tags?",
      options: ["async executes immediately upon download; defer waits until DOM parsing completes", "async blocks HTML parsing while downloading; defer does not", "async is only supported for module scripts; defer is for legacy scripts", "There is no difference in modern browsers"],
      correctIndex: 0,
      correctAnswer: "async executes immediately upon download; defer waits until DOM parsing completes",
      explanation: "async scripts execute as soon as they finish downloading (potentially out of order), whereas defer guarantees execution after DOM parsing.",
      hint: "One runs as soon as network bytes arrive; the other politely waits for DOM readiness."
    },
    {
      id: "html_h4",
      type: "mcq",
      difficulty: "hard",
      question: "Which meta viewport configuration guarantees proper responsive scaling on mobile screens?",
      options: ["width=device-width, initial-scale=1.0", "mobile-optimized=true, scalable=yes", "viewport-fit=auto, scale=max", "screen-width=100%, zoom=1"],
      correctIndex: 0,
      correctAnswer: "width=device-width, initial-scale=1.0",
      explanation: "width=device-width matches the screen's width in CSS pixels and initial-scale=1.0 establishes 1:1 scale on load.",
      hint: "Look for setting the viewport width equal to the physical device's width."
    },
    {
      id: "html_h5",
      type: "mcq",
      difficulty: "hard",
      question: "Which element provides a visual caption or header specifically for a <fieldset>?",
      options: ["<legend>", "<label>", "<caption-box>", "<title>"],
      correctIndex: 0,
      correctAnswer: "<legend>",
      explanation: "The <legend> tag must be the first child inside a <fieldset> to act as its accessible caption.",
      hint: "A term also used on maps to explain symbols."
    },
    {
      id: "html_h6",
      type: "mcq",
      difficulty: "hard",
      question: "What is the primary security purpose of 'rel=\"noopener noreferrer\"' on target='_blank' links?",
      options: ["Prevents window.opener exploitation and hides referrer header", "Accelerates SSL handshake for external domains", "Forces the target page to open inside a sandboxed iframe", "Enables browser caching for foreign assets"],
      correctIndex: 0,
      correctAnswer: "Prevents window.opener exploitation and hides referrer header",
      explanation: "rel='noopener' stops the newly opened window from accessing the opener via window.opener (preventing tabnabbing), and noreferrer suppresses referrer leaks.",
      hint: "It guards against reverse tabnabbing and stops sending the referrer origin."
    }
  ],

  css: [
    // --- EASY ---
    {
      id: "css_e1",
      type: "mcq",
      difficulty: "easy",
      question: "Which CSS property changes the text color of an element?",
      options: ["color", "font-color", "text-color", "background-color"],
      correctIndex: 0,
      correctAnswer: "color",
      explanation: "The 'color' property sets the foreground color of text and text decorations.",
      hint: "The simplest one-word English term for chromatic hue."
    },
    {
      id: "css_e2",
      type: "mcq",
      difficulty: "easy",
      question: "Which CSS property controls the outer spacing around an element?",
      options: ["padding", "margin", "spacing", "border"],
      correctIndex: 1,
      correctAnswer: "margin",
      explanation: "Margin controls transparent space outside the border of an element, separating it from adjacent elements.",
      hint: "Think of page margins surrounding a block of text."
    },
    {
      id: "css_e3",
      type: "mcq",
      difficulty: "easy",
      question: "How do you select an element with id 'header' in CSS?",
      options: [".header", "*header", "#header", "header{}"],
      correctIndex: 2,
      correctAnswer: "#header",
      explanation: "The hash symbol (#) is the ID selector in CSS, targeting an element with that unique id attribute.",
      hint: "The symbol used for hashtags or numbers."
    },
    {
      id: "css_e4",
      type: "mcq",
      difficulty: "easy",
      question: "Which property sets the size of text in CSS?",
      options: ["text-style", "text-size", "font-style", "font-size"],
      correctIndex: 3,
      correctAnswer: "font-size",
      explanation: "The font-size property specifies the dimension (e.g. px, rem, em) of the typeface glyphs.",
      hint: "Combines the word font with size."
    },
    {
      id: "css_e5",
      type: "mcq",
      difficulty: "easy",
      question: "How do you select all elements with the class 'card' in CSS?",
      options: [".card", "#card", "*card", "card[]"],
      correctIndex: 0,
      correctAnswer: ".card",
      explanation: "A period/dot (.) precedes class names in CSS selectors.",
      hint: "A single period/dot is used for class selectors."
    },
    {
      id: "css_e6",
      type: "mcq",
      difficulty: "easy",
      question: "Which CSS property controls the inner space between content and its border?",
      options: ["padding", "margin", "outline", "gap"],
      correctIndex: 0,
      correctAnswer: "padding",
      explanation: "Padding generates space inside an element, between the content box and the border.",
      hint: "Think of protective cushioning inside a package."
    },
    {
      id: "css_e7",
      type: "mcq",
      difficulty: "easy",
      question: "What is the default value of the 'position' property in CSS?",
      options: ["static", "relative", "absolute", "fixed"],
      correctIndex: 0,
      correctAnswer: "static",
      explanation: "By default, elements are positioned 'static', laying out according to the normal flow of the document.",
      hint: "A term meaning unmoving or following default layout flow."
    },
    {
      id: "css_e8",
      type: "mcq",
      difficulty: "easy",
      question: "Which CSS property makes text bold?",
      options: ["font-weight", "text-bold", "font-style", "font-variant"],
      correctIndex: 0,
      correctAnswer: "font-weight",
      explanation: "font-weight controls how thick or thin characters in text appear (e.g., bold or 700).",
      hint: "Think of the heaviness or thickness of characters."
    },

    // --- MODERATE ---
    {
      id: "css_m1",
      type: "mcq",
      difficulty: "moderate",
      question: "Which CSS layout model arranges items flexibly along a single row or column?",
      options: ["Grid", "Flexbox", "Float", "Table"],
      correctIndex: 1,
      correctAnswer: "Flexbox",
      explanation: "Flexbox (Flexible Box Layout) is designed for 1-dimensional layout distribution along a main axis.",
      hint: "Short for Flexible Box."
    },
    {
      id: "css_m2",
      type: "mcq",
      difficulty: "moderate",
      question: "Which property sets the gap between flex or grid items?",
      options: ["gap", "item-spacing", "flex-gap", "grid-space"],
      correctIndex: 0,
      correctAnswer: "gap",
      explanation: "The 'gap' shorthand defines the gutters between rows and columns in flex and grid containers.",
      hint: "A concise 3-letter word meaning an open space or interval."
    },
    {
      id: "css_m3",
      type: "mcq",
      difficulty: "moderate",
      question: "What does the CSS rule 'box-sizing: border-box' accomplish?",
      options: ["Includes padding and border within element's total width and height", "Excludes padding from element's dimensions", "Adds an extra shadow box around borders", "Hides the element border completely"],
      correctIndex: 0,
      correctAnswer: "Includes padding and border within element's total width and height",
      explanation: "border-box ensures that width and height specify the total outer dimension, absorbing padding and border inside.",
      hint: "Calculates total dimensions inclusive of padding and borders."
    },
    {
      id: "css_m4",
      type: "mcq",
      difficulty: "moderate",
      question: "Which CSS display value hides an element completely and removes it from document flow?",
      options: ["display: none", "visibility: hidden", "opacity: 0", "filter: blur()"],
      correctIndex: 0,
      correctAnswer: "display: none",
      explanation: "display: none removes the element from rendering, taking up 0 space, whereas visibility: hidden keeps the space reserved.",
      hint: "Sets display to the complete absence of rendering."
    },
    {
      id: "css_m5",
      type: "mcq",
      difficulty: "moderate",
      question: "Which CSS property specifies how flex items wrap when exceeding container width?",
      options: ["flex-wrap", "flex-flow", "wrap-mode", "flex-direction"],
      correctIndex: 0,
      correctAnswer: "flex-wrap",
      explanation: "flex-wrap (nowrap, wrap, wrap-reverse) determines whether flex children must stay on one line or wrap onto new rows.",
      hint: "Combines the flex layout prefix with the verb wrap."
    },
    {
      id: "css_m6",
      type: "mcq",
      difficulty: "moderate",
      question: "How do you horizontally and vertically center a child inside a flex container?",
      options: ["justify-content: center; align-items: center;", "text-align: center; vertical-align: middle;", "align-content: center; margin: auto 0;", "flex-align: both;"],
      correctIndex: 0,
      correctAnswer: "justify-content: center; align-items: center;",
      explanation: "justify-content: center aligns items on the main axis, and align-items: center centers along the cross axis.",
      hint: "Center both main axis and cross axis alignment properties."
    },

    // --- HARD ---
    {
      id: "css_h1",
      type: "mcq",
      difficulty: "hard",
      question: "In CSS specificity hierarchy, which selector combination has the highest precedence?",
      options: ["Element selector (div)", "Class selector (.card)", "ID selector (#hero)", "Universal selector (*)"],
      correctIndex: 2,
      correctAnswer: "ID selector (#hero)",
      explanation: "Specificity weight: ID (100) > Class/Attribute/Pseudo-class (10) > Element (1) > Universal (0).",
      hint: "The unique hash-based selector carries the greatest weight (100)."
    },
    {
      id: "css_h2",
      type: "mcq",
      difficulty: "hard",
      question: "What is the key difference between 'em' and 'rem' length units in CSS?",
      options: ["em is relative to parent font-size; rem is relative to root (html) font-size", "em is relative to root font-size; rem is relative to parent element", "em represents screen pixels; rem represents device pitch", "em is for typography only; rem is for layout widths only"],
      correctIndex: 0,
      correctAnswer: "em is relative to parent font-size; rem is relative to root (html) font-size",
      explanation: "rem stands for 'root em' and scales strictly from the <html> root font-size, avoiding nested compounding.",
      hint: "The letter 'r' in rem signifies 'root'."
    },
    {
      id: "css_h3",
      type: "mcq",
      difficulty: "hard",
      question: "Why do CSS 'transform' animations achieve 60fps smoother rendering than animating 'top/left'?",
      options: ["transform runs on GPU compositor thread without triggering layout reflow", "transform always forces full CPU repaint on each frame", "top and left bypass the browser layout engine", "transform is slower because it recalculates DOM tree"],
      correctIndex: 0,
      correctAnswer: "transform runs on GPU compositor thread without triggering layout reflow",
      explanation: "Transforms and opacity can be composited directly by GPU hardware without triggering expensive layout reflows or repaints.",
      hint: "GPU hardware compositor acceleration vs CPU document reflow."
    },
    {
      id: "css_h4",
      type: "mcq",
      difficulty: "hard",
      question: "What positioning requirement must an element meet for the 'z-index' property to take effect?",
      options: ["A positioned element (relative, absolute, fixed, or sticky)", "display: block or display: inline-block", "A defined width and height", "overflow: hidden"],
      correctIndex: 0,
      correctAnswer: "A positioned element (relative, absolute, fixed, or sticky)",
      explanation: "z-index only applies to elements that have a position value other than static (unless they are flex/grid items).",
      hint: "The element must have an explicit non-static positioning rule."
    },
    {
      id: "css_h5",
      type: "mcq",
      difficulty: "hard",
      question: "In CSS Grid, what does the 'fr' unit represent?",
      options: ["A fraction of the available free space in the grid container", "A fixed pixel measurement relative to frame rate", "A percentage of the viewport height", "A font-relative scaling factor"],
      correctIndex: 0,
      correctAnswer: "A fraction of the available free space in the grid container",
      explanation: "The fr unit distributes a fraction of remaining free container space after non-flexible tracks are sized.",
      hint: "An abbreviation for 'fractional unit' of leftover space."
    },
    {
      id: "css_h6",
      type: "mcq",
      difficulty: "hard",
      question: "What capability does the modern CSS ':has()' relational pseudo-class provide?",
      options: ["Functions as a parent selector styling an element based on its descendants", "Verifies whether an element has inline CSS style rules", "Checks if JavaScript scripts have finished loading", "Applies animations only after keyframe triggers fire"],
      correctIndex: 0,
      correctAnswer: "Functions as a parent selector styling an element based on its descendants",
      explanation: ":has() enables parent-aware and preceding-sibling selection based on descendant matching condition.",
      hint: "Commonly referred to as the long-awaited CSS parent selector."
    }
  ],

  javascript: [
    // --- EASY ---
    {
      id: "js_e1",
      type: "mcq",
      difficulty: "easy",
      question: "Which keyword declares a block-scoped variable in JavaScript?",
      options: ["var", "let", "static", "def"],
      correctIndex: 1,
      correctAnswer: "let",
      explanation: "'let' declares block-scoped local variables that can be reassigned, avoiding 'var' function-scoping leaks.",
      hint: "Introduced in ES6 to declare reassignable block-scoped variables."
    },
    {
      id: "js_e2",
      type: "mcq",
      difficulty: "easy",
      question: "What does the '===' operator check in JavaScript?",
      options: ["Value only", "Type only", "Value and type", "Memory address"],
      correctIndex: 2,
      correctAnswer: "Value and type",
      explanation: "Strict equality (===) validates that both operands have identical values and matching types without coercion.",
      hint: "Strict equality evaluates both criteria without type coercion."
    },
    {
      id: "js_e3",
      type: "mcq",
      difficulty: "easy",
      question: "Which array method appends an element to the end of an array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
      correctIndex: 0,
      correctAnswer: "push()",
      explanation: "Array.prototype.push() adds one or more elements to the end of an array and returns the new length.",
      hint: "Think of pushing an item onto the top or end of a collection."
    },
    {
      id: "js_e4",
      type: "mcq",
      difficulty: "easy",
      question: "Which keyword declares a constant variable that cannot be reassigned?",
      options: ["const", "final", "static", "val"],
      correctIndex: 0,
      correctAnswer: "const",
      explanation: "const creates block-scoped read-only identifiers that cannot be reassigned after initialization.",
      hint: "A 5-letter abbreviation of constant."
    },
    {
      id: "js_e5",
      type: "mcq",
      difficulty: "easy",
      question: "Which built-in property returns the total number of characters in a JavaScript string?",
      options: [".length", ".size()", ".count()", ".len()"],
      correctIndex: 0,
      correctAnswer: ".length",
      explanation: "In JavaScript, string and array lengths are accessed via the '.length' property, not a method call.",
      hint: "A standard property name representing size without parentheses."
    },
    {
      id: "js_e6",
      type: "mcq",
      difficulty: "easy",
      question: "Which function parses a string argument and returns an integer in JavaScript?",
      options: ["parseInt()", "toInteger()", "Number.int()", "parseNum()"],
      correctIndex: 0,
      correctAnswer: "parseInt()",
      explanation: "parseInt(string, radix) parses string input and returns an integer of the specified radix.",
      hint: "Combines 'parse' with 'Int'."
    },
    {
      id: "js_e7",
      type: "mcq",
      difficulty: "easy",
      question: "What does Array.prototype.pop() do?",
      options: ["Removes the last element from an array and returns it", "Removes the first element from an array", "Appends an item to an array", "Sorts the array in place"],
      correctIndex: 0,
      correctAnswer: "Removes the last element from an array and returns it",
      explanation: "pop() removes the final element from an array, mutates the array length, and returns the removed element.",
      hint: "The opposite of push(); operates on the last element."
    },
    {
      id: "js_e8",
      type: "mcq",
      difficulty: "easy",
      question: "Which operator represents logical NOT in JavaScript?",
      options: ["!", "~", "not", "^"],
      correctIndex: 0,
      correctAnswer: "!",
      explanation: "The exclamation mark (!) is the logical NOT operator that inverts the truthiness of an expression.",
      hint: "The exclamation point symbol."
    },

    // --- MODERATE ---
    {
      id: "js_m1",
      type: "mcq",
      difficulty: "moderate",
      question: "What does Array.prototype.reduce() do?",
      options: ["Filters array elements", "Reduces array to a single accumulated value", "Sorts array in place", "Transforms each element into a new array"],
      correctIndex: 1,
      correctAnswer: "Reduces array to a single accumulated value",
      explanation: "reduce() runs an accumulator callback function against each value of the array to distill it into a single output value.",
      hint: "Iterates through elements accumulating them into a single result."
    },
    {
      id: "js_m2",
      type: "mcq",
      difficulty: "moderate",
      question: "What is a JavaScript closure?",
      options: ["A function that executes immediately", "A function bundled with references to its surrounding lexical environment", "A method to close browser tabs", "A block statement wrapped in curly braces"],
      correctIndex: 1,
      correctAnswer: "A function bundled with references to its surrounding lexical environment",
      explanation: "A closure gives a function access to its outer lexical scope even after the outer function has finished executing.",
      hint: "It allows inner functions to remember variables from outer scopes."
    },
    {
      id: "js_m3",
      type: "mcq",
      difficulty: "moderate",
      question: "Which method converts a JavaScript object into a JSON string?",
      options: ["JSON.parse()", "JSON.stringify()", "Object.toJSON()", "JSON.encode()"],
      correctIndex: 1,
      correctAnswer: "JSON.stringify()",
      explanation: "JSON.stringify() serializes a JavaScript object, array, or primitive into a formatted JSON string.",
      hint: "Turns an object into a 'string'."
    },
    {
      id: "js_m4",
      type: "mcq",
      difficulty: "moderate",
      question: "How does Array.prototype.map() differ from forEach()?",
      options: ["map returns a new array with transformed elements; forEach returns undefined", "map mutates the original array; forEach does not", "forEach can be chained with promises; map cannot", "map only works on numbers"],
      correctIndex: 0,
      correctAnswer: "map returns a new array with transformed elements; forEach returns undefined",
      explanation: "map() constructs and returns a new array with callback transformation results, while forEach() executes side-effects and returns undefined.",
      hint: "One produces a brand-new array; the other simply iterates."
    },
    {
      id: "js_m5",
      type: "mcq",
      difficulty: "moderate",
      question: "What does the 'Promise.all()' method do?",
      options: ["Resolves when all promises resolve or rejects when any promise rejects", "Resolves as soon as the fastest promise resolves", "Executes promises sequentially in order", "Catches all errors without rejecting"],
      correctIndex: 0,
      correctAnswer: "Resolves when all promises resolve or rejects when any promise rejects",
      explanation: "Promise.all() waits for every promise in the iterable to fulfill, but immediately rejects if any single promise fails.",
      hint: "An all-or-nothing concurrency helper."
    },
    {
      id: "js_m6",
      type: "mcq",
      difficulty: "moderate",
      question: "What does the spread syntax '...' do when used on an object literal?",
      options: ["Copies own enumerable properties from one object to another", "Deletes all nested properties", "Freezes object properties from mutation", "Creates a circular reference"],
      correctIndex: 0,
      correctAnswer: "Copies own enumerable properties from one object to another",
      explanation: "The object spread operator shallow-copies key-value pairs from source objects into the target object.",
      hint: "Three dots used to expand or shallow-copy properties."
    },

    // --- HARD ---
    {
      id: "js_h1",
      type: "mcq",
      difficulty: "hard",
      question: "What is the output of typeof NaN in JavaScript?",
      options: ["'NaN'", "'undefined'", "'number'", "'object'"],
      correctIndex: 2,
      correctAnswer: "'number'",
      explanation: "According to the IEEE 754 floating-point specification and ECMAScript standard, NaN is a numeric type value.",
      hint: "Despite meaning 'Not a Number', its technical type is still numeric."
    },
    {
      id: "js_h2",
      type: "mcq",
      difficulty: "hard",
      question: "In the Event Loop, which queue takes priority right after call stack empties?",
      options: ["Macrotask queue (setTimeout)", "Microtask queue (Promise callbacks / process.nextTick)", "RequestAnimationFrame queue", "I/O polling queue"],
      correctIndex: 1,
      correctAnswer: "Microtask queue (Promise callbacks / process.nextTick)",
      explanation: "Microtasks (Promise reactions, queueMicrotask) are drained completely before the event loop advances to the next macrotask.",
      hint: "The prefix 'micro' indicates higher priority before macro timers."
    },
    {
      id: "js_h3",
      type: "mcq",
      difficulty: "hard",
      question: "What happens when calling Object.freeze() on an object with nested child objects?",
      options: ["Only shallow top-level properties are frozen; nested objects remain mutable", "All nested child objects are recursively frozen automatically", "A TypeError is thrown if nested objects exist", "The object is duplicated into local storage"],
      correctIndex: 0,
      correctAnswer: "Only shallow top-level properties are frozen; nested objects remain mutable",
      explanation: "Object.freeze() performs a shallow freeze. Nested reference properties can still be modified unless deep-frozen.",
      hint: "Freezing is shallow by default unless manually recursed."
    },
    {
      id: "js_h4",
      type: "mcq",
      difficulty: "hard",
      question: "What is the result of '[] + []' and '[] + {}' in JavaScript?",
      options: ["'' and '[object Object]'", "'[]' and '[object Object]'", "0 and 0", "TypeError in strict mode"],
      correctIndex: 0,
      correctAnswer: "'' and '[object Object]'",
      explanation: "The + operator converts array operands via toString(). [] becomes '', producing '' and '[object Object]'.",
      hint: "Arrays convert to empty strings via toString()."
    },
    {
      id: "js_h5",
      type: "mcq",
      difficulty: "hard",
      question: "What does the Symbol primitive provide in JavaScript?",
      options: ["A guaranteed globally unique and immutable identifier", "An integer pointer to raw C++ memory", "A reactive data binding observable", "A cryptographically secure random number"],
      correctIndex: 0,
      correctAnswer: "A guaranteed globally unique and immutable identifier",
      explanation: "Symbols are unique, immutable primitive values used as non-colliding object property keys.",
      hint: "Every created instance is guaranteed distinct from every other."
    },
    {
      id: "js_h6",
      type: "mcq",
      difficulty: "hard",
      question: "What does the 'bind()' method do to a JavaScript function?",
      options: ["Creates a new function with this set to the provided value", "Calls the function immediately with given arguments", "Locks the function against garbage collection", "Converts the function into a Web Worker"],
      correctIndex: 0,
      correctAnswer: "Creates a new function with this set to the provided value",
      explanation: "Function.prototype.bind creates a new bound function that wraps the original function object with its 'this' context preset.",
      hint: "Permanently binds 'this' context into a new copy of the function."
    }
  ],

  python: [
    // --- EASY ---
    {
      id: "py_e1",
      type: "mcq",
      difficulty: "easy",
      question: "What is the standard file extension for Python scripts?",
      options: [".py", ".pt", ".pyt", ".python"],
      correctIndex: 0,
      correctAnswer: ".py",
      explanation: "Python source code scripts use the .py file extension.",
      hint: "Two-letter abbreviation starting with p."
    },
    {
      id: "py_e2",
      type: "mcq",
      difficulty: "easy",
      question: "How do you write a single-line comment in Python?",
      options: ["// comment", "# comment", "<!-- comment -->", "/* comment */"],
      correctIndex: 1,
      correctAnswer: "# comment",
      explanation: "Python uses the hash (#) character to denote single-line comments.",
      hint: "The hashtag / pound symbol."
    },
    {
      id: "py_e3",
      type: "mcq",
      difficulty: "easy",
      question: "Which built-in function returns the total number of items in a list?",
      options: ["size()", "count()", "len()", "length()"],
      correctIndex: 2,
      correctAnswer: "len()",
      explanation: "The built-in len() function returns the number of items in a container or string.",
      hint: "Short for length."
    },
    {
      id: "py_e4",
      type: "mcq",
      difficulty: "easy",
      question: "Which Python collection stores key-value pairs?",
      options: ["List", "Tuple", "Set", "Dictionary"],
      correctIndex: 3,
      correctAnswer: "Dictionary",
      explanation: "Dictionaries (dict) in Python store associative key-value mappings indexed by unique keys.",
      hint: "A book reference that maps terms to definitions."
    },
    {
      id: "py_e5",
      type: "mcq",
      difficulty: "easy",
      question: "Which data type in Python represents an ordered, immutable sequence?",
      options: ["list", "dict", "tuple", "set"],
      correctIndex: 2,
      correctAnswer: "tuple",
      explanation: "Tuples are immutable ordered sequences defined with parentheses; elements cannot be modified once set.",
      hint: "Enclosed in round parentheses, cannot be modified after creation."
    },
    {
      id: "py_e6",
      type: "mcq",
      difficulty: "easy",
      question: "Which keyword is used to define a function in Python?",
      options: ["def", "function", "func", "define"],
      correctIndex: 0,
      correctAnswer: "def",
      explanation: "The 'def' keyword introduces a function definition in Python.",
      hint: "Short for define."
    },
    {
      id: "py_e7",
      type: "mcq",
      difficulty: "easy",
      question: "How do you start an indefinite conditional loop in Python?",
      options: ["while condition:", "loop condition:", "repeat condition:", "until condition:"],
      correctIndex: 0,
      correctAnswer: "while condition:",
      explanation: "The 'while' statement executes its block repeatedly as long as the condition evaluates to True.",
      hint: "Runs 'while' the condition holds true."
    },
    {
      id: "py_e8",
      type: "mcq",
      difficulty: "easy",
      question: "Which method removes and returns the last item from a list in Python?",
      options: [".pop()", ".remove()", ".delete()", ".drop()"],
      correctIndex: 0,
      correctAnswer: ".pop()",
      explanation: "list.pop() removes and returns the element at the specified index, defaulting to the last element.",
      hint: "Pops the element off the end."
    },

    // --- MODERATE ---
    {
      id: "py_m1",
      type: "mcq",
      difficulty: "moderate",
      question: "What is the result of list comprehension `[x * 2 for x in range(3)]`?",
      options: ["[0, 2, 4]", "[1, 2, 3]", "[0, 1, 2]", "[2, 4, 6]"],
      correctIndex: 0,
      correctAnswer: "[0, 2, 4]",
      explanation: "range(3) produces 0, 1, 2. Multiplying each item by 2 generates the list [0, 2, 4].",
      hint: "range(3) generates 0, 1, and 2. Multiply each by 2."
    },
    {
      id: "py_m2",
      type: "mcq",
      difficulty: "moderate",
      question: "What does the 'yield' keyword do inside a Python function?",
      options: ["Returns a final value and terminates function", "Turns function into a generator producing values lazily", "Raises a runtime exception", "Pauses execution without returning values"],
      correctIndex: 1,
      correctAnswer: "Turns function into a generator producing values lazily",
      explanation: "yield produces a value and suspends function state, turning the function into an iterable generator object.",
      hint: "Turns the function into an iterable generator."
    },
    {
      id: "py_m3",
      type: "mcq",
      difficulty: "moderate",
      question: "What is the difference between 'is' and '==' in Python?",
      options: ["'is' checks object identity (same memory address); '==' checks value equality", "'is' checks value equality; '==' checks memory location", "'is' is only for numbers; '==' is for strings", "There is no difference in Python 3"],
      correctIndex: 0,
      correctAnswer: "'is' checks object identity (same memory address); '==' checks value equality",
      explanation: "== checks if values are equivalent via __eq__, while 'is' checks if both variables point to the exact same object in memory.",
      hint: "One checks if they are the exact same instance in memory; the other checks if contents match."
    },
    {
      id: "py_m4",
      type: "mcq",
      difficulty: "moderate",
      question: "What does the '*args' parameter syntax in a function definition do?",
      options: ["Allows passing a variable number of non-keyword arguments as a tuple", "Enforces strict type checks on input arguments", "Passes arguments by memory pointer reference", "Restricts arguments to numbers only"],
      correctIndex: 0,
      correctAnswer: "Allows passing a variable number of non-keyword arguments as a tuple",
      explanation: "*args packs arbitrary positional arguments into a tuple inside the function body.",
      hint: "Collects positional arguments into a tuple."
    },
    {
      id: "py_m5",
      type: "mcq",
      difficulty: "moderate",
      question: "What does the 'with' statement in Python guarantee when managing resources?",
      options: ["Resources are automatically closed/released via __exit__ even if exceptions occur", "Variables inside the block are kept private", "Code executes on a separate parallel thread", "Prevents memory leaks by disabling garbage collection"],
      correctIndex: 0,
      correctAnswer: "Resources are automatically closed/released via __exit__ even if exceptions occur",
      explanation: "The with statement uses the context management protocol (__enter__ and __exit__) to guarantee cleanup of files, locks, and network handles.",
      hint: "Ensures cleanup and resource release upon exiting the block."
    },
    {
      id: "py_m6",
      type: "mcq",
      difficulty: "moderate",
      question: "What is the boolean evaluation of `bool([])` and `bool([0])` in Python?",
      options: ["False and True", "True and True", "False and False", "True and False"],
      correctIndex: 0,
      correctAnswer: "False and True",
      explanation: "Empty collections evaluate to False in Python truthiness tests; non-empty collections evaluate to True.",
      hint: "Empty containers are falsy; non-empty containers are truthy."
    },

    // --- HARD ---
    {
      id: "py_h1",
      type: "mcq",
      difficulty: "hard",
      question: "What is the average time complexity of key lookup in a Python dict?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
      correctIndex: 2,
      correctAnswer: "O(1)",
      explanation: "Python dictionaries use hash tables, achieving amortized constant O(1) time complexity for key lookups.",
      hint: "Hash table lookups take constant amortized time."
    },
    {
      id: "py_h2",
      type: "mcq",
      difficulty: "hard",
      question: "What is the role of the Global Interpreter Lock (GIL) in CPython?",
      options: ["Prevents multiple native threads from executing Python bytecodes simultaneously", "Prevents CPU over-clocking during heavy loops", "Encrypts Python bytecode in memory", "Locks files during disk write operations"],
      correctIndex: 0,
      correctAnswer: "Prevents multiple native threads from executing Python bytecodes simultaneously",
      explanation: "The GIL is a mutex synchronizing CPython memory management by ensuring only one thread runs bytecode at any moment.",
      hint: "A mutex that restricts concurrent Python bytecode execution to a single thread."
    },
    {
      id: "py_h3",
      type: "mcq",
      difficulty: "hard",
      question: "How does declaring '__slots__' optimize a Python class?",
      options: ["Restricts allowed attributes and replaces the per-instance __dict__ to save memory", "Pre-compiles methods to assembly bytecode", "Enforces static C-style types on all variables", "Prevents class inheritance"],
      correctIndex: 0,
      correctAnswer: "Restricts allowed attributes and replaces the per-instance __dict__ to save memory",
      explanation: "__slots__ reserves space for a fixed set of attributes, eliminating the memory overhead of a __dict__ for every instance.",
      hint: "Eliminates the internal dictionary for instance attributes."
    },
    {
      id: "py_h4",
      type: "mcq",
      difficulty: "hard",
      question: "Which method resolution order (MRO) algorithm is used in Python 3?",
      options: ["C3 Linearization", "Depth-First Search", "Breadth-First Search", "Dijkstra's Algorithm"],
      correctIndex: 0,
      correctAnswer: "C3 Linearization",
      explanation: "Python uses the C3 Linearization algorithm to determine a consistent method resolution order in complex inheritance hierarchies.",
      hint: "Named after the C3 superclass ordering algorithm."
    },
    {
      id: "py_h5",
      type: "mcq",
      difficulty: "hard",
      question: "What is the difference between copy.copy() and copy.deepcopy() in Python?",
      options: ["deepcopy duplicates compound objects and recursively copies all nested elements", "copy duplicates nested objects; deepcopy copies top-level only", "deepcopy only works on dictionaries", "copy converts mutable objects to tuples"],
      correctIndex: 0,
      correctAnswer: "deepcopy duplicates compound objects and recursively copies all nested elements",
      explanation: "copy.copy() performs a shallow copy duplicating references, while copy.deepcopy() recursively clones all nested objects.",
      hint: "Deep recursively clones nested references."
    },
    {
      id: "py_h6",
      type: "mcq",
      difficulty: "hard",
      question: "What does the @classmethod decorator pass as its first implicit argument?",
      options: ["The class itself (cls)", "The instance object (self)", "The module object", "None"],
      correctIndex: 0,
      correctAnswer: "The class itself (cls)",
      explanation: "@classmethod binds the method to the class rather than an instance, passing 'cls' as the first parameter.",
      hint: "Receives 'cls' as its first parameter."
    }
  ],

  java: [
    // --- EASY ---
    {
      id: "java_e1",
      type: "mcq",
      difficulty: "easy",
      question: "Which method serves as the entry point for a standalone Java application?",
      options: ["public static void main(String[] args)", "public void start()", "public static void run()", "public void init()"],
      correctIndex: 0,
      correctAnswer: "public static void main(String[] args)",
      explanation: "The JVM looks for the exact signature 'public static void main(String[] args)' to launch an application.",
      hint: "Begins with public static void main."
    },
    {
      id: "java_e2",
      type: "mcq",
      difficulty: "easy",
      question: "Which keyword is used to declare a class in Java?",
      options: ["class", "object", "define", "structure"],
      correctIndex: 0,
      correctAnswer: "class",
      explanation: "In Java, every program unit is wrapped inside a class declared with the 'class' keyword.",
      hint: "A standard 5-letter object-oriented keyword."
    },
    {
      id: "java_e3",
      type: "mcq",
      difficulty: "easy",
      question: "Which keyword is used for class inheritance in Java?",
      options: ["implements", "extends", "inherits", "super"],
      correctIndex: 1,
      correctAnswer: "extends",
      explanation: "The 'extends' keyword establishes inheritance between a subclass and its superclass.",
      hint: "Indicates that a subclass expands upon a base class."
    },
    {
      id: "java_e4",
      type: "mcq",
      difficulty: "easy",
      question: "Which keyword is used to implement an interface in Java?",
      options: ["extends", "implements", "interface", "using"],
      correctIndex: 1,
      correctAnswer: "implements",
      explanation: "A class realizes an interface contract in Java using the 'implements' keyword.",
      hint: "Directly matches the verb form of implementing a contract."
    },
    {
      id: "java_e5",
      type: "mcq",
      difficulty: "easy",
      question: "Which data type is used for double-precision decimal values in Java?",
      options: ["int", "boolean", "double", "char"],
      correctIndex: 2,
      correctAnswer: "double",
      explanation: "The 'double' keyword specifies a 64-bit IEEE 754 floating-point primitive number.",
      hint: "64-bit precision floating point."
    },
    {
      id: "java_e6",
      type: "mcq",
      difficulty: "easy",
      question: "Which access modifier restricts visibility to the defining class only?",
      options: ["public", "protected", "package-private", "private"],
      correctIndex: 3,
      correctAnswer: "private",
      explanation: "Members marked 'private' are inaccessible to any other class, even subclasses.",
      hint: "Keeps class members completely confidential."
    },
    {
      id: "java_e7",
      type: "mcq",
      difficulty: "easy",
      question: "Which Java operator dynamically allocates memory on the heap for an object?",
      options: ["new", "create", "alloc", "instantiate"],
      correctIndex: 0,
      correctAnswer: "new",
      explanation: "The 'new' operator allocates memory on the heap and invokes the constructor to initialize the instance.",
      hint: "A 3-letter keyword meaning fresh or newly made."
    },
    {
      id: "java_e8",
      type: "mcq",
      difficulty: "easy",
      question: "Which package is automatically imported into every Java program without an import statement?",
      options: ["java.lang", "java.util", "java.io", "java.net"],
      correctIndex: 0,
      correctAnswer: "java.lang",
      explanation: "java.lang contains fundamental classes (Object, String, Math, System, Thread) and is imported automatically.",
      hint: "Contains core language primitives and classes."
    },

    // --- MODERATE ---
    {
      id: "java_m1",
      type: "mcq",
      difficulty: "moderate",
      question: "What is the time complexity of retrieving an element by index in an ArrayList in Java?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"],
      correctIndex: 2,
      correctAnswer: "O(1)",
      explanation: "ArrayList is backed by a contiguous internal array, offering constant O(1) index-based access.",
      hint: "Array index calculation is instantaneous constant time."
    },
    {
      id: "java_m2",
      type: "mcq",
      difficulty: "moderate",
      question: "Which keyword prevents a class from being subclassed in Java?",
      options: ["static", "private", "final", "sealed"],
      correctIndex: 2,
      correctAnswer: "final",
      explanation: "Declaring a class 'final' forbids inheritance, preventing other classes from extending it.",
      hint: "Marks the class definition as conclusive and unchangeable."
    },
    {
      id: "java_m3",
      type: "mcq",
      difficulty: "moderate",
      question: "Which collection interface in Java does NOT allow duplicate elements?",
      options: ["List", "Set", "Map", "Queue"],
      correctIndex: 1,
      correctAnswer: "Set",
      explanation: "java.util.Set models mathematical sets and ensures uniqueness; duplicates are rejected.",
      hint: "A mathematical collection of distinct unique elements."
    },
    {
      id: "java_m4",
      type: "mcq",
      difficulty: "moderate",
      question: "How does String differ from StringBuilder in Java?",
      options: ["String is immutable; StringBuilder is mutable", "String is mutable; StringBuilder is immutable", "String stores bytes; StringBuilder stores characters", "There is no difference in Java 17+"],
      correctIndex: 0,
      correctAnswer: "String is immutable; StringBuilder is mutable",
      explanation: "String objects cannot be altered once created; StringBuilder provides a mutable char buffer for efficient concatenation.",
      hint: "One cannot be altered in-place; the other builds strings dynamically."
    },
    {
      id: "java_m5",
      type: "mcq",
      difficulty: "moderate",
      question: "What does the 'equals()' method check by default if not overridden in Object?",
      options: ["Memory reference identity (same as ==)", "Alphabetical order of fields", "Deep byte comparison", "Hash code parity"],
      correctIndex: 0,
      correctAnswer: "Memory reference identity (same as ==)",
      explanation: "java.lang.Object's default equals() implementation tests reference identity: this == obj.",
      hint: "Defaults to comparing object reference addresses."
    },
    {
      id: "java_m6",
      type: "mcq",
      difficulty: "moderate",
      question: "Which runtime exception is thrown when attempting to invoke a method on a null reference?",
      options: ["NullPointerException", "IllegalArgumentException", "IndexOutOfBoundsException", "ClassCastException"],
      correctIndex: 0,
      correctAnswer: "NullPointerException",
      explanation: "Attempting to dereference a null pointer throws NullPointerException (NPE).",
      hint: "The classic NPE."
    },

    // --- HARD ---
    {
      id: "java_h1",
      type: "mcq",
      difficulty: "hard",
      question: "What memory visibility guarantee does the 'volatile' keyword provide in Java?",
      options: ["Atomic execution of compound statements", "Immediate visibility of variable writes across thread CPU caches", "Prevents deadlocks", "Locks the object monitor"],
      correctIndex: 1,
      correctAnswer: "Immediate visibility of variable writes across thread CPU caches",
      explanation: "volatile ensures changes to a variable are written directly to main memory and read from main memory across all threads.",
      hint: "Guarantees thread-safe visibility without thread locks."
    },
    {
      id: "java_h2",
      type: "mcq",
      difficulty: "hard",
      question: "What is the purpose of the String Pool in the Java Virtual Machine?",
      options: ["To save heap memory by sharing identical string literals", "To encrypt sensitive strings in memory", "To execute string regex queries faster", "To store string objects exclusively off-heap"],
      correctIndex: 0,
      correctAnswer: "To save heap memory by sharing identical string literals",
      explanation: "The String Pool caches string literals in the JVM heap to avoid duplicate object allocations.",
      hint: "Reuses identical string literals to conserve memory."
    },
    {
      id: "java_h3",
      type: "mcq",
      difficulty: "hard",
      question: "How does a tracing Java Garbage Collector handle circular references between unreachable objects?",
      options: ["Reclaims them because GC uses root reachability (GC Roots), not reference counting", "Fails to free them, causing permanent memory leaks", "Crashes the JVM with OutOfMemoryError immediately", "Requires manual cleanup via finalize()"],
      correctIndex: 0,
      correctAnswer: "Reclaims them because GC uses root reachability (GC Roots), not reference counting",
      explanation: "Java GC traverses from GC Roots (stack frames, static references); islands of unreachability are cleaned regardless of cycles.",
      hint: "Tracing garbage collectors evaluate reachability from GC Roots."
    },
    {
      id: "java_h4",
      type: "mcq",
      difficulty: "hard",
      question: "What is the difference between Comparable and Comparator in Java?",
      options: ["Comparable defines natural ordering via compareTo; Comparator defines custom ordering via compare", "Comparable is in java.util; Comparator is in java.lang", "Comparator is for primitives only; Comparable is for objects", "Comparable sorts in reverse order only"],
      correctIndex: 0,
      correctAnswer: "Comparable defines natural ordering via compareTo; Comparator defines custom ordering via compare",
      explanation: "Comparable is implemented on a class to define its natural order; Comparator is an external strategy providing custom ordering logic.",
      hint: "One is internal natural ordering; the other is external comparison strategy."
    },
    {
      id: "java_h5",
      type: "mcq",
      difficulty: "hard",
      question: "What does the 'transient' modifier indicate on a field in Java?",
      options: ["The field will not be serialized during Java object serialization", "The field is destroyed immediately after method returns", "The field cannot be modified by multiple threads", "The field is stored in CPU registers only"],
      correctIndex: 0,
      correctAnswer: "The field will not be serialized during Java object serialization",
      explanation: "Fields marked 'transient' are skipped by the serialization mechanism when saving object state.",
      hint: "Exempts a member from being serialized to a byte stream."
    },
    {
      id: "java_h6",
      type: "mcq",
      difficulty: "hard",
      question: "What is Type Erasure in Java Generics?",
      options: ["Generic type arguments are removed at compile-time and replaced with raw types/casts", "Runtime checks verify type parameters on every method call", "Generics are translated to C++ templates at runtime", "All generic classes are converted to abstract classes"],
      correctIndex: 0,
      correctAnswer: "Generic type arguments are removed at compile-time and replaced with raw types/casts",
      explanation: "To preserve backwards binary compatibility with legacy pre-Java 5 JVMs, generics are erased to raw types at compile time.",
      hint: "Type parameters are erased during compilation for backwards compatibility."
    }
  ],

  cpp: [
    // --- EASY ---
    {
      id: "cpp_e1",
      type: "mcq",
      difficulty: "easy",
      question: "Which standard header file is required for console I/O (std::cout) in C++?",
      options: ["<stdio.h>", "<iostream>", "<io.h>", "<stream>"],
      correctIndex: 1,
      correctAnswer: "<iostream>",
      explanation: "<iostream> defines the standard input/output stream objects: std::cin, std::cout, std::cerr.",
      hint: "Input/Output stream header."
    },
    {
      id: "cpp_e2",
      type: "mcq",
      difficulty: "easy",
      question: "Which keyword declares a constant variable in C++?",
      options: ["final", "const", "static", "readonly"],
      correctIndex: 1,
      correctAnswer: "const",
      explanation: "The const keyword qualifies a variable as immutable after initialization.",
      hint: "Standard 5-letter keyword for constant."
    },
    {
      id: "cpp_e3",
      type: "mcq",
      difficulty: "easy",
      question: "Which symbol is used for pointer variable declaration in C++?",
      options: ["&", "*", "#", "@"],
      correctIndex: 1,
      correctAnswer: "*",
      explanation: "An asterisk (*) indicates a pointer type declaration (e.g., int* ptr) and dereferencing.",
      hint: "The star/asterisk symbol."
    },
    {
      id: "cpp_e4",
      type: "mcq",
      difficulty: "easy",
      question: "Which operator allocates dynamic memory on the heap in C++?",
      options: ["malloc", "new", "alloc", "create"],
      correctIndex: 1,
      correctAnswer: "new",
      explanation: "The 'new' operator allocates dynamic memory on the free store (heap) and initializes the object.",
      hint: "C++ keyword for heap allocation that calls constructors."
    },
    {
      id: "cpp_e5",
      type: "mcq",
      difficulty: "easy",
      question: "Which operator deallocates memory allocated with 'new' in C++?",
      options: ["delete", "free", "destroy", "remove"],
      correctIndex: 0,
      correctAnswer: "delete",
      explanation: "'delete' invokes the destructor and frees the heap memory allocated by 'new'.",
      hint: "Pairs with 'new'."
    },
    {
      id: "cpp_e6",
      type: "mcq",
      difficulty: "easy",
      question: "What is the scope resolution operator in C++?",
      options: ["::", "->", ".", "##"],
      correctIndex: 0,
      correctAnswer: "::",
      explanation: "The double colon (::) is the scope resolution operator used to qualify namespaces, classes, and global scope.",
      hint: "Two colons together."
    },
    {
      id: "cpp_e7",
      type: "mcq",
      difficulty: "easy",
      question: "What file extension is standard for C++ source implementation files?",
      options: [".cpp", ".cp", ".cxx+", ".cplus"],
      correctIndex: 0,
      correctAnswer: ".cpp",
      explanation: ".cpp is the universal convention for C++ source files.",
      hint: "Three letters ending in pp."
    },
    {
      id: "cpp_e8",
      type: "mcq",
      difficulty: "easy",
      question: "Which boolean literals are part of fundamental C++ types?",
      options: ["true and false", "TRUE and FALSE only", "1 and 0 only", "yes and no"],
      correctIndex: 0,
      correctAnswer: "true and false",
      explanation: "C++ defines 'bool' as a fundamental primitive type with boolean literals 'true' and 'false'.",
      hint: "Lowercase truth literals."
    },

    // --- MODERATE ---
    {
      id: "cpp_m1",
      type: "mcq",
      difficulty: "moderate",
      question: "Which STL container stores unique elements in strictly sorted order?",
      options: ["std::vector", "std::set", "std::list", "std::deque"],
      correctIndex: 1,
      correctAnswer: "std::set",
      explanation: "std::set is typically implemented as a self-balancing binary search tree (Red-Black tree) keeping unique elements sorted.",
      hint: "A set of unique elements maintained in sorted order."
    },
    {
      id: "cpp_m2",
      type: "mcq",
      difficulty: "moderate",
      question: "Which STL container provides dynamic contiguous array storage with O(1) random access?",
      options: ["std::vector", "std::list", "std::map", "std::forward_list"],
      correctIndex: 0,
      correctAnswer: "std::vector",
      explanation: "std::vector stores elements in contiguous memory, granting O(1) constant-time index access.",
      hint: "The go-to contiguous dynamic array container in the STL."
    },
    {
      id: "cpp_m3",
      type: "mcq",
      difficulty: "moderate",
      question: "What is the only fundamental difference between a struct and a class in C++?",
      options: ["Members are public by default in struct; private by default in class", "Structs cannot have member methods or constructors", "Classes are allocated on heap; structs are on stack", "Structs do not support inheritance"],
      correctIndex: 0,
      correctAnswer: "Members are public by default in struct; private by default in class",
      explanation: "In C++, structs and classes are identical except structs default to public access and inheritance, while classes default to private.",
      hint: "Default member and inheritance access specifier."
    },
    {
      id: "cpp_m4",
      type: "mcq",
      difficulty: "moderate",
      question: "What does the core C++ idiom RAII stand for?",
      options: ["Resource Acquisition Is Initialization", "Runtime Application Interface Initialization", "Rapid Allocation of Internal Identifiers", "Recursive Algorithm Iterative Inheritance"],
      correctIndex: 0,
      correctAnswer: "Resource Acquisition Is Initialization",
      explanation: "RAII ties resource ownership (memory, files, sockets, locks) to object lifetime: acquire in constructor, release in destructor.",
      hint: "Binds resource cleanup directly to object lifespan."
    },
    {
      id: "cpp_m5",
      type: "mcq",
      difficulty: "moderate",
      question: "What is an lvalue reference in C++?",
      options: ["An alias to an existing object with an identifiable memory address", "A pointer that can be reassigned to null", "A dynamic array wrapper", "A thread-safe atomic pointer"],
      correctIndex: 0,
      correctAnswer: "An alias to an existing object with an identifiable memory address",
      explanation: "An lvalue reference (T&) is an alias for an existing object; it cannot be null and cannot be rebound after binding.",
      hint: "Created using &; acts as an alias to another variable."
    },
    {
      id: "cpp_m6",
      type: "mcq",
      difficulty: "moderate",
      question: "What does std::move() do in modern C++?",
      options: ["Casts an expression to an rvalue reference (enabling move semantics)", "Physically copies memory in background threads", "Deletes the source object immediately", "Transfers heap pointers across processes"],
      correctIndex: 0,
      correctAnswer: "Casts an expression to an rvalue reference (enabling move semantics)",
      explanation: "std::move does not move data at runtime; it performs an unconditional static_cast to an rvalue reference (T&&) so move constructors can steal resources.",
      hint: "An unconditional static_cast to an rvalue reference."
    },

    // --- HARD ---
    {
      id: "cpp_h1",
      type: "mcq",
      difficulty: "hard",
      question: "What does the `virtual` keyword enable on a C++ class member function?",
      options: ["Faster execution", "Dynamic dispatch for runtime polymorphism", "Static compilation", "Memory pooling"],
      correctIndex: 1,
      correctAnswer: "Dynamic dispatch for runtime polymorphism",
      explanation: "The virtual keyword instructs the compiler to generate a vtable, enabling runtime dynamic dispatch for polymorphic method calls.",
      hint: "Enables vtable-based runtime polymorphism."
    },
    {
      id: "cpp_h2",
      type: "mcq",
      difficulty: "hard",
      question: "Why should a polymorphic base class in C++ declare a virtual destructor?",
      options: ["To prevent undefined behavior when deleting a derived object via a base pointer", "To allow multiple constructors in derived classes", "To force heap allocation of the base class", "To make the destructor private"],
      correctIndex: 0,
      correctAnswer: "To prevent undefined behavior when deleting a derived object via a base pointer",
      explanation: "Without a virtual destructor, deleting through a Base* only runs Base::~Base(), leading to resource leaks or undefined behavior.",
      hint: "Ensures derived object destructors are invoked during polymorphic deletion."
    },
    {
      id: "cpp_h3",
      type: "mcq",
      difficulty: "hard",
      question: "How does std::unique_ptr guarantee unique ownership of a resource?",
      options: ["Its copy constructor and copy assignment operators are deleted (= delete)", "It counts references in an atomic control block", "It converts raw pointers into shared memory", "It throws a runtime exception on copy"],
      correctIndex: 0,
      correctAnswer: "Its copy constructor and copy assignment operators are deleted (= delete)",
      explanation: "std::unique_ptr prevents copying by deleting copy constructor and copy assignment operators, permitting move semantics only.",
      hint: "Copy operations are explicitly deleted, permitting only move operations."
    },
    {
      id: "cpp_h4",
      type: "mcq",
      difficulty: "hard",
      question: "What is the Rule of Five in modern C++?",
      options: ["If you define destructor, copy ctor, copy assign, move ctor, or move assign, you should define all 5", "Programs should never exceed 5 levels of inheritance", "Every class must have at least 5 unit tests", "Functions can take at most 5 template parameters"],
      correctIndex: 0,
      correctAnswer: "If you define destructor, copy ctor, copy assign, move ctor, or move assign, you should define all 5",
      explanation: "Custom resource management requires explicit declaration of: Destructor, Copy Constructor, Copy Assignment, Move Constructor, and Move Assignment.",
      hint: "Addresses custom resource lifecycle across copy and move semantics."
    },
    {
      id: "cpp_h5",
      type: "mcq",
      difficulty: "hard",
      question: "What does the 'constexpr' specifier indicate in C++?",
      options: ["The function or variable can be evaluated at compile-time if arguments are constant", "It forces the compiler to inline assembly code", "It restricts execution to a single core", "It makes variables thread-safe across CPU sockets"],
      correctIndex: 0,
      correctAnswer: "The function or variable can be evaluated at compile-time if arguments are constant",
      explanation: "constexpr expresses that an entity can be calculated at compile time, enabling zero-runtime-cost computations.",
      hint: "Evaluated during compilation."
    },
    {
      id: "cpp_h6",
      type: "mcq",
      difficulty: "hard",
      question: "What is a dangling pointer in C++?",
      options: ["A pointer referencing memory that has already been freed or gone out of scope", "A pointer initialized to nullptr", "A pointer pointing to another pointer", "A void pointer with no type cast"],
      correctIndex: 0,
      correctAnswer: "A pointer referencing memory that has already been freed or gone out of scope",
      explanation: "Dangling pointers occur when an object is destroyed or deallocated while a pointer still retains its obsolete memory address.",
      hint: "References memory that was deallocated or popped from the stack."
    }
  ],

  c: [
    // --- EASY ---
    {
      id: "c_e1",
      type: "mcq",
      difficulty: "easy",
      question: "Which header file is required for printf() and scanf() in C?",
      options: ["<stdio.h>", "<stdlib.h>", "<math.h>", "<string.h>"],
      correctIndex: 0,
      correctAnswer: "<stdio.h>",
      explanation: "<stdio.h> provides Standard Input and Output functions like printf, scanf, and fopen in C.",
      hint: "Standard Input Output header."
    },
    {
      id: "c_e2",
      type: "mcq",
      difficulty: "easy",
      question: "What is the standard return type of the main() function in standard C?",
      options: ["void", "int", "float", "char"],
      correctIndex: 1,
      correctAnswer: "int",
      explanation: "The ISO C standard mandates that main() returns an int representing the process exit status.",
      hint: "An integer return code signaling success or error."
    },
    {
      id: "c_e3",
      type: "mcq",
      difficulty: "easy",
      question: "Which format specifier is used to print a decimal integer in printf()?",
      options: ["%f", "%s", "%d", "%c"],
      correctIndex: 2,
      correctAnswer: "%d",
      explanation: "%d (or %i) format specifier formats signed decimal integers in printf/scanf.",
      hint: "Letter 'd' stands for decimal integer."
    },
    {
      id: "c_e4",
      type: "mcq",
      difficulty: "easy",
      question: "Which operator is used to obtain the memory address of a variable in C?",
      options: ["*", "&", "->", "%"],
      correctIndex: 1,
      correctAnswer: "&",
      explanation: "The unary address-of operator (&) evaluates to the memory address of its operand.",
      hint: "The ampersand symbol."
    },
    {
      id: "c_e5",
      type: "mcq",
      difficulty: "easy",
      question: "How do you declare a pointer to an integer variable in C?",
      options: ["int &p;", "int *p;", "pointer int p;", "int p*;"],
      correctIndex: 1,
      correctAnswer: "int *p;",
      explanation: "Prefixing the variable identifier with an asterisk (*) declares it as a pointer: int *p;",
      hint: "Asterisk precedes the variable identifier."
    },
    {
      id: "c_e6",
      type: "mcq",
      difficulty: "easy",
      question: "Which header file contains prototypes for malloc() and free()?",
      options: ["<stdlib.h>", "<stdio.h>", "<string.h>", "<memory.h>"],
      correctIndex: 0,
      correctAnswer: "<stdlib.h>",
      explanation: "<stdlib.h> provides general utility functions including dynamic memory allocation and conversion routines.",
      hint: "Standard Library header."
    },
    {
      id: "c_e7",
      type: "mcq",
      difficulty: "easy",
      question: "What character marks the end of a string in C?",
      options: ["'\\0'", "'\\n'", "';'", "'.'"],
      correctIndex: 0,
      correctAnswer: "'\\0'",
      explanation: "Strings in C are null-terminated character arrays ending with the null byte '\\0' (ASCII 0).",
      hint: "Null byte terminator."
    },
    {
      id: "c_e8",
      type: "mcq",
      difficulty: "easy",
      question: "Which operator accesses structure members directly on a struct instance?",
      options: [".", "->", "*", "::"],
      correctIndex: 0,
      correctAnswer: ".",
      explanation: "The dot operator (.) accesses fields on a structure variable, while arrow (->) is used through pointers.",
      hint: "A period / dot."
    },

    // --- MODERATE ---
    {
      id: "c_m1",
      type: "mcq",
      difficulty: "moderate",
      question: "Which function allocates uninitialized dynamic memory from the heap in C?",
      options: ["malloc()", "new()", "alloc()", "create()"],
      correctIndex: 0,
      correctAnswer: "malloc()",
      explanation: "malloc(size_t bytes) allocates heap memory and returns a void pointer to the uninitialized block.",
      hint: "Short for memory allocation."
    },
    {
      id: "c_m2",
      type: "mcq",
      difficulty: "moderate",
      question: "Which operator is used to access structure members via a pointer?",
      options: [".", "->", "*", "&"],
      correctIndex: 1,
      correctAnswer: "->",
      explanation: "The arrow operator (ptr->member) dereferences the pointer and accesses the member, equivalent to (*ptr).member.",
      hint: "Composed of a dash and a greater-than sign."
    },
    {
      id: "c_m3",
      type: "mcq",
      difficulty: "moderate",
      question: "What does the 'sizeof' operator in C return?",
      options: ["The size in bytes of a data type or object as a size_t", "The number of elements in any pointer", "The memory address of the object", "The bit depth of the CPU architecture"],
      correctIndex: 0,
      correctAnswer: "The size in bytes of a data type or object as a size_t",
      explanation: "sizeof is a compile-time operator returning the memory footprint in bytes required for its operand.",
      hint: "Returns memory consumption in bytes."
    },
    {
      id: "c_m4",
      type: "mcq",
      difficulty: "moderate",
      question: "What happens if dynamic memory allocated with malloc() is never passed to free()?",
      options: ["A memory leak occurs during execution until the OS reclaims process memory", "The compiler emits an error at build time", "The system crashes immediately", "The memory is converted to static memory"],
      correctIndex: 0,
      correctAnswer: "A memory leak occurs during execution until the OS reclaims process memory",
      explanation: "Failing to free heap memory causes memory leaks, increasing resource consumption until process exit.",
      hint: "Leaked heap memory that was never released."
    },
    {
      id: "c_m5",
      type: "mcq",
      difficulty: "moderate",
      question: "How does calloc() differ from malloc() in C?",
      options: ["calloc zeroes out allocated memory; malloc leaves memory uninitialized", "malloc zeroes out memory; calloc does not", "calloc allocates on the stack; malloc allocates on the heap", "malloc can only allocate integers"],
      correctIndex: 0,
      correctAnswer: "calloc zeroes out allocated memory; malloc leaves memory uninitialized",
      explanation: "calloc(n, size) initializes all allocated bytes to zero; malloc(bytes) leaves contents indeterminate.",
      hint: "calloc clears memory to zero bytes."
    },
    {
      id: "c_m6",
      type: "mcq",
      difficulty: "moderate",
      question: "What is a function pointer in C?",
      options: ["A pointer that stores the address of executable code in memory", "A pointer that can only be passed into library functions", "A built-in macro for function recursion", "A hardware interrupt vector"],
      correctIndex: 0,
      correctAnswer: "A pointer that stores the address of executable code in memory",
      explanation: "A function pointer stores the entry point address of a function, enabling callbacks and function dispatch tables.",
      hint: "Holds the memory address of an executable function."
    },

    // --- HARD ---
    {
      id: "c_h1",
      type: "mcq",
      difficulty: "hard",
      question: "What is a dangling pointer in C?",
      options: ["A pointer referencing memory that has been deallocated", "A pointer set to NULL", "A pointer to a function", "An uninitialized local pointer"],
      correctIndex: 0,
      correctAnswer: "A pointer referencing memory that has been deallocated",
      explanation: "A dangling pointer holds the address of memory that has been released back to the heap or stack frame.",
      hint: "Points to memory that has already been deallocated."
    },
    {
      id: "c_h2",
      type: "mcq",
      difficulty: "hard",
      question: "What does the ISO C standard mean by 'Undefined Behavior' (UB)?",
      options: ["Behavior for which the standard imposes no requirements on implementation", "A fatal compiler syntax error", "An unhandled POSIX signal", "A guaranteed segmentation fault"],
      correctIndex: 0,
      correctAnswer: "Behavior for which the standard imposes no requirements on implementation",
      explanation: "Undefined behavior means the standard does not constrain the compiler: anything can happen, from silent corruption to crashes.",
      hint: "The language specification imposes no requirements on what may happen."
    },
    {
      id: "c_h3",
      type: "mcq",
      difficulty: "hard",
      question: "What does the 'volatile' type qualifier tell the C compiler?",
      options: ["The variable can be changed by hardware or another thread; do not optimize away reads/writes", "The variable should be stored in CPU registers permanently", "The variable is constant and cannot be altered", "The variable should be encrypted in memory"],
      correctIndex: 0,
      correctAnswer: "The variable can be changed by hardware or another thread; do not optimize away reads/writes",
      explanation: "volatile tells the optimizer that the variable value can change externally, forcing memory loads and stores on every access.",
      hint: "Prevents the compiler from optimizing out repeated memory reads."
    },
    {
      id: "c_h4",
      type: "mcq",
      difficulty: "hard",
      question: "Why do C compilers insert padding bytes between struct members (structure alignment)?",
      options: ["To align fields to CPU bus word boundaries for efficient hardware access", "To encrypt structure contents against buffer overflows", "To make all structures identical in byte size", "To force structures onto the heap"],
      correctIndex: 0,
      correctAnswer: "To align fields to CPU bus word boundaries for efficient hardware access",
      explanation: "CPUs access memory faster and without alignment faults when data types reside at addresses divisible by their size.",
      hint: "Alignment to word boundaries optimizes CPU memory bus transfers."
    },
    {
      id: "c_h5",
      type: "mcq",
      difficulty: "hard",
      question: "What is the difference between a shallow copy and a deep copy of a struct containing pointers in C?",
      options: ["Shallow copy duplicates pointer addresses; deep copy duplicates the pointed-to memory", "Shallow copy duplicates the pointed-to memory; deep copy duplicates pointer addresses", "There is no difference in C", "Deep copy requires compiler flags"],
      correctIndex: 0,
      correctAnswer: "Shallow copy duplicates pointer addresses; deep copy duplicates the pointed-to memory",
      explanation: "A shallow copy duplicates the struct's pointer fields so both point to the same memory; a deep copy clones the underlying buffer.",
      hint: "Copying pointer values vs cloning the referenced data."
    },
    {
      id: "c_h6",
      type: "mcq",
      difficulty: "hard",
      question: "What promise does the 'restrict' keyword (C99) give to the compiler about pointer aliasing?",
      options: ["The pointer is the only reference to the accessed object, allowing aggressive optimizations", "The variable cannot be accessed outside the current thread", "The pointer cannot be cast to another type", "The variable is restricted to read-only access"],
      correctIndex: 0,
      correctAnswer: "The pointer is the only reference to the accessed object, allowing aggressive optimizations",
      explanation: "The restrict keyword asserts that during pointer lifetime, no other pointer will alias the same memory block, unlocking SIMD vectorization.",
      hint: "Guarantees no pointer aliasing for that memory region."
    }
  ]
};

// ---------------- CODE-TYPING QUESTIONS (write real code, auto-graded) ----------------
export const codeQuestions = {
  c: [
    {
      id: "c_c1",
      type: "code",
      difficulty: "easy",
      title: "Hello World in C",
      statement: "Write a C main function that prints 'Hello World' using printf.",
      starter: "#include <stdio.h>\nint main() {\n  /* Write code here */\n  return 0;\n}\n",
      keywords: ["printf", "Hello World"],
      explanation: "Use printf(\"Hello World\"); inside main to output text to standard console.",
      hint: "Remember to use printf with double quotes and include <stdio.h>."
    },
    {
      id: "c_c2",
      type: "code",
      difficulty: "easy",
      title: "Sum Function",
      statement: "Write a C function int add(int a, int b) that returns the sum of a and b.",
      starter: "int add(int a, int b) {\n  /* Write code here */\n}\n",
      keywords: ["return", "a + b"],
      explanation: "Return the result of adding operands a and b using the + arithmetic operator.",
      hint: "Use the return keyword with the sum of parameters a and b."
    }
  ],
  html: [
    {
      id: "html_c1",
      type: "code",
      difficulty: "easy",
      title: "Basic Link",
      statement: "Write an HTML anchor tag that links to 'https://example.com' with the visible text 'Visit Site'.",
      starter: "<!-- Write your code here -->\n",
      keywords: ["<a", "href=", "example.com", "</a>"],
      explanation: "Use <a href=\"https://example.com\">Visit Site</a> to create a hyperlink.",
      hint: "Use an anchor <a> tag with href pointing to the target URL."
    },
    {
      id: "html_c2",
      type: "code",
      difficulty: "easy",
      title: "Heading Tag",
      statement: "Write a primary <h1> heading containing the text 'Welcome to Battle Arena'.",
      starter: "<!-- Write your code here -->\n",
      keywords: ["<h1>", "Welcome to Battle Arena", "</h1>"],
      explanation: "Wrap the text inside <h1> and </h1> tags.",
      hint: "Enclose the greeting in top-level <h1> heading tags."
    }
  ],
  css: [
    {
      id: "css_c1",
      type: "code",
      difficulty: "easy",
      title: "Text Color & Size",
      statement: "Write CSS for selector '.title' setting color to '#38BDF8' and font-size to 24px.",
      starter: ".title {\n  /* Write your code here */\n}\n",
      keywords: [".title", "color", "#38BDF8", "font-size", "24px"],
      explanation: "Define color: #38BDF8; and font-size: 24px; inside the .title rule block.",
      hint: "Set both color and font-size properties inside the curly braces."
    },
    {
      id: "css_c2",
      type: "code",
      difficulty: "easy",
      title: "Margin & Padding",
      statement: "Write CSS for selector '.container' setting margin to 0 auto and padding to 16px.",
      starter: ".container {\n  /* Write your code here */\n}\n",
      keywords: [".container", "margin", "0", "auto", "padding", "16px"],
      explanation: "Use margin: 0 auto; to center the container and padding: 16px; for inner spacing.",
      hint: "Apply margin: 0 auto; and padding: 16px; on the class."
    }
  ],
  javascript: [
    {
      id: "js_c1",
      type: "code",
      difficulty: "easy",
      title: "Sum Function",
      statement: "Write a JavaScript function sum(a, b) that returns the sum of a and b.",
      starter: "function sum(a, b) {\n  // Write your code here\n}\n",
      keywords: ["function sum", "return", "a", "+", "b"],
      explanation: "Return a + b from the function body.",
      hint: "Return the addition of arguments a and b."
    },
    {
      id: "js_c2",
      type: "code",
      difficulty: "easy",
      title: "Is Even",
      statement: "Write a function isEven(n) returning true if n is even and false otherwise.",
      starter: "function isEven(n) {\n  // Write your code here\n}\n",
      keywords: ["function isEven", "%", "2", "return"],
      explanation: "Use modulo operator n % 2 === 0 to determine evenness.",
      hint: "Check if the number modulo 2 equals zero."
    }
  ],
  python: [
    {
      id: "py_c1",
      type: "code",
      difficulty: "easy",
      title: "Sum Function",
      statement: "Write a Python function sum_two(a, b) that returns the sum of a and b.",
      starter: "def sum_two(a, b):\n    # Write your code here\n    pass\n",
      keywords: ["def sum_two", "return", "a", "+", "b"],
      explanation: "Use return a + b inside the defined function.",
      hint: "Return the sum of a and b using the + operator."
    },
    {
      id: "py_c2",
      type: "code",
      difficulty: "easy",
      title: "Is Even",
      statement: "Write a function is_even(n) that returns True if n is even, else False.",
      starter: "def is_even(n):\n    # Write your code here\n    pass\n",
      keywords: ["def is_even", "%", "2", "return"],
      explanation: "Return n % 2 == 0 to evaluate evenness.",
      hint: "Test if the remainder of dividing n by 2 is 0."
    }
  ],
  java: [
    {
      id: "java_c1",
      type: "code",
      difficulty: "easy",
      title: "Sum Method",
      statement: "Write a Java method 'public static int sum(int a, int b)' that returns the sum of a and b.",
      starter: "public static int sum(int a, int b) {\n    // Write your code here\n    return 0;\n}\n",
      keywords: ["public static int sum", "return", "a", "+", "b"],
      explanation: "Return a + b from the static method.",
      hint: "Return a + b inside the method."
    },
    {
      id: "java_c2",
      type: "code",
      difficulty: "easy",
      title: "Is Even",
      statement: "Write a method 'public static boolean isEven(int n)' that returns true if n is even.",
      starter: "public static boolean isEven(int n) {\n    // Write your code here\n    return false;\n}\n",
      keywords: ["public static boolean isEven", "%", "2", "return"],
      explanation: "Return n % 2 == 0 to return true for even numbers.",
      hint: "Check whether n % 2 == 0."
    }
  ],
  cpp: [
    {
      id: "cpp_c1",
      type: "code",
      difficulty: "easy",
      title: "Sum Function",
      statement: "Write a C++ function 'int sum(int a, int b)' that returns the sum of a and b.",
      starter: "int sum(int a, int b) {\n    // Write your code here\n    return 0;\n}\n",
      keywords: ["int sum", "return", "a", "+", "b"],
      explanation: "Return a + b from the function.",
      hint: "Return the sum of a and b."
    },
    {
      id: "cpp_c2",
      type: "code",
      difficulty: "easy",
      title: "Is Even",
      statement: "Write a function 'bool isEven(int n)' that returns true if n is even.",
      starter: "bool isEven(int n) {\n    // Write your code here\n    return false;\n}\n",
      keywords: ["bool isEven", "%", "2", "return"],
      explanation: "Return n % 2 == 0.",
      hint: "Use the modulo operator with 2."
    }
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
  const mcqPool = (mcqQuestions[lang] || mcqQuestions.javascript).filter((q) => validateMcq(q, lang));
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
      // In single player / campaign / AI practice mode, preserve all properties for immediate client grading and explanation
      return { ...question };
    }
    // In multiplayer duel, keep options, question text, id, difficulty, hint, but strip correctIndex and correctAnswer before submission
    const { correctIndex, correctAnswer, ...rest } = question;
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
      "Review the core syntax and fundamental rules of " + String(language).toUpperCase() + "."
    ];
  }

  // If question already has a hand-crafted hint, use it
  if (question.hint && typeof question.hint === "string" && question.hint.trim().length > 0) {
    return [question.hint.trim()];
  }

  if (Array.isArray(question.hints) && question.hints.length > 0) {
    return question.hints;
  }

  const lang = String(language || "javascript").toUpperCase();

  if (question.type === "code") {
    const title = question.title || "Coding Challenge";
    return [
      `Break down "${title}" into logical steps: initialize inputs, apply transformations in ${lang}, and return the result.`
    ];
  }

  const text = (question.question || "").toLowerCase();
  if (text.includes("keyword")) {
    return [`Focus on standard ${lang} reserved keywords used specifically for this declaration or control structure.`];
  }
  if (text.includes("tag") || text.includes("element")) {
    return [`Consider the standard semantic markup element defined in the official specification.`];
  }
  if (text.includes("property")) {
    return [`Think about the specific styling property responsible for controlling this visual aspect.`];
  }
  if (text.includes("method") || text.includes("function")) {
    return [`Recall the standard built-in library method signature in ${lang}.`];
  }

  return [
    `Recall the fundamental definitions and syntax specifications of ${lang}. Eliminate options that violate language rules.`
  ];
}

export function validateHint(hintText) {
  if (!hintText || typeof hintText !== "string" || hintText.trim().length < 8) return false;
  const cleanHint = hintText.toLowerCase().trim();
  if (cleanHint.includes("failed") || cleanHint.includes("error") || cleanHint.includes("undefined")) return false;
  return true;
}
