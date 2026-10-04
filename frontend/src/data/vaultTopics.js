export const VAULT_CATEGORIES = [
  { key: "all", label: "All Topics" },
  { key: "c", label: "C" },
  { key: "cpp", label: "C++" },
  { key: "java", label: "Java" },
  { key: "python", label: "Python" },
  { key: "javascript", label: "JavaScript" },
  { key: "web", label: "Web Dev" },
  { key: "db", label: "Database" },
  { key: "cs", label: "Computer Science" },
  { key: "advanced", label: "Advanced" }
];

export const STUDY_TOPICS = [
  // ================= C PROGRAMMING =================
  {
    key: "c_basics",
    category: "c",
    title: "C Basics",
    accent: "#38BDF8",
    summary: "Introduction to C programming, structure of a C program, and compilation.",
    explanation: "C is a procedural programming language created by Dennis Ritchie in 1972 at Bell Labs. It serves as the foundation for modern operating systems like Linux and Windows.",
    example: `#include <stdio.h>\n\nint main() {\n    printf("Hello, Coding Arena!\\n");\n    return 0;\n}`,
    keyPoints: [
      "#include <stdio.h> includes the Standard Input Output library.",
      "main() is the mandatory execution entry point of every C program.",
      "return 0 indicates successful execution to the operating system."
    ]
  },
  {
    key: "c_variables",
    category: "c",
    title: "Variables & Data Types in C",
    accent: "#38BDF8",
    summary: "Understanding int, float, double, char, and variable declaration in C.",
    explanation: "Variables are named locations in computer memory used to hold data during execution. In C, variables must be explicitly typed before use.",
    example: `int age = 21;\nfloat gpa = 3.85;\nchar grade = 'A';\ndouble pi = 3.14159265;`,
    keyPoints: [
      "int stores integers (typically 4 bytes).",
      "float stores single-precision decimal numbers (4 bytes).",
      "char stores a single ASCII character (1 byte) enclosed in single quotes."
    ]
  },
  {
    key: "c_operators",
    category: "c",
    title: "Operators in C",
    accent: "#38BDF8",
    summary: "Arithmetic, relational, logical, and assignment operators in C.",
    explanation: "Operators perform mathematical or logical operations on operands. Arithmetic (+, -, *, /, %), Relational (==, !=, >, <), and Logical (&&, ||, !).",
    example: `int a = 10, b = 3;\nint remainder = a % b; // remainder = 1\nint isValid = (a > 5) && (b < 10); // 1 (true)`,
    keyPoints: [
      "% (modulus) operator returns the remainder of integer division.",
      "&& (logical AND) requires both conditions to be non-zero (true).",
      "In C, 0 represents false and any non-zero value represents true."
    ]
  },
  {
    key: "c_conditions",
    category: "c",
    title: "Conditions in C",
    accent: "#38BDF8",
    summary: "Decision making using if, else if, else, and switch statements.",
    explanation: "Conditional statements control program flow based on boolean expressions.",
    example: `int score = 85;\nif (score >= 90) {\n    printf("Grade A\\n");\n} else if (score >= 80) {\n    printf("Grade B\\n");\n} else {\n    printf("Grade C\\n");\n}`,
    keyPoints: [
      "Use if for primary condition tests.",
      "switch statements evaluate an integer or char against case constants.",
      "Always include break in switch cases to prevent fall-through execution."
    ]
  },
  {
    key: "c_loops",
    category: "c",
    title: "Loops in C",
    accent: "#38BDF8",
    summary: "Repeating code using for, while, and do-while loops.",
    explanation: "Loops execute a block of statements repeatedly as long as a specified condition evaluates to true.",
    example: `// For Loop\nfor (int i = 1; i <= 5; i++) {\n    printf("Iteration %d\\n", i);\n}\n\n// While Loop\nint count = 0;\nwhile (count < 3) {\n    count++;\n}`,
    keyPoints: [
      "for loop is ideal when the number of iterations is known in advance.",
      "while loop tests the condition before executing the loop body.",
      "do-while loop executes the loop body at least once before checking the condition."
    ]
  },
  {
    key: "c_functions",
    category: "c",
    title: "Functions in C",
    accent: "#38BDF8",
    summary: "Creating reusable modular code with function prototypes, parameters, and return values.",
    explanation: "Functions divide a large program into smaller, reusable modular tasks.",
    example: `// Prototype\nint multiply(int x, int y);\n\nint main() {\n    int result = multiply(4, 5); // result = 20\n    return 0;\n}\n\nint multiply(int x, int y) {\n    return x * y;\n}`,
    keyPoints: [
      "Prototypes notify the compiler of a function's name, return type, and parameters.",
      "Parameters are passed by value by default in C.",
      "Use void return type if the function does not return a value."
    ]
  },
  {
    key: "c_arrays",
    category: "c",
    title: "Arrays in C",
    accent: "#38BDF8",
    summary: "Storing fixed-size sequential elements of the same data type.",
    explanation: "An array is a contiguous memory collection of elements of the same data type, accessed via zero-based indexing.",
    example: `int numbers[5] = {10, 20, 30, 40, 50};\nint firstNumber = numbers[0]; // 10\nnumbers[2] = 99; // updates 30 to 99`,
    keyPoints: [
      "Array indices start at 0 and end at size - 1.",
      "Accessing out-of-bounds array indices leads to undefined behavior.",
      "Array names act as constant pointers to the first element in memory."
    ]
  },
  {
    key: "c_strings",
    category: "c",
    title: "Strings in C",
    accent: "#38BDF8",
    summary: "Character arrays terminated by null character ('\\0').",
    explanation: "In C, strings are not a primitive data type, but rather 1D character arrays terminated by a null byte ('\\0').",
    example: `#include <string.h>\n\nchar name[] = "Arena";\nint len = strlen(name); // 5\nchar dest[20];\nstrcpy(dest, name); // copies "Arena" into dest`,
    keyPoints: [
      "Always allocate space for the null terminator (e.g. char str[6] for 'Hello').",
      "Use string.h library functions like strlen(), strcpy(), strcat(), and strcmp().",
      "strcmp(s1, s2) returns 0 if both strings match exactly."
    ]
  },
  {
    key: "c_pointers",
    category: "c",
    title: "Pointers in C",
    accent: "#38BDF8",
    summary: "Memory address manipulation using * and & operators.",
    explanation: "A pointer is a variable that stores the memory address of another variable.",
    example: `int val = 42;\nint *ptr = &val; // ptr holds memory address of val\nprintf("Value: %d\\n", *ptr); // dereferences ptr -> prints 42`,
    keyPoints: [
      "& (address-of) operator retrieves the memory address of a variable.",
      "* (dereference) operator retrieves the value stored at the address pointed to.",
      "NULL pointers point to memory address 0 and indicate unassigned pointer state."
    ]
  },
  {
    key: "c_structures",
    category: "c",
    title: "Structures in C",
    accent: "#38BDF8",
    summary: "Grouping variables of different data types into a user-defined type.",
    explanation: "Structures (struct) allow you to package related data items of different types together.",
    example: `struct Player {\n    char name[30];\n    int elo;\n    float winRate;\n};\n\nstruct Player p1 = {"ShadowByte", 1250, 75.5};`,
    keyPoints: [
      "Use struct keyword to define custom composite types.",
      "Access structure members using the dot (.) operator.",
      "Use arrow operator (->) when accessing members via a pointer to a struct."
    ]
  },
  {
    key: "c_file_handling",
    category: "c",
    title: "File Handling in C",
    accent: "#38BDF8",
    summary: "Reading from and writing to files using FILE pointers.",
    explanation: "C provides file management operations through the stdio.h library using FILE pointers.",
    example: `FILE *fp = fopen("scores.txt", "w");\nif (fp != NULL) {\n    fprintf(fp, "Player1 1500\\n");\n    fclose(fp);\n}`,
    keyPoints: [
      "fopen() modes: 'r' (read), 'w' (write), 'a' (append).",
      "Always check if the returned FILE pointer is NULL before performing operations.",
      "Always close files with fclose() to prevent memory/descriptor leaks."
    ]
  },

  // ================= C++ PROGRAMMING =================
  {
    key: "cpp_basics",
    category: "cpp",
    title: "C++ Basics",
    accent: "#9D4EDD",
    summary: "Object-oriented extension of C with std::cout, std::cin, and namespaces.",
    explanation: "C++ extends C with Object-Oriented Programming (OOP) features, exception handling, namespaces, and template meta-programming.",
    example: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Welcome to C++ Battle Arena!" << endl;\n    return 0;\n}`,
    keyPoints: [
      "<iostream> replaces <stdio.h> for stream-based I/O.",
      "cout << outputs data; cin >> inputs data.",
      "std namespace contains standard library types and functions."
    ]
  },
  {
    key: "cpp_oop",
    category: "cpp",
    title: "OOP Concepts in C++",
    accent: "#9D4EDD",
    summary: "Encapsulation, Abstraction, Inheritance, and Polymorphism.",
    explanation: "Object-Oriented Programming models real-world software components as objects with state (attributes) and behavior (methods).",
    example: `// Core 4 Pillars:\n// 1. Encapsulation: Grouping data & methods in classes\n// 2. Abstraction: Hiding internal implementation\n// 3. Inheritance: Extending base classes\n// 4. Polymorphism: Overriding behaviors at runtime`,
    keyPoints: [
      "Encapsulation hides data using private access modifiers.",
      "Polymorphism enables calling derived class functions through base class pointers.",
      "OOP improves code reusability, maintainability, and scalability."
    ]
  },
  {
    key: "cpp_classes",
    category: "cpp",
    title: "Classes & Objects in C++",
    accent: "#9D4EDD",
    summary: "Defining class blueprints, member variables, and member functions.",
    explanation: "A class is a user-defined blueprint from which objects are instantiated.",
    example: `class Hero {\nprivate:\n    string name;\n    int hp;\npublic:\n    Hero(string n, int h) : name(n), hp(h) {}\n    void attack() {\n        cout << name << " attacks!" << endl;\n    }\n};`,
    keyPoints: [
      "Members default to private access in C++ classes.",
      "Public members are accessible outside the class.",
      "Objects are instantiated instances of a class."
    ]
  },
  {
    key: "cpp_constructors",
    category: "cpp",
    title: "Constructors & Destructors",
    accent: "#9D4EDD",
    summary: "Object initialization and automatic resource cleanup.",
    explanation: "Constructors execute automatically when an object is created; destructors (~ClassName) execute when an object goes out of scope.",
    example: `class Buffer {\npublic:\n    Buffer() { cout << "Resource Allocated" << endl; }\n    ~Buffer() { cout << "Resource Cleaned Up" << endl; }\n};`,
    keyPoints: [
      "Constructors share the exact name of the class and have no return type.",
      "Destructors are prefixed with a tilde (~) and take no parameters.",
      "RAII (Resource Acquisition Is Initialization) uses destructors for automatic cleanup."
    ]
  },
  {
    key: "cpp_inheritance",
    category: "cpp",
    title: "Inheritance in C++",
    accent: "#9D4EDD",
    summary: "Deriving new classes from existing base classes.",
    explanation: "Inheritance allows a child (derived) class to acquire properties and methods of a parent (base) class.",
    example: `class Character {\npublic:\n    int health = 100;\n};\n\nclass Mage : public Character {\npublic:\n    int mana = 50;\n};`,
    keyPoints: [
      "Syntax: class Derived : public Base.",
      "public inheritance keeps public base members public in derived class.",
      "C++ supports single, multiple, hierarchical, and multilevel inheritance."
    ]
  },
  {
    key: "cpp_polymorphism",
    category: "cpp",
    title: "Polymorphism & Virtual Functions",
    accent: "#9D4EDD",
    summary: "Method overriding using virtual keyword and runtime dynamic dispatch.",
    explanation: "Polymorphism allows derived class methods to be invoked dynamically via base class pointers or references.",
    example: `class Animal {\npublic:\n    virtual void speak() { cout << "Animal sound" << endl; }\n};\nclass Dog : public Animal {\npublic:\n    void speak() override { cout << "Woof!" << endl; }\n};`,
    keyPoints: [
      "Mark base class methods with 'virtual' to enable dynamic dispatch.",
      "Use 'override' keyword in derived class for safety.",
      "Virtual functions use a vtable (virtual table) lookup mechanism at runtime."
    ]
  },
  {
    key: "cpp_stl",
    category: "cpp",
    title: "C++ Standard Template Library (STL)",
    accent: "#9D4EDD",
    summary: "Containers, iterators, and generic algorithms.",
    explanation: "The STL provides a rich set of generic data structures (vector, map, set) and algorithms (sort, find).",
    example: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> nums = {5, 2, 8, 1};\nsort(nums.begin(), nums.end()); // [1, 2, 5, 8]`,
    keyPoints: [
      "Containers store data objects (vector, list, map, set).",
      "Iterators navigate through container elements.",
      "Algorithms (std::sort, std::find) operate seamlessly on container ranges."
    ]
  },
  {
    key: "cpp_vectors",
    category: "cpp",
    title: "Vectors in C++",
    accent: "#9D4EDD",
    summary: "Dynamic contiguous arrays with automatic resizing.",
    explanation: "std::vector is a dynamic array container that automatically expands as elements are added.",
    example: `#include <vector>\nvector<string> heroes;\nheroes.push_back("Naruto");\nheroes.push_back("Gojo");\ncout << heroes[0]; // "Naruto"\ncout << heroes.size(); // 2`,
    keyPoints: [
      "push_back() appends an element to the vector end.",
      "size() returns current element count.",
      "Provides O(1) random access via operator[]."
    ]
  },
  {
    key: "cpp_maps",
    category: "cpp",
    title: "Maps & Hash Tables in C++",
    accent: "#9D4EDD",
    summary: "Key-value associative containers (std::map and std::unordered_map).",
    explanation: "std::map stores key-value pairs sorted by key (Red-Black tree O(log N)), while std::unordered_map uses hash tables (O(1) average).",
    example: `#include <map>\nmap<string, int> elo;\nelo["ShadowByte"] = 1500;\nelo["RecursionQueen"] = 1420;\ncout << elo["ShadowByte"]; // 1500`,
    keyPoints: [
      "std::map keys are ordered and unique.",
      "std::unordered_map offers faster average O(1) lookups.",
      "Use find() or count() to test key existence."
    ]
  },

  // ================= JAVA PROGRAMMING =================
  {
    key: "java_basics",
    category: "java",
    title: "Java Basics",
    accent: "#EF4444",
    summary: "Platform-independent, strongly typed, object-oriented language running on the JVM.",
    explanation: "Java compiles source code (.java) into bytecode (.class), which executes on the Java Virtual Machine (JVM), achieving 'Write Once, Run Anywhere'.",
    example: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java Arena!");\n    }\n}`,
    keyPoints: [
      "Source file name must match public class name exactly.",
      "main method signature: public static void main(String[] args).",
      "System.out.println() prints text to standard console."
    ]
  },
  {
    key: "java_variables",
    category: "java",
    title: "Java Variables & Data Types",
    accent: "#EF4444",
    summary: "Primitive types (int, double, boolean, char) vs Reference types (String, Objects).",
    explanation: "Java has 8 primitive data types (byte, short, int, long, float, double, boolean, char) and object reference types.",
    example: `int level = 5;\ndouble speed = 9.8;\nboolean isVictory = true;\nString heroName = "Naruto";`,
    keyPoints: [
      "Primitives store actual values directly on the stack.",
      "Reference types store memory addresses pointing to objects on the heap.",
      "String is an immutable class in Java."
    ]
  },
  {
    key: "java_oop",
    category: "java",
    title: "OOP in Java",
    accent: "#EF4444",
    summary: "Classes, objects, encapsulation, inheritance, and interface contracts.",
    explanation: "Everything in Java revolves around classes and objects.",
    example: `public class Player {\n    private String username;\n    private int elo;\n\n    public Player(String username, int elo) {\n        this.username = username;\n        this.elo = elo;\n    }\n    public int getElo() { return elo; }\n}`,
    keyPoints: [
      "Encapsulate fields with private visibility and public getters/setters.",
      "'this' refers to current object instance.",
      "Constructors initialize object fields during instantiation with new."
    ]
  },
  {
    key: "java_collections",
    category: "java",
    title: "Java Collections Framework",
    accent: "#EF4444",
    summary: "ArrayList, LinkedList, HashSet, and HashMap.",
    explanation: "The Collections framework provides unified architecture for storing and manipulating groups of objects.",
    example: `import java.util.ArrayList;\nimport java.util.HashMap;\n\nArrayList<String> roster = new ArrayList<>();\nroster.add("Gojo");\n\nHashMap<String, Integer> coins = new HashMap<>();\ncoins.put("Gojo", 500);`,
    keyPoints: [
      "List allows duplicates and maintains insertion order.",
      "Set contains unique elements only (no duplicates).",
      "Map stores key-value pairs using unique keys."
    ]
  },
  {
    key: "java_exceptions",
    category: "java",
    title: "Exception Handling in Java",
    accent: "#EF4444",
    summary: "Checked vs Unchecked exceptions using try, catch, finally, and throw.",
    explanation: "Exceptions handle runtime errors gracefully to maintain application stability.",
    example: `try {\n    int result = 10 / 0;\n} catch (ArithmeticException e) {\n    System.out.println("Cannot divide by zero!");\n} finally {\n    System.out.println("Execution finished.");\n}`,
    keyPoints: [
      "try block contains risky code that may throw exceptions.",
      "catch block handles specific exception types.",
      "finally block executes regardless of whether an exception occurred."
    ]
  },

  // ================= PYTHON PROGRAMMING =================
  {
    key: "python_basics",
    category: "python",
    title: "Python Basics",
    accent: "#22C55E",
    summary: "High-level, interpreted language emphasizing code readability and clean syntax.",
    explanation: "Python uses indentation (4 spaces) instead of curly braces to delimit code blocks.",
    example: `# Python Hello World\ndef greet(name):\n    print(f"Welcome, {name}!")\n\ngreet("Cyber Ninja")`,
    keyPoints: [
      "Indentation defines block scope (PEP 8 recommends 4 spaces).",
      "Dynamic typing: variables do not require explicit type declarations.",
      "f-strings (f'...') provide clean string interpolation."
    ]
  },
  {
    key: "python_data_structures",
    category: "python",
    title: "Lists, Tuples, Sets & Dicts in Python",
    accent: "#22C55E",
    summary: "Core built-in Python collection types.",
    explanation: "Python features rich built-in data structures suited for data manipulation.",
    example: `players = ["Naruto", "Saitama"] # List (mutable)\ncoords = (10, 20)             # Tuple (immutable)\nunique_tags = {"pvp", "ai"}   # Set (unique)\nstats = {"elo": 1400, "hp": 100} # Dict (key-value)`,
    keyPoints: [
      "Lists [] are ordered and mutable.",
      "Tuples () are ordered and immutable.",
      "Dictionaries {} store key-value pairs with O(1) key lookups."
    ]
  },
  {
    key: "python_comprehensions",
    category: "python",
    title: "List & Dict Comprehensions",
    accent: "#22C55E",
    summary: "Concise syntax for creating lists and dictionaries.",
    explanation: "Comprehensions provide a compact way to construct collections from iterables.",
    example: `# List comprehension\nsquares = [x**2 for x in range(5)] # [0, 1, 4, 9, 16]\n\n# Filtered comprehension\nevens = [x for x in range(10) if x % 2 == 0]`,
    keyPoints: [
      "Replaces multi-line for-loops with single-line expressive syntax.",
      "Can include conditional filtering (if x % 2 == 0).",
      "Dict comprehensions use key:value syntax {k: v for k, v in ...}."
    ]
  },
  {
    key: "python_oop",
    category: "python",
    title: "OOP in Python",
    accent: "#22C55E",
    summary: "Classes, __init__ constructor, self reference, and methods.",
    explanation: "Python supports full Object-Oriented Programming with class definitions.",
    example: `class BattleBot:\n    def __init__(self, name, power):\n        self.name = name\n        self.power = power\n\n    def attack(self):\n        return f"{self.name} strikes with power {self.power}!"\n\nbot = BattleBot("CyberAI", 95)`,
    keyPoints: [
      "__init__() acts as the object constructor.",
      "'self' must be explicitly passed as the first parameter to instance methods.",
      "Inheritance is declared as class Child(Parent):."
    ]
  },

  // ================= JAVASCRIPT PROGRAMMING =================
  {
    key: "javascript_basics",
    category: "javascript",
    title: "JavaScript Basics",
    accent: "#FFD700",
    summary: "Dynamic scripting language powering web interactivity and Node.js backends.",
    explanation: "JavaScript is single-threaded, event-driven, and supports prototype-based object orientation.",
    example: `const playerName = "ShadowByte";\nlet elo = 1200;\n\nfunction addScore(points) {\n    elo += points;\n    console.log(\`\${playerName} now has ELO \${elo}\`);\n}\naddScore(25);`,
    keyPoints: [
      "const declares read-only variable references.",
      "let declares block-scoped mutable variables.",
      "Avoid var due to function-scoping and hoisting pitfalls."
    ]
  },
  {
    key: "javascript_arrays",
    category: "javascript",
    title: "JS Array Higher-Order Methods",
    accent: "#FFD700",
    summary: "Transforming and filtering arrays with map, filter, reduce, and find.",
    explanation: "Functional array methods simplify processing without mutating original data.",
    example: `const scores = [80, 95, 60, 100];\n\n// Filter scores >= 80\nconst highScores = scores.filter(s => s >= 80);\n\n// Double scores\nconst doubled = scores.map(s => s * 2);\n\n// Total sum\nconst sum = scores.reduce((total, s) => total + s, 0);`,
    keyPoints: [
      "map() returns a new array of transformed items.",
      "filter() returns items matching a boolean condition.",
      "reduce() aggregates elements into a single accumulator value."
    ]
  },
  {
    key: "javascript_async",
    category: "javascript",
    title: "Async / Await & Promises",
    accent: "#FFD700",
    summary: "Asynchronous programming with Promises and async/await syntax.",
    explanation: "Promises manage asynchronous operations (like API calls) without callback hell.",
    example: `async function fetchLeaderboard() {\n    try {\n        const response = await fetch('/api/leaderboard');\n        const data = await response.json();\n        console.log(data);\n    } catch (error) {\n        console.error("API error:", error);\n    }\n}`,
    keyPoints: [
      "async functions return a Promise implicitly.",
      "await pauses function execution until the Promise settles.",
      "Wrap await calls in try...catch blocks for clean error handling."
    ]
  },

  // ================= WEB DEVELOPMENT =================
  {
    key: "web_html_css",
    category: "web",
    title: "HTML5 & CSS3 Responsive Layouts",
    accent: "#00E5FF",
    summary: "Semantic markup, Flexbox, and CSS Grid for modern web interfaces.",
    explanation: "HTML structures webpage content while CSS styles presentation and layouts.",
    example: `/* Flexbox Centering */\n.container {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    gap: 16px;\n}\n\n/* Responsive Grid */\n.grid {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n}`,
    keyPoints: [
      "Semantic HTML (<header>, <main>, <nav>, <section>) improves SEO and accessibility.",
      "Flexbox excels at 1D layout distribution (rows or columns).",
      "CSS Grid manages 2D grid layouts effortlessly."
    ]
  },
  {
    key: "web_react",
    category: "web",
    title: "React Fundamentals",
    accent: "#00E5FF",
    summary: "Component-driven UI, JSX, props, useState, and useEffect hooks.",
    explanation: "React is a declarative JavaScript library for building component-based user interfaces.",
    example: `import { useState, useEffect } from 'react';\n\nexport function Counter() {\n    const [count, setCount] = useState(0);\n    return (\n        <button onClick={() => setCount(count + 1)}>\n            Count: {count}\n        </button>\n    );\n}`,
    keyPoints: [
      "JSX enables writing HTML-like markup inside JavaScript.",
      "useState manages local component state.",
      "useEffect handles side-effects (API fetching, subscriptions)."
    ]
  },
  {
    key: "web_node_express",
    category: "web",
    title: "Node.js & Express REST APIs",
    accent: "#00E5FF",
    summary: "Building backend RESTful endpoints with Node.js runtime and Express framework.",
    explanation: "Node.js executes JavaScript on the server; Express simplifies routing and middleware.",
    example: `import express from 'express';\nconst app = express();\napp.use(express.json());\n\napp.get('/api/status', (req, res) => {\n    res.json({ status: 'online' });\n});`,
    keyPoints: [
      "Node.js utilizes an event-driven, non-blocking I/O event loop.",
      "Express middleware processes requests prior to sending responses.",
      "REST APIs use standard HTTP verbs (GET, POST, PUT, DELETE)."
    ]
  },

  // ================= DATABASE =================
  {
    key: "db_sql",
    category: "db",
    title: "SQL & Relational Databases",
    accent: "#F59E0B",
    summary: "Structured Query Language, relational tables, schema design, and CRUD operations.",
    explanation: "SQL manages relational databases (MySQL, PostgreSQL) using tabular schemas.",
    example: `-- CRUD Operations\nSELECT username, elo FROM users WHERE elo >= 1200 ORDER BY elo DESC;\nINSERT INTO users (username, elo) VALUES ('ShadowByte', 1300);\nUPDATE users SET elo = 1350 WHERE username = 'ShadowByte';`,
    keyPoints: [
      "SELECT queries retrieve matching database records.",
      "Indexes speed up data lookup on queried columns.",
      "Foreign keys enforce relational integrity between tables."
    ]
  },
  {
    key: "db_mongodb",
    category: "db",
    title: "MongoDB & NoSQL",
    accent: "#F59E0B",
    summary: "Document-oriented database storing JSON-like BSON documents.",
    explanation: "MongoDB is a flexible NoSQL database storing documents in collections without rigid table schemas.",
    example: `// Mongoose Query Example\nimport { User } from './models/User.js';\n\nconst topPlayers = await User.find({ elo: { $gte: 1000 } })\n    .sort({ elo: -1 })\n    .limit(10);`,
    keyPoints: [
      "Documents store data in flexible BSON format (JSON-like).",
      "Collections hold groups of related documents.",
      "Mongoose provides schema validation and object modeling for Node.js."
    ]
  },

  // ================= COMPUTER SCIENCE =================
  {
    key: "cs_ds_algo",
    category: "cs",
    title: "Data Structures & Algorithms",
    accent: "#10B981",
    summary: "Time complexity Big-O, arrays, linked lists, trees, graphs, and sorting.",
    explanation: "Data structures organize memory; algorithms process data efficiently.",
    example: `// Big-O Time Complexities:\n// O(1)      - Constant (Hash map lookup)\n// O(log N)  - Logarithmic (Binary search)\n// O(N)      - Linear (Array traversal)\n// O(N log N)- Log-linear (QuickSort / MergeSort)`,
    keyPoints: [
      "Big-O notation measures algorithm scalability in time and space.",
      "Binary Search requires a pre-sorted array for O(log N) lookups.",
      "Hash maps provide O(1) average time complexity for insertions and lookups."
    ]
  },
  {
    key: "cs_os_networks",
    category: "cs",
    title: "OS & Computer Networks",
    accent: "#10B981",
    summary: "Processes vs threads, memory management, TCP/IP, and HTTP/HTTPS protocols.",
    explanation: "Operating systems manage hardware resources; networks connect distributed systems.",
    example: `// Network Layer Stack:\n// Application: HTTP, HTTPS, WebSockets\n// Transport:   TCP, UDP\n// Internet:    IP (IPv4, IPv6)\n// Link:        Ethernet, Wi-Fi`,
    keyPoints: [
      "Processes hold separate memory space; threads share process memory.",
      "TCP guarantees ordered, reliable packet delivery; UDP provides low-latency streaming.",
      "HTTP/2 & HTTP/3 multiplex requests over persistent connections."
    ]
  },

  // ================= ADVANCED =================
  {
    key: "advanced_ai_ml",
    category: "advanced",
    title: "Machine Learning & AI Basics",
    accent: "#EC4899",
    summary: "Supervised vs Unsupervised learning, neural networks, and model evaluation.",
    explanation: "Machine Learning enables algorithms to learn patterns from data and make predictions.",
    example: `# Conceptual ML Pipeline\nfrom sklearn.model_selection import train_test_split\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)\nmodel.fit(X_train, y_train)\naccuracy = model.score(X_test, y_test)`,
    keyPoints: [
      "Supervised learning trains on labeled datasets (Regression, Classification).",
      "Unsupervised learning finds hidden patterns in unlabeled data (Clustering, K-Means).",
      "Deep Learning uses multi-layered neural networks for complex pattern recognition."
    ]
  },
  {
    key: "advanced_cloud",
    category: "advanced",
    title: "Cloud Computing & Microservices",
    accent: "#EC4899",
    summary: "Docker containers, Kubernetes orchestration, serverless, and cloud architecture.",
    explanation: "Cloud computing delivers scalable infrastructure, storage, and services over the internet.",
    example: `# Dockerfile Example\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nCMD ["npm", "start"]`,
    keyPoints: [
      "Docker containers package code and dependencies for consistent deployment.",
      "Microservices decouple applications into independent, scalable services.",
      "Serverless functions execute on-demand without managing server infrastructure."
    ]
  }
];
