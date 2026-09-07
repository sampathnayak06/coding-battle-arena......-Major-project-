// Question Bank — per-language pools with levels (Easy, Moderate, Hard).
// Each match: pick ONE language, level/difficulty, 10 MCQ questions + up to 5 code-typing questions (12-15 total).

export const LANGUAGES = ["html", "css", "javascript", "python", "java", "cpp"];

// Fisher-Yates (Knuth) Shuffle Algorithm for true uniform randomness
function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ---------------- MCQ QUESTIONS (Categorized by difficulty levels for all languages) ----------------
export const mcqQuestions = {
  html: [
    // --- EASY LEVEL ---
    { id: "html_e1", type: "mcq", difficulty: "easy", question: "Which HTML tag is used to create a hyperlink?", options: ["<a>", "<link>", "<href>", "<nav>"], correctIndex: 0 },
    { id: "html_e2", type: "mcq", difficulty: "easy", question: "Which tag is used for the largest heading in HTML?", options: ["<h6>", "<heading>", "<h1>", "<head>"], correctIndex: 2 },
    { id: "html_e3", type: "mcq", difficulty: "easy", question: "Which tag defines an unordered (bulleted) list?", options: ["<ol>", "<ul>", "<list>", "<li>"], correctIndex: 1 },
    { id: "html_e4", type: "mcq", difficulty: "easy", question: "Which attribute specifies alternate text for an image?", options: ["title", "src", "desc", "alt"], correctIndex: 3 },
    { id: "html_e5", type: "mcq", difficulty: "easy", question: "Which HTML element is used to insert a line break?", options: ["<lb>", "<break>", "<br>", "<newline>"], correctIndex: 2 },
    { id: "html_e6", type: "mcq", difficulty: "easy", question: "Which HTML tag is used to define an internal style sheet?", options: ["<css>", "<style>", "<script>", "<stylesheet>"], correctIndex: 1 },

    // --- MODERATE LEVEL ---
    { id: "html_m1", type: "mcq", difficulty: "moderate", question: "Which HTML5 tag is used to play video content natively?", options: ["<media>", "<movie>", "<stream>", "<video>"], correctIndex: 3 },
    { id: "html_m2", type: "mcq", difficulty: "moderate", question: "Which attribute makes a form input field mandatory before form submission?", options: ["mandatory", "required", "validate", "needed"], correctIndex: 1 },
    { id: "html_m3", type: "mcq", difficulty: "moderate", question: "Which tag is used to embed JavaScript code inside HTML?", options: ["<script>", "<js>", "<javascript>", "<code>"], correctIndex: 0 },
    { id: "html_m4", type: "mcq", difficulty: "moderate", question: "Which semantic element represents self-contained content like a blog post?", options: ["<section>", "<div>", "<article>", "<aside>"], correctIndex: 2 },
    { id: "html_m5", type: "mcq", difficulty: "moderate", question: "What is the correct HTML element for playing audio files?", options: ["<sound>", "<audio>", "<music>", "<voice>"], correctIndex: 1 },
    { id: "html_m6", type: "mcq", difficulty: "moderate", question: "Which attribute opens a linked document in a new browser tab or window?", options: ["target='_new'", "target='_tab'", "target='_blank'", "open='new'"], correctIndex: 2 },

    // --- HARD LEVEL ---
    { id: "html_h1", type: "mcq", difficulty: "hard", question: "What does the 'defer' attribute on a <script> tag do?", options: ["Executes script after document is parsed", "Executes script immediately and blocks HTML parsing", "Prevents script execution until user clicks", "Loads script synchronously"], correctIndex: 0 },
    { id: "html_h2", type: "mcq", difficulty: "hard", question: "Which HTML5 API allows storing data locally in the browser without expiration?", options: ["sessionStorage", "localStorage", "Cookies", "WebSQL"], correctIndex: 1 },
    { id: "html_h3", type: "mcq", difficulty: "hard", question: "Which attribute on an <iframe> restricts actions like script execution for security?", options: ["protect", "isolate", "sandbox", "secure"], correctIndex: 2 },
    { id: "html_h4", type: "mcq", difficulty: "hard", question: "What is the primary purpose of the <picture> element in HTML5?", options: ["To render vector SVG graphics", "To display image carousels", "To apply CSS filters to images", "To offer multiple image sources for responsive design"], correctIndex: 3 },
    { id: "html_h5", type: "mcq", difficulty: "hard", question: "Which HTML tag is used to specify metadata such as character set or page description?", options: ["<meta>", "<head>", "<info>", "<data>"], correctIndex: 0 }
  ],

  css: [
    // --- EASY LEVEL ---
    { id: "css_e1", type: "mcq", difficulty: "easy", question: "Which CSS property changes the text color of an element?", options: ["color", "font-color", "text-color", "background-color"], correctIndex: 0 },
    { id: "css_e2", type: "mcq", difficulty: "easy", question: "Which CSS property controls the outer spacing around an element?", options: ["padding", "margin", "spacing", "border"], correctIndex: 1 },
    { id: "css_e3", type: "mcq", difficulty: "easy", question: "How do you select an element with id 'header' in CSS?", options: [".header", "*header", "#header", "header{}"], correctIndex: 2 },
    { id: "css_e4", type: "mcq", difficulty: "easy", question: "Which property sets the size of text in CSS?", options: ["text-style", "text-size", "font-style", "font-size"], correctIndex: 3 },
    { id: "css_e5", type: "mcq", difficulty: "easy", question: "What is the default value of the 'position' property in CSS?", options: ["relative", "static", "absolute", "fixed"], correctIndex: 1 },
    { id: "css_e6", type: "mcq", difficulty: "easy", question: "Which unit is relative to the viewport height?", options: ["vh", "em", "rem", "px"], correctIndex: 0 },

    // --- MODERATE LEVEL ---
    { id: "css_m1", type: "mcq", difficulty: "moderate", question: "Which CSS layout model arranges items flexibly in a row or column?", options: ["Grid", "Flexbox", "Float", "Table"], correctIndex: 1 },
    { id: "css_m2", type: "mcq", difficulty: "moderate", question: "Which property sets the gap between flex or grid items?", options: ["gap", "item-spacing", "flex-gap", "grid-space"], correctIndex: 0 },
    { id: "css_m3", type: "mcq", difficulty: "moderate", question: "What is 'position: absolute' element positioned relative to?", options: ["The viewport always", "The nearest positioned ancestor", "The document body", "Its sibling element"], correctIndex: 1 },
    { id: "css_m4", type: "mcq", difficulty: "moderate", question: "Which pseudo-class targets an element when hovered over by mouse cursor?", options: [":focus", ":active", ":hover", ":visited"], correctIndex: 2 },
    { id: "css_m5", type: "mcq", difficulty: "moderate", question: "Which box-sizing value includes padding and border in the element's specified width?", options: ["content-box", "border-box", "padding-box", "full-box"], correctIndex: 1 },
    { id: "css_m6", type: "mcq", difficulty: "moderate", question: "Which property hides an element while preserving its space in the layout?", options: ["display: none", "opacity: 0", "visibility: hidden", "filter: blur()"], correctIndex: 2 },

    // --- HARD LEVEL ---
    { id: "css_h1", type: "mcq", difficulty: "hard", question: "In CSS specificity, which selector combination has the highest precedence?", options: ["Element selector (div)", "Class selector (.card)", "ID selector (#hero)", "Universal selector (*)"], correctIndex: 2 },
    { id: "css_h2", type: "mcq", difficulty: "hard", question: "Which CSS unit is relative to the root element's (<html>) font size?", options: ["em", "rem", "vh", "%"], correctIndex: 1 },
    { id: "css_h3", type: "mcq", difficulty: "hard", question: "What does the 'z-index' property control?", options: ["Horizontal positioning", "Vertical positioning", "Stacking order along the z-axis", "Element scale"], correctIndex: 2 },
    { id: "css_h4", type: "mcq", difficulty: "hard", question: "Which property specifies how content should be handled when it exceeds container bounds?", options: ["clip", "overflow", "contain", "bounds"], correctIndex: 1 },
    { id: "css_h5", type: "mcq", difficulty: "hard", question: "What does the CSS property 'contain: layout paint;' achieve?", options: ["Clips text overflow", "Isolates element subtree for browser rendering performance", "Centers element inside viewport", "Applies hardware GPU acceleration"], correctIndex: 1 }
  ],

  javascript: [
    // --- EASY LEVEL ---
    { id: "js_e1", type: "mcq", difficulty: "easy", question: "Which keyword declares a block-scoped variable in JavaScript?", options: ["var", "let", "static", "def"], correctIndex: 1 },
    { id: "js_e2", type: "mcq", difficulty: "easy", question: "What does the '===' operator check in JavaScript?", options: ["Value only", "Type only", "Value and type", "Memory address"], correctIndex: 2 },
    { id: "js_e3", type: "mcq", difficulty: "easy", question: "Which array method appends an element to the end of an array?", options: ["push()", "pop()", "shift()", "unshift()"], correctIndex: 0 },
    { id: "js_e4", type: "mcq", difficulty: "easy", question: "How do you write a single-line comment in JavaScript?", options: ["# comment", "// comment", "<!-- comment -->", "/* comment */"], correctIndex: 1 },
    { id: "js_e5", type: "mcq", difficulty: "easy", question: "Which keyword declares a constant variable that cannot be reassigned?", options: ["const", "final", "static", "val"], correctIndex: 0 },
    { id: "js_e6", type: "mcq", difficulty: "easy", question: "Which function parses a string and returns an integer?", options: ["parseInt()", "Math.floor()", "Number.parse()", "toInteger()"], correctIndex: 0 },

    // --- MODERATE LEVEL ---
    { id: "js_m1", type: "mcq", difficulty: "moderate", question: "What does Array.prototype.reduce() do?", options: ["Filters array elements", "Reduces array to a single accumulated value", "Sorts array in place", "Transforms each element into a new array"], correctIndex: 1 },
    { id: "js_m2", type: "mcq", difficulty: "moderate", question: "What is a JavaScript closure?", options: ["A function that executes immediately", "A function bundled with references to its surrounding lexical environment", "A method to close browser tabs", "A block statement wrapped in curly braces"], correctIndex: 1 },
    { id: "js_m3", type: "mcq", difficulty: "moderate", question: "What is the output of typeof [] in JavaScript?", options: ["'array'", "'object'", "'list'", "'undefined'"], correctIndex: 1 },
    { id: "js_m4", type: "mcq", difficulty: "moderate", question: "Which method converts a JavaScript object into a JSON string?", options: ["JSON.parse()", "JSON.stringify()", "Object.toJSON()", "JSON.encode()"], correctIndex: 1 },
    { id: "js_m5", type: "mcq", difficulty: "moderate", question: "Which promise method resolves when ALL input promises have resolved?", options: ["Promise.any()", "Promise.race()", "Promise.all()", "Promise.resolve()"], correctIndex: 2 },
    { id: "js_m6", type: "mcq", difficulty: "moderate", question: "What is the primary benefit of async/await in JavaScript?", options: ["Enables true multi-threading", "Allows working with Promises in a clean, synchronous-looking style", "Speeds up CPU execution", "Prevents memory leaks"], correctIndex: 1 },

    // --- HARD LEVEL ---
    { id: "js_h1", type: "mcq", difficulty: "hard", question: "What is the output of typeof NaN in JavaScript?", options: ["'NaN'", "'undefined'", "'number'", "'object'"], correctIndex: 2 },
    { id: "js_h2", type: "mcq", difficulty: "hard", question: "In the Event Loop, which queue takes priority right after call stack empties?", options: ["Macrotask queue (setTimeout)", "Microtask queue (Promise callbacks / process.nextTick)", "RequestAnimationFrame queue", "I/O polling queue"], correctIndex: 1 },
    { id: "js_h3", type: "mcq", difficulty: "hard", question: "What does 'this' refer to inside a standard arrow function?", options: ["The global window object always", "Its own dynamic binding", "The lexical 'this' of the enclosing scope", "undefined"], correctIndex: 2 },
    { id: "js_h4", type: "mcq", difficulty: "hard", question: "What does Object.freeze() do to an object?", options: ["Makes properties read-only and prevents adding or deleting properties", "Prevents adding new properties only", "Converts object to string", "Deletes all properties"], correctIndex: 0 },
    { id: "js_h5", type: "mcq", difficulty: "hard", question: "What will `console.log(0.1 + 0.2 === 0.3)` output in JS?", options: ["true", "false", "TypeError", "NaN"], correctIndex: 1 }
  ],

  python: [
    // --- EASY LEVEL ---
    { id: "py_e1", type: "mcq", difficulty: "easy", question: "What is the standard file extension for Python scripts?", options: [".py", ".pt", ".pyt", ".python"], correctIndex: 0 },
    { id: "py_e2", type: "mcq", difficulty: "easy", question: "How do you write a single-line comment in Python?", options: ["// comment", "# comment", "<!-- comment -->", "/* comment */"], correctIndex: 1 },
    { id: "py_e3", type: "mcq", difficulty: "easy", question: "Which built-in function returns the total number of items in a list?", options: ["size()", "count()", "len()", "length()"], correctIndex: 2 },
    { id: "py_e4", type: "mcq", difficulty: "easy", question: "Which keyword is used to define a function in Python?", options: ["func", "def", "function", "lambda"], correctIndex: 1 },
    { id: "py_e5", type: "mcq", difficulty: "easy", question: "Which data type in Python represents an ordered, immutable sequence?", options: ["list", "dict", "tuple", "set"], correctIndex: 2 },
    { id: "py_e6", type: "mcq", difficulty: "easy", question: "How do you print output to the console in Python?", options: ["print()", "console.log()", "System.out.println()", "echo"], correctIndex: 0 },

    // --- MODERATE LEVEL ---
    { id: "py_m1", type: "mcq", difficulty: "moderate", question: "What is the result of list comprehension `[x * 2 for x in range(3)]`?", options: ["[0, 2, 4]", "[1, 2, 3]", "[0, 1, 2]", "[2, 4, 6]"], correctIndex: 0 },
    { id: "py_m2", type: "mcq", difficulty: "moderate", question: "What does the 'yield' keyword do inside a Python function?", options: ["Returns a final value and terminates function", "Turns function into a generator producing values lazily", "Raises a runtime exception", "Pauses execution without returning values"], correctIndex: 1 },
    { id: "py_m3", type: "mcq", difficulty: "moderate", question: "Which built-in module is used for regular expressions in Python?", options: ["regex", "re", "string", "pyregex"], correctIndex: 1 },
    { id: "py_m4", type: "mcq", difficulty: "moderate", question: "What does 'self' represent inside a Python class method?", options: ["The class definition", "The current instance of the class", "A global static reference", "The parent base class"], correctIndex: 1 },
    { id: "py_m5", type: "mcq", difficulty: "moderate", question: "What is the difference between `==` and `is` in Python?", options: ["== checks identity, is checks value", "== checks value equality, is checks object memory identity", "They are completely identical", "is is only for booleans"], correctIndex: 1 },
    { id: "py_m6", type: "mcq", difficulty: "moderate", question: "Which dict method retrieves a key without raising a KeyError if missing?", options: ["dict.fetch()", "dict.get()", "dict.find()", "dict.select()"], correctIndex: 1 },

    // --- HARD LEVEL ---
    { id: "py_h1", type: "mcq", difficulty: "hard", question: "What is the average time complexity of key lookup in a Python dict?", options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], correctIndex: 2 },
    { id: "py_h2", type: "mcq", difficulty: "hard", question: "What is Python's Global Interpreter Lock (GIL)?", options: ["A security sandbox preventing file access", "A mutex that prevents multiple native threads from executing Python bytecode simultaneously in CPython", "A garbage collection lock", "A compiler optimization lock"], correctIndex: 1 },
    { id: "py_h3", type: "mcq", difficulty: "hard", question: "What do `*args` and `**kwargs` allow in Python function parameters?", options: ["Keyword arguments only", "Positional default parameters", "Variable number of positional (*args) and keyword (**kwargs) arguments", "Type annotations"], correctIndex: 2 },
    { id: "py_h4", type: "mcq", difficulty: "hard", question: "What does a `@classmethod` decorator receive as its implicit first argument?", options: ["The instance (self)", "The class (cls)", "The module", "None"], correctIndex: 1 },
    { id: "py_h5", type: "mcq", difficulty: "hard", question: "Which dunder method is called when an object enters a `with` statement block?", options: ["__init__", "__enter__", "__start__", "__open__"], correctIndex: 1 }
  ],

  java: [
    // --- EASY LEVEL ---
    { id: "java_e1", type: "mcq", difficulty: "easy", question: "Which method serves as the entry point for a standalone Java application?", options: ["public static void main(String[] args)", "public void start()", "public static void run()", "public void init()"], correctIndex: 0 },
    { id: "java_e2", type: "mcq", difficulty: "easy", question: "Which keyword is used to declare a class in Java?", options: ["struct", "class", "object", "define"], correctIndex: 1 },
    { id: "java_e3", type: "mcq", difficulty: "easy", question: "Which keyword is used for class inheritance in Java?", options: ["implements", "extends", "inherits", "super"], correctIndex: 1 },
    { id: "java_e4", type: "mcq", difficulty: "easy", question: "What is the default initial value of an uninitialized primitive boolean in Java?", options: ["true", "false", "0", "null"], correctIndex: 1 },
    { id: "java_e5", type: "mcq", difficulty: "easy", question: "Which primitive type store double-precision floating-point numbers in Java?", options: ["float", "int", "double", "decimal"], correctIndex: 2 },
    { id: "java_e6", type: "mcq", difficulty: "easy", question: "How do you instantiate a new object in Java?", options: ["alloc", "new", "create", "instantiate"], correctIndex: 1 },

    // --- MODERATE LEVEL ---
    { id: "java_m1", type: "mcq", difficulty: "moderate", question: "What is the time complexity of retrieving an element by index in an ArrayList?", options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], correctIndex: 2 },
    { id: "java_m2", type: "mcq", difficulty: "moderate", question: "Which keyword prevents a class from being subclassed or a method from being overridden?", options: ["static", "private", "final", "sealed"], correctIndex: 2 },
    { id: "java_m3", type: "mcq", difficulty: "moderate", question: "What does the 'static' keyword mean for a method or field?", options: ["It is bound to class instances", "It belongs to the class itself, shared across all instances", "It cannot be accessed outside package", "It is thread-local"], correctIndex: 1 },
    { id: "java_m4", type: "mcq", difficulty: "moderate", question: "Which collection interface in Java does NOT allow duplicate elements?", options: ["List", "Set", "Map", "Queue"], correctIndex: 1 },
    { id: "java_m5", type: "mcq", difficulty: "moderate", question: "What is the difference between String, StringBuilder, and StringBuffer in Java?", options: ["String is mutable", "String is immutable; StringBuilder is mutable and non-thread-safe; StringBuffer is thread-safe", "They are identical in performance", "StringBuffer cannot handle UTF-8"], correctIndex: 1 },
    { id: "java_m6", type: "mcq", difficulty: "moderate", question: "Which exception type must be caught or declared in method signature (checked exception)?", options: ["NullPointerException", "IllegalArgumentException", "IOException", "ArrayIndexOutOfBoundsException"], correctIndex: 2 },

    // --- HARD LEVEL ---
    { id: "java_h1", type: "mcq", difficulty: "hard", question: "What memory visibility guarantee does the 'volatile' keyword provide in Java?", options: ["Atomic execution of compound statements", "Immediate visibility of variable writes across thread CPU caches", "Prevents deadlocks", "Locks the object monitor"], correctIndex: 1 },
    { id: "java_h2", type: "mcq", difficulty: "hard", question: "What interface must a custom class implement to be used in a for-each loop?", options: ["Comparable", "Iterable", "Serializable", "Cloneable"], correctIndex: 1 },
    { id: "java_h3", type: "mcq", difficulty: "hard", question: "In JVM memory layout, where are objects created with `new` allocated?", options: ["Stack memory", "Heap memory", "Metaspace", "Program Counter register"], correctIndex: 1 },
    { id: "java_h4", type: "mcq", difficulty: "hard", question: "What is the difference between `Comparable` and `Comparator` in Java?", options: ["Comparable defines natural ordering inside class via compareTo(); Comparator defines custom external ordering via compare()", "Comparable is for numbers only", "Comparator is deprecated", "No difference"], correctIndex: 0 },
    { id: "java_h5", type: "mcq", difficulty: "hard", question: "Which garbage collector in modern Java focuses on ultra-low latency concurrent pauses?", options: ["Serial GC", "Parallel GC", "ZGC / G1", "Epsilon GC"], correctIndex: 2 }
  ],

  cpp: [
    // --- EASY LEVEL ---
    { id: "cpp_e1", type: "mcq", difficulty: "easy", question: "Which standard header file is required for console I/O (std::cout) in C++?", options: ["<stdio.h>", "<iostream>", "<io.h>", "<stream>"], correctIndex: 1 },
    { id: "cpp_e2", type: "mcq", difficulty: "easy", question: "Which keyword declares a constant variable in C++?", options: ["final", "const", "static", "readonly"], correctIndex: 1 },
    { id: "cpp_e3", type: "mcq", difficulty: "easy", question: "Which symbol is used for pointer variable declaration in C++?", options: ["&", "*", "#", "@"], correctIndex: 1 },
    { id: "cpp_e4", type: "mcq", difficulty: "easy", question: "Which operator allocates dynamic memory on heap in C++?", options: ["malloc", "new", "alloc", "create"], correctIndex: 1 },
    { id: "cpp_e5", type: "mcq", difficulty: "easy", question: "What is the standard source file extension for C++?", options: [".cpp", ".c", ".cp", ".cxx"], correctIndex: 0 },
    { id: "cpp_e6", type: "mcq", difficulty: "easy", question: "Which namespace contains standard components like cout, vector, and string?", options: ["std", "system", "core", "cpp"], correctIndex: 0 },

    // --- MODERATE LEVEL ---
    { id: "cpp_m1", type: "mcq", difficulty: "moderate", question: "What does passing a parameter as `const std::string&` achieve in C++?", options: ["Passes by value and permits modification", "Passes by reference without copying and prevents modification", "Converts string to C-style char*", "Allocates heap space"], correctIndex: 1 },
    { id: "cpp_m2", type: "mcq", difficulty: "moderate", question: "Which STL container stores unique elements in sorted order?", options: ["std::vector", "std::set", "std::list", "std::deque"], correctIndex: 1 },
    { id: "cpp_m3", type: "mcq", difficulty: "moderate", question: "What is the purpose of the scope resolution operator `::` in C++?", options: ["Pointer dereferencing", "Accessing members of a namespace, class, or enum scope", "Bitwise shift", "Ternary expression"], correctIndex: 1 },
    { id: "cpp_m4", type: "mcq", difficulty: "moderate", question: "Which C++ keyword specifies that a function can be evaluated at compile time?", options: ["inline", "constexpr", "static", "virtual"], correctIndex: 1 },
    { id: "cpp_m5", type: "mcq", difficulty: "moderate", question: "What does RAII (Resource Acquisition Is Initialization) mean in C++?", options: ["Allocating memory at app launch", "Binding resource lifecycle to object construction and destructor cleanup", "Using raw pointers", "Zero-initializing variables"], correctIndex: 1 },
    { id: "cpp_m6", type: "mcq", difficulty: "moderate", question: "Which STL container provides dynamic contiguous array storage with O(1) random access?", options: ["std::vector", "std::list", "std::map", "std::forward_list"], correctIndex: 0 },

    // --- HARD LEVEL ---
    { id: "cpp_h1", type: "mcq", difficulty: "hard", question: "What is a key difference between `std::unique_ptr` and `std::shared_ptr` in C++11?", options: ["unique_ptr has single exclusive ownership; shared_ptr uses reference counting for shared ownership", "unique_ptr is thread-safe; shared_ptr is not", "shared_ptr cannot be moved", "They are identical"], correctIndex: 0 },
    { id: "cpp_h2", type: "mcq", difficulty: "hard", question: "What does the `virtual` keyword enable on a C++ class member function?", options: ["Faster execution", "Dynamic dispatch for runtime polymorphism", "Static compilation", "Memory pooling"], correctIndex: 1 },
    { id: "cpp_h3", type: "mcq", difficulty: "hard", question: "What happens if a destructor throws an unhandled exception during stack unwinding?", options: ["Exception is ignored", "Program immediately invokes std::terminate()", "Memory leak occurs", "Destructor restarts"], correctIndex: 1 },
    { id: "cpp_h4", type: "mcq", difficulty: "hard", question: "What is the effect of using `std::move()` on an object in C++?", options: ["Physically copies memory", "Casts object to an rvalue reference enabling move semantics", "Deletes object", "Allocates heap space"], correctIndex: 1 },
    { id: "cpp_h5", type: "mcq", difficulty: "hard", question: "What is the vtable (virtual table) in C++?", options: ["A standard array of integers", "A compiler-generated lookup table used to resolve virtual function calls dynamically", "A template library for tables", "A memory heap pool"], correctIndex: 1 }
  ]
};

// ---------------- CODE-TYPING QUESTIONS (write real code, auto-graded) ----------------
export const codeQuestions = {
  html: [
    { id: "html_c1", type: "code", difficulty: "easy", title: "Basic Link", statement: "Write an HTML anchor tag that links to 'https://example.com' with the visible text 'Visit Site'.", starter: "<!-- Write your code here -->\n", keywords: ["<a", "href=", "example.com", "</a>"] },
    { id: "html_c2", type: "code", difficulty: "easy", title: "Heading Tag", statement: "Write a primary <h1> heading containing the text 'Welcome to Battle Arena'.", starter: "<!-- Write your code here -->\n", keywords: ["<h1>", "Welcome to Battle Arena", "</h1>"] },
    { id: "html_c3", type: "code", difficulty: "moderate", title: "Ordered List", statement: "Write an HTML ordered list (<ol>) with 3 <li> items: Apple, Banana, Cherry.", starter: "<!-- Write your code here -->\n", keywords: ["<ol", "<li>Apple", "<li>Banana", "<li>Cherry", "</ol>"] },
    { id: "html_c4", type: "code", difficulty: "moderate", title: "Image with Alt Text", statement: "Write an <img> tag with src='logo.png' and appropriate alt text 'Logo'.", starter: "<!-- Write your code here -->\n", keywords: ["<img", "src=", "logo.png", "alt="] },
    { id: "html_c5", type: "code", difficulty: "hard", title: "Simple Form", statement: "Write an HTML form with a text input named 'username' and a submit button.", starter: "<!-- Write your code here -->\n", keywords: ["<form", "<input", "name=\"username\"", "type=\"submit\""] },
    { id: "html_c6", type: "code", difficulty: "hard", title: "Table Structure", statement: "Write a basic HTML table with one row containing two <td> cells: 'Name' and 'Score'.", starter: "<!-- Write your code here -->\n", keywords: ["<table", "<tr>", "<td>Name", "<td>Score", "</table>"] }
  ],
  css: [
    { id: "css_c1", type: "code", difficulty: "easy", title: "Text Color & Size", statement: "Write CSS for selector '.title' setting color to '#38BDF8' and font-size to 24px.", starter: ".title {\n  /* Write your code here */\n}\n", keywords: [".title", "color", "#38BDF8", "font-size", "24px"] },
    { id: "css_c2", type: "code", difficulty: "easy", title: "Margin & Padding", statement: "Write CSS for selector '.container' setting margin to 0 auto and padding to 16px.", starter: ".container {\n  /* Write your code here */\n}\n", keywords: [".container", "margin", "0", "auto", "padding", "16px"] },
    { id: "css_c3", type: "code", difficulty: "moderate", title: "Center a Div", statement: "Write a CSS rule for class '.box' that uses flexbox to center its content both horizontally and vertically.", starter: ".box {\n  /* Write your code here */\n}\n", keywords: ["display", "flex", "justify-content", "center", "align-items"] },
    { id: "css_c4", type: "code", difficulty: "moderate", title: "Button Hover Style", statement: "Write CSS for a '.btn:hover' selector that changes background-color to '#22C55E'.", starter: "/* Write your code here */\n", keywords: [".btn:hover", "background-color", "#22C55E"] },
    { id: "css_c5", type: "code", difficulty: "hard", title: "Responsive Grid", statement: "Write a CSS rule for '.grid' using display:grid with 3 equal columns via grid-template-columns.", starter: ".grid {\n  /* Write your code here */\n}\n", keywords: ["display", "grid", "grid-template-columns", "1fr"] },
    { id: "css_c6", type: "code", difficulty: "hard", title: "Rounded Card Shadow", statement: "Write CSS for '.card' with border-radius 12px and box-sizing border-box.", starter: ".card {\n  /* Write your code here */\n}\n", keywords: ["border-radius", "12px", "box-sizing", "border-box"] }
  ],
  javascript: [
    { id: "js_c1", type: "code", difficulty: "easy", title: "Sum Function", statement: "Write a JavaScript function sum(a, b) that returns the sum of a and b.", starter: "function sum(a, b) {\n  // Write your code here\n}\n", keywords: ["function sum", "return", "a", "+", "b"] },
    { id: "js_c2", type: "code", difficulty: "easy", title: "Is Even", statement: "Write a function isEven(n) returning true if n is even and false otherwise.", starter: "function isEven(n) {\n  // Write your code here\n}\n", keywords: ["function isEven", "%", "2", "return"] },
    { id: "js_c3", type: "code", difficulty: "moderate", title: "Array Filter", statement: "Write a function evens(arr) that returns only even numbers from arr using filter().", starter: "function evens(arr) {\n  // Write your code here\n}\n", keywords: ["function evens", "filter", "%", "2", "return"] },
    { id: "js_c4", type: "code", difficulty: "moderate", title: "Reverse String", statement: "Write a function reverseStr(s) that returns the string s reversed.", starter: "function reverseStr(s) {\n  // Write your code here\n}\n", keywords: ["function reverseStr", "split", "reverse", "join", "return"] },
    { id: "js_c5", type: "code", difficulty: "hard", title: "Find Max", statement: "Write a function findMax(arr) that returns the largest number in arr.", starter: "function findMax(arr) {\n  // Write your code here\n}\n", keywords: ["function findMax", "return"] },
    { id: "js_c6", type: "code", difficulty: "hard", title: "FizzBuzz", statement: "Write a function fizzBuzz(n) that returns 'Fizz' if n is divisible by 3, 'Buzz' if by 5, 'FizzBuzz' if both, else n as a string.", starter: "function fizzBuzz(n) {\n  // Write your code here\n}\n", keywords: ["function fizzBuzz", "%", "3", "5", "Fizz", "Buzz"] }
  ],
  python: [
    { id: "py_c1", type: "code", difficulty: "easy", title: "Sum Function", statement: "Write a Python function sum_two(a, b) that returns the sum of a and b.", starter: "def sum_two(a, b):\n    # Write your code here\n    pass\n", keywords: ["def sum_two", "return", "a", "+", "b"] },
    { id: "py_c2", type: "code", difficulty: "easy", title: "Is Even", statement: "Write a function is_even(n) that returns True if n is even, else False.", starter: "def is_even(n):\n    # Write your code here\n    pass\n", keywords: ["def is_even", "%", "2", "return"] },
    { id: "py_c3", type: "code", difficulty: "moderate", title: "Even Numbers", statement: "Write a function evens(nums) that returns a list of only even numbers from nums.", starter: "def evens(nums):\n    # Write your code here\n    pass\n", keywords: ["def evens", "%", "2", "return"] },
    { id: "py_c4", type: "code", difficulty: "moderate", title: "Reverse String", statement: "Write a function reverse_str(s) that returns the string s reversed.", starter: "def reverse_str(s):\n    # Write your code here\n    pass\n", keywords: ["def reverse_str", "[::-1]", "return"] },
    { id: "py_c5", type: "code", difficulty: "hard", title: "Find Max", statement: "Write a function find_max(nums) that returns the largest number in nums.", starter: "def find_max(nums):\n    # Write your code here\n    pass\n", keywords: ["def find_max", "return"] },
    { id: "py_c6", type: "code", difficulty: "hard", title: "FizzBuzz", statement: "Write a function fizzbuzz(n) that returns 'Fizz' if divisible by 3, 'Buzz' if by 5, 'FizzBuzz' if both, else str(n).", starter: "def fizzbuzz(n):\n    # Write your code here\n    pass\n", keywords: ["def fizzbuzz", "%", "3", "5", "Fizz", "Buzz"] }
  ],
  java: [
    { id: "java_c1", type: "code", difficulty: "easy", title: "Sum Method", statement: "Write a Java method 'public static int sum(int a, int b)' that returns the sum of a and b.", starter: "public static int sum(int a, int b) {\n    // Write your code here\n    return 0;\n}\n", keywords: ["public static int sum", "return", "a", "+", "b"] },
    { id: "java_c2", type: "code", difficulty: "easy", title: "Is Even", statement: "Write a method 'public static boolean isEven(int n)' that returns true if n is even.", starter: "public static boolean isEven(int n) {\n    // Write your code here\n    return false;\n}\n", keywords: ["public static boolean isEven", "%", "2", "return"] },
    { id: "java_c3", type: "code", difficulty: "moderate", title: "Reverse String", statement: "Write a method 'public static String reverse(String s)' that returns s reversed.", starter: "public static String reverse(String s) {\n    // Write your code here\n    return \"\";\n}\n", keywords: ["public static String reverse", "StringBuilder", "reverse", "return"] },
    { id: "java_c4", type: "code", difficulty: "moderate", title: "Find Max", statement: "Write a method 'public static int findMax(int[] nums)' that returns the largest number in array.", starter: "public static int findMax(int[] nums) {\n    // Write your code here\n    return 0;\n}\n", keywords: ["public static int findMax", "for", "return"] },
    { id: "java_c5", type: "code", difficulty: "hard", title: "FizzBuzz", statement: "Write a method 'public static String fizzBuzz(int n)' following standard FizzBuzz rules.", starter: "public static String fizzBuzz(int n) {\n    // Write your code here\n    return \"\";\n}\n", keywords: ["public static String fizzBuzz", "%", "3", "5", "Fizz", "Buzz"] }
  ],
  cpp: [
    { id: "cpp_c1", type: "code", difficulty: "easy", title: "Sum Function", statement: "Write a C++ function 'int sum(int a, int b)' that returns the sum of a and b.", starter: "int sum(int a, int b) {\n    // Write your code here\n    return 0;\n}\n", keywords: ["int sum", "return", "a", "+", "b"] },
    { id: "cpp_c2", type: "code", difficulty: "easy", title: "Is Even", statement: "Write a function 'bool isEven(int n)' that returns true if n is even.", starter: "bool isEven(int n) {\n    // Write your code here\n    return false;\n}\n", keywords: ["bool isEven", "%", "2", "return"] },
    { id: "cpp_c3", type: "code", difficulty: "moderate", title: "Reverse String", statement: "Write a function 'string reverseStr(string s)' that returns s reversed.", starter: "string reverseStr(string s) {\n    // Write your code here\n    return \"\";\n}\n", keywords: ["string reverseStr", "reverse", "return"] },
    { id: "cpp_c4", type: "code", difficulty: "moderate", title: "Find Max", statement: "Write a function 'int findMax(vector<int>& nums)' that returns the largest number in vector.", starter: "int findMax(vector<int>& nums) {\n    // Write your code here\n    return 0;\n}\n", keywords: ["int findMax", "for", "return"] },
    { id: "cpp_c5", type: "code", difficulty: "hard", title: "FizzBuzz", statement: "Write a function 'string fizzBuzz(int n)' following standard FizzBuzz rules.", starter: "string fizzBuzz(int n) {\n    // Write your code here\n    return \"\";\n}\n", keywords: ["string fizzBuzz", "%", "3", "5", "Fizz", "Buzz"] }
  ]
};

// Shuffles MCQ options dynamically for every match so correct option is randomly placed at A, B, C, or D
function normalizeMcqOptions(question) {
  if (question.type !== "mcq") return question;
  const originalOptions = Array.isArray(question.options) ? [...question.options] : [];
  const correctAnswer = originalOptions[question.correctIndex] ?? originalOptions[0];
  const shuffledOptions = shuffle(originalOptions);
  let newCorrectIndex = shuffledOptions.findIndex((opt) => opt === correctAnswer);
  if (newCorrectIndex === -1) {
    shuffledOptions[0] = correctAnswer;
    newCorrectIndex = 0;
  }
  return { ...question, options: shuffledOptions, correctIndex: newCorrectIndex };
}

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

// Helper to parse difficulty / level argument
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
  return LEVEL_PRESETS[5]; // Default to Level 5 (Intermediate)
}

// Builds a match series for ONE chosen language and level (1-10 or difficulty name):
// 10 MCQ questions selected by level distribution + 2-5 code questions.
export function buildLanguageSeries(language, difficultyLevel = 1, codeCount = 4, excludeList = []) {
  const lang = LANGUAGES.includes(language) ? language : "javascript";
  const mcqPool = mcqQuestions[lang] || mcqQuestions.javascript;
  const codePool = codeQuestions[lang] || codeQuestions.javascript;
  const excludeSet = new Set(excludeList);

  const levelConfig = parseLevel(difficultyLevel);
  const mcqDistribution = levelConfig.mcq;

  const mcqPicked = pickByDifficulty(mcqPool, mcqDistribution, excludeSet);

  // Filter code questions by difficulty based on level and excludes
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

export function stripAnswer(question) {
  if (question.type === "mcq") {
    const { correctIndex, ...rest } = question;
    return rest;
  }
  const { keywords, ...rest } = question;
  return rest;
}

// Lightweight code grader: checks presence of expected keywords/snippets (case-insensitive).
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

  // If question has custom stored hints, use them
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

  // MCQ Hints
  const text = question.question || "";
  const opts = Array.isArray(question.options) ? question.options : [];
  const correct = Number.isInteger(question.correctIndex) ? question.correctIndex : 0;
  
  // Level 1: Subtle
  let level1 = `Recall the fundamental definitions and syntax rules of ${lang}.`;
  if (text.includes("keyword")) level1 = `Focus on language keywords in ${lang} used for this specific control structure or declaration.`;
  else if (text.includes("tag") || text.includes("element")) level1 = `Think about standard HTML/markup tags used to define this specific structure.`;
  else if (text.includes("property")) level1 = `Consider the CSS property responsible for controlling visual appearance or layout.`;
  else if (text.includes("method") || text.includes("function")) level1 = `Recall the built-in function or method signature in ${lang}.`;
  else if (text.includes("output") || text.includes("return")) level1 = `Trace the step-by-step execution of the expression in ${lang}.`;

  // Level 2: Guided (Eliminate an incorrect option)
  let level2 = `Consider eliminating options that are invalid syntax or from a different programming language.`;
  if (opts.length >= 4) {
    const wrongIdx = opts.findIndex((o, idx) => idx !== correct);
    if (wrongIdx >= 0) {
      level2 = `You can eliminate "${opts[wrongIdx]}" — it is either invalid syntax or serves a different purpose.`;
    }
  }

  // Level 3: Strong
  let level3 = `Look closely at the remaining choices: focus on the exact naming convention and expected behavior in ${lang}.`;
  if (opts[correct]) {
    const answerOpt = String(opts[correct]).replace(/<[^>]+>/g, "").trim();
    if (answerOpt.length > 0 && answerOpt.length < 20) {
      level3 = `The target answer relates directly to concepts matching: "${answerOpt.slice(0, Math.ceil(answerOpt.length / 2))}..."`;
    }
  }

  return [level1, level2, level3];
}

export function validateHint(hintText, question) {
  if (!hintText || typeof hintText !== "string" || hintText.trim().length < 8) return false;
  const cleanHint = hintText.toLowerCase().trim();
  if (cleanHint.includes("failed") || cleanHint.includes("error") || cleanHint.includes("undefined")) return false;
  return true;
}

