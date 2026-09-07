import { useState } from "react";

const STUDY_TOPICS = [
  {
    key: "html",
    title: "HTML",
    accent: "#FF7A00",
    summary: "Build page structure using tags, attributes, and semantic elements.",
    notes: [
      {
        heading: "Document Essentials",
        text: `HTML pages begin with <!doctype html> and are wrapped inside <html>. The <head> section contains document metadata, page titles, external stylesheets, and script links, while the <body> section contains content that is rendered visually by the browser. Understanding this structure is essential because it defines which content will be indexed by search engines, which scripts will load first, and how the document is parsed by the browser.`
      },
      {
        heading: "Semantic HTML",
        text: `Semantic HTML uses tags that describe their meaning rather than only how they look. Elements such as <header>, <nav>, <main>, <article>, <section>, and <footer> help you organize content into meaningful blocks, improve accessibility for screen readers, and make your markup easier to maintain. Semantic tags also help the browser understand page structure for search engines and other tools.`
      },
      {
        heading: "Text Content and Headings",
        text: `Headings are written using <h1> through <h6> and form a hierarchy of content. Paragraphs use <p>, while blockquotes and preformatted text use <blockquote> and <pre> respectively. Creating a clear heading structure helps readers and assistive technologies understand the purpose of each section, and it also improves SEO because search engines can identify the main topics on a page.`
      },
      {
        heading: "Lists, Tables, and Media",
        text: `Use unordered lists (<ul>), ordered lists (<ol>), and definition lists (<dl>) when organizing content into related items. Tables (<table>, <thead>, <tbody>, <tr>, <th>, and <td>) are appropriate for tabular data, not layout. Add media such as <img>, <audio>, <video>, and <picture> to make content richer, and always include alt text or captions for accessibility.`
      },
      {
        heading: "Hyperlinks and Navigation",
        text: `Links are defined with <a href="..."> and form the backbone of the web. Use descriptive anchor text, avoid vague labels like "click here", and prefer relative URLs for internal navigation. Navigation bars should be wrapped in <nav> and include links to the most important sections of your site.`
      },
      {
        heading: "Forms and User Input",
        text: `Forms collect user input using <form>, <input>, <textarea>, <select>, and <button>. Use type attributes like email, password, number, and date to trigger browser-level validation. Always pair inputs with <label> elements and use proper grouping (<fieldset> and <legend>) for related fields.`
      },
      {
        heading: "Metadata and SEO",
        text: `Metadata lives in the <head> and includes <title>, <meta name="description">, Open Graph tags, link tags for icons, and canonical URLs. This information does not display on the page but is crucial for search engines, social sharing, and browser behavior. Make your title informative, keep descriptions concise, and use metadata to improve your page’s discoverability.`
      },
      {
        heading: "Accessibility Fundamentals",
        text: `Accessibility means making your site usable by people with disabilities. This includes adding alt text to images, using ARIA roles when necessary, ensuring keyboard navigation works, and providing enough contrast between text and background. Use semantic HTML whenever possible before adding ARIA attributes.`
      },
      {
        heading: "Performance and File Structure",
        text: `Organize HTML with well-structured folders for assets, scripts, and styles. Keep markup clean and minimize inline scripts/styles to improve maintainability. Avoid loading heavy assets before the main content, and defer scripts when possible so the page renders quickly.`
      },
      {
        heading: "Practical HTML Patterns",
        text: `Common page patterns include hero sections, feature cards, pricing tables, and blog post layouts. Practice building these patterns using semantic HTML and well-named classes. As you build, focus on clear structure, predictable nesting, and content that still makes sense without visual styling.`
      }
    ]
  },
  {
    key: "css",
    title: "CSS",
    accent: "#00E5FF",
    summary: "Style HTML pages with selectors, layout, colors, and responsive design.",
    notes: [
      {
        heading: "Selectors and Specificity",
        text: `CSS selectors target HTML elements so you can apply styles to them. Basic selectors include element selectors, class selectors, and ID selectors. More advanced selectors include descendant selectors, child selectors, attribute selectors, pseudo-classes, and pseudo-elements. Specificity determines which rules win when multiple selectors match the same element, and understanding it prevents style conflicts.`
      },
      {
        heading: "The Box Model",
        text: `Every HTML element is a box that includes content, padding, border, and margin. The box model affects layout, sizing, and spacing, and the default box-sizing property can make width calculations confusing. Setting box-sizing: border-box on all elements makes it easier to build predictable layouts because the declared width includes padding and border.`
      },
      {
        heading: "Typographic Styling",
        text: `Typography is a major part of visual design. Control font families, font sizes, line heights, font weights, and letter spacing. Use responsive font sizing with relative units like rem and em, and choose text colors that meet contrast guidelines for readability across devices.`
      },
      {
        heading: "Color and Themes",
        text: `CSS custom properties (variables) let you define a color palette and reuse it across your stylesheet. Create semantic colors such as --color-primary and --color-background, then apply them consistently. Using variables also makes it easy to build theme modes such as light and dark.`
      },
      {
        heading: "Layout with Flexbox",
        text: `Flexbox is ideal for arranging elements in a row or column. Use display: flex, justify-content, align-items, and gap to build header bars, button groups, and card layouts. Flexbox is perfect for one-dimensional alignments, where you control either row or column flow at a time.`
      },
      {
        heading: "Layout with Grid",
        text: `CSS Grid provides a two-dimensional layout system. Define rows and columns with grid-template-columns and grid-template-rows, place items precisely, and use grid gap for consistent spacing. Grid is great for complex page layouts, dashboards, and responsive multi-column designs.`
      },
      {
        heading: "Responsive Design",
        text: `Responsive design adapts layouts for different screen sizes. Use media queries to change styles at breakpoints, fluid units like % and vw, and flex/grid layouts that reflow naturally. Start with a mobile-first approach so smaller screens receive the core layout first, and add enhancements for larger viewports.`
      },
      {
        heading: "Transitions and Animations",
        text: `CSS transitions smoothly animate property changes, while keyframe animations allow more complex sequences. Use opacity, transform, and color transitions sparingly to create polished micro-interactions. Avoid excessive motion and respect reduced-motion preferences for accessibility.`
      },
      {
        heading: "Responsive Units and Media Queries",
        text: `Use rem for scalable typography, em for relative spacing, and viewport units like vw/vh for full-screen layouts. Media queries let you adjust styles based on screen width, orientation, or device characteristics. Combine fluid sizing with breakpoints to make designs feel natural on every device.`
      },
      {
        heading: "Maintenance and Organization",
        text: `Keep CSS maintainable by grouping related rules, using meaningful class names, and avoiding overly specific selectors. Consider methodologies like BEM or utility-first systems to name classes consistently. Minimize duplication and use custom properties for color, spacing, and theme values.`
      }
    ]
  },
  {
    key: "javascript",
    title: "JavaScript",
    accent: "#FFD700",
    summary: "Make pages interactive using variables, functions, DOM manipulation, and event handling.",
    notes: [
      {
        heading: "Language Fundamentals",
        text: `JavaScript is the language of the web. Learn how to declare variables with const and let, create functions, and work with built-in types including strings, numbers, booleans, arrays, and objects. Understanding basic syntax is the foundation for writing any interactive web application.`
      },
      {
        heading: "Expressions and Operators",
        text: `JavaScript supports arithmetic, comparison, logical, and assignment operators. Use expressions to compute values, test conditions with === and !==, and combine conditions with && or ||. Proper operator usage helps avoid bugs and makes code easier to reason about.`
      },
      {
        heading: "Control Flow",
        text: `Control flow statements like if, else if, else, switch, while, and for determine the order in which code executes. Use loops to repeat tasks, conditions to choose different paths, and early returns inside functions to simplify complex logic.`
      },
      {
        heading: "Functions and Scope",
        text: `Functions encapsulate reusable logic and can accept parameters and return values. JavaScript functions have lexical scope, meaning variables declared within a function are not visible outside it. Arrow functions provide concise syntax, but remember that they do not have their own this context.`
      },
      {
        heading: "Working with Objects",
        text: `Objects are collections of key-value pairs and are central to JavaScript. Create objects using literals, access properties with dot or bracket notation, and use methods to group behavior with data. Objects are used to represent application state, configuration, and complex data structures.`
      },
      {
        heading: "Arrays and Iteration",
        text: `Arrays store ordered lists of values. Use push, pop, shift, unshift, and splice to modify arrays. Higher-order methods like map, filter, reduce, and forEach make it easy to transform arrays and derive new results in a functional style.`
      },
      {
        heading: "DOM Manipulation",
        text: `The Document Object Model (DOM) represents the page structure. Use document.querySelector and document.querySelectorAll to select elements, then update their text, attributes, and classes. Respond to user actions by adding event listeners for click, submit, input, and keyboard events.`
      },
      {
        heading: "Asynchronous JavaScript",
        text: `Asynchronous programming lets JavaScript handle delayed tasks without blocking the page. Promises represent future values, and async/await provides a readable way to handle them. Fetch data from APIs, process it once available, and gracefully handle errors with try/catch.`
      },
      {
        heading: "Error Handling and Debugging",
        text: `Use try/catch blocks to handle run-time errors, and throw custom errors when inputs are invalid. Browser developer tools let you set breakpoints, inspect variables, and step through code. Logging values with console.log and inspecting network requests are essential debugging skills.`
      },
      {
        heading: "Writing Maintainable Code",
        text: `Keep your JavaScript modular by splitting code into functions and files. Use descriptive variable names, avoid deeply nested conditions, and extract repeated logic into reusable helpers. Consistent formatting and comments make your code easier for others — and future you — to understand.`
      }
    ]
  },
  {
    key: "python",
    title: "Python",
    accent: "#22C55E",
    summary: "Write readable scripts and backend logic with variables, functions, and data structures.",
    notes: [
      {
        heading: "Python Syntax and Style",
        text: `Python relies on indentation to define code blocks instead of braces. Follow the PEP 8 style guide for consistent formatting, which includes using 4 spaces per indentation level, limiting line length, and choosing snake_case for variable and function names.`
      },
      {
        heading: "Built-in Types",
        text: `Python has a small set of built-in types such as int, float, str, bool, list, tuple, dict, and set. Understanding how these types behave, especially how mutability differs between lists and tuples, is crucial for writing correct programs.`
      },
      {
        heading: "Control Flow",
        text: `Use if, elif, and else for branching logic. Iterate with for loops over sequences, and use while loops for condition-based repetition. Comprehensions provide a compact way to generate lists, sets, and dictionaries from existing collections.`
      },
      {
        heading: "Functions and Arguments",
        text: `Functions are defined with def, and they can accept positional arguments, keyword arguments, default values, and variable-length argument lists (*args, **kwargs). Functions should do one thing well and return results rather than modifying global state.`
      },
      {
        heading: "Modules and Packages",
        text: `Organize code into modules (.py files) and packages (directories containing __init__.py). Import standard library modules like os, sys, math, datetime, and use third-party packages for additional functionality. This keeps code reusable and easy to share.`
      },
      {
        heading: "Working with Data Structures",
        text: `Lists and dictionaries are the most commonly used data structures in Python. Use list comprehensions for concise transformations, dictionary methods to inspect key/value pairs, and slicing to extract subsequences. Understanding how to manipulate these structures is the foundation of many Python programs.`
      },
      {
        heading: "File I/O and Persistence",
        text: `Read and write files using open(..., 'r') and open(..., 'w') with context managers (with statements). For structured data, use JSON and CSV libraries to serialize and deserialize data. Always close files or use with to ensure resources are released.`
      },
      {
        heading: "Error Handling",
        text: `Handle exceptional conditions using try, except, else, and finally blocks. Catch specific exceptions rather than using bare except, and raise meaningful errors when invalid input is provided. Robust error handling makes programs easier to debug and more user-friendly.`
      },
      {
        heading: "Object-Oriented Programming",
        text: `Python supports classes and objects, allowing you to model real-world entities. Define classes with __init__ constructors, instance methods, and properties. Use inheritance and composition to share behavior while keeping code modular.`
      },
      {
        heading: "Python Ecosystem",
        text: `The Python ecosystem includes package managers like pip, virtual environments for dependency isolation, and frameworks for web development, data analysis, and automation. Learn to create virtual environments, install packages, and use documentation to explore libraries.`
      }
    ]
  },
  {
    key: "java",
    title: "Java",
    accent: "#EF4444",
    summary: "Build scalable applications with strong typing, classes, and the JVM ecosystem.",
    notes: [
      {
        heading: "Java Program Structure",
        text: `Java code is organized into classes and packages. Every application begins execution from public static void main(String[] args). Class files are compiled to bytecode and run on the Java Virtual Machine (JVM), which makes Java portable across operating systems.`
      },
      {
        heading: "Java Types and Variables",
        text: `Java has primitive types (int, long, float, double, boolean, char, byte, short) and reference types such as String and arrays. Variables must declare their type, and understanding the difference between primitive and object types helps avoid unexpected behavior.`
      },
      {
        heading: "Methods and Control Flow",
        text: `Methods define behavior and can accept parameters, return values, and throw exceptions. Use if/else, switch, while, for, and enhanced for loops to implement logic. The for-each loop simplifies iteration over arrays and collections.`
      },
      {
        heading: "Classes and Objects",
        text: `Java is object-oriented. Classes encapsulate state with fields and behavior with methods. Use constructors to initialize objects, the this keyword to refer to instance data, and access modifiers (public, private, protected) to control visibility.`
      },
      {
        heading: "Inheritance and Polymorphism",
        text: `Inheritance allows one class to extend another and reuse its implementation. Polymorphism lets a variable refer to different subclass instances, enabling flexible code. Override methods in subclasses and use abstract classes or interfaces for common contracts.`
      },
      {
        heading: "Interfaces and Abstract Classes",
        text: `Interfaces define method signatures without implementation, and classes implement interfaces to provide behavior. Abstract classes can contain implemented methods and abstract methods. Use interfaces for loose coupling and abstract classes when you want shared code plus required overrides.`
      },
      {
        heading: "Collections and Generics",
        text: `The Collections framework includes List, Set, Map, and Queue types. Use ArrayList, HashSet, HashMap, and LinkedList for common patterns. Generics enable type-safe collections like List<String> and Map<String, Integer>.` 
      },
      {
        heading: "Exception Handling",
        text: `Java uses try, catch, finally, and throw for errors. Checked exceptions must be declared or handled, while runtime exceptions can be thrown without declaration. Handle exceptions thoughtfully to maintain program stability and provide meaningful error messages.`
      },
      {
        heading: "Input/Output and Files",
        text: `Java I/O uses streams, readers, and writers. Use BufferedReader and BufferedWriter for efficient text I/O, FileInputStream and FileOutputStream for binary data, and java.nio.file.Files for modern file operations. Always close resources or use try-with-resources.`
      },
      {
        heading: "Java Ecosystem and Tools",
        text: `Java developers use build tools like Maven and Gradle to manage dependencies and automate builds. The JDK includes powerful tools such as javac and java. Learn to read Javadoc, use the standard library, and understand the role of the JVM, garbage collector, and classpath.`
      }
    ]
  },
  {
    key: "cpp",
    title: "C++",
    accent: "#9D4EDD",
    summary: "Master systems programming with memory control, performance, and object-oriented design.",
    notes: [
      {
        heading: "C++ Program Basics",
        text: `C++ source files are typically .cpp and compile to native machine code. The program starts at int main(). C++ supports procedural and object-oriented programming, and it exposes low-level control of memory and performance.`
      },
      {
        heading: "Types, Variables, and Initialization",
        text: `C++ includes primitive types such as int, long, float, double, char, and bool. It also supports arrays, pointers, references, and user-defined types. Use initialization syntax like int x = 5; and prefer modern constructs like auto when the type is clear.`
      },
      {
        heading: "Pointers and References",
        text: `Pointers store memory addresses and allow direct memory access. References act as aliases to existing variables. Manage dynamic memory carefully with new/delete or, preferably, smart pointers such as std::unique_ptr and std::shared_ptr.`
      },
      {
        heading: "Classes and Objects",
        text: `Define classes with private data and public methods for encapsulation. Use constructors and destructors to manage initialization and cleanup. The member initializer list is the preferred way to initialize fields in constructors.`
      },
      {
        heading: "Inheritance and Polymorphism",
        text: `C++ supports single and multiple inheritance. Use virtual functions for runtime polymorphism and virtual destructors for safe cleanup in derived classes. Prefer composition over inheritance when modeling relationships.`
      },
      {
        heading: "Templates and Generic Programming",
        text: `Templates enable generic functions and classes. Write template code like template<typename T> and use standard containers such as std::vector<T> and std::map<Key, Value>. Templates are essential for reusable library code.`
      },
      {
        heading: "The Standard Library",
        text: `The Standard Template Library (STL) includes containers, algorithms, and iterators. Use std::vector, std::string, std::map, and std::algorithm functions like sort, find, and transform to simplify your code and avoid low-level loops.`
      },
      {
        heading: "Memory Management",
        text: `Manual memory management is central to C++. Use RAII (Resource Acquisition Is Initialization) to tie resources to object lifetime. Smart pointers, move semantics, and containers help avoid leaks and dangling pointers.`
      },
      {
        heading: "Performance and Optimization",
        text: `C++ is often used for high-performance software. Avoid unnecessary copies, use move semantics, and choose the right data structures. Profile code before optimizing and focus on algorithmic efficiency rather than micro-optimizations.`
      },
      {
        heading: "Build Systems and Toolchains",
        text: `Compile C++ with g++, clang++, or MSVC. Use build tools like CMake to manage multi-file projects and dependencies. Organize code into header (.h/.hpp) and source (.cpp) files, and understand compiler errors to fix issues quickly.`
      }
    ]
  }
];

export default function VaultPage() {
  const [selected, setSelected] = useState("html");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("study"); // study | personal
  const [userNotes, setUserNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("vault_user_notes");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [saveStatus, setSaveStatus] = useState("");

  const topic = STUDY_TOPICS.find((item) => item.key === selected) || STUDY_TOPICS[0];

  const handleSaveNotes = (text) => {
    const updated = { ...userNotes, [selected]: text };
    setUserNotes(updated);
    try {
      localStorage.setItem("vault_user_notes", JSON.stringify(updated));
      setSaveStatus("✅ Personal notes saved successfully!");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (e) {
      setSaveStatus("⚠️ Failed to save notes to browser storage.");
    }
  };

  const filteredNotes = topic ? topic.notes.filter((note) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return note.heading.toLowerCase().includes(q) || note.text.toLowerCase().includes(q);
  }) : [];

  return (
    <div className="vault-page glass-panel" style={{ padding: "28px", borderRadius: 16 }}>
      {/* Vault Header */}
      <div className="vault-hero" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <span className="vault-icon" style={{ fontSize: 36 }}>📘</span>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, color: "#fff" }}>Programming Study Vault & Personal Notepad</h2>
          <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "var(--text-dim)" }}>
            Unlock comprehensive topic notes, cheat-sheets, and store your own custom code snippets per language.
          </p>
        </div>
      </div>

      {/* Language Selector Buttons */}
      <div className="vault-selection-row" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        {STUDY_TOPICS.map((item) => (
          <button
            key={item.key}
            className={`vault-selection-btn ${selected === item.key ? "active" : ""}`}
            style={{
              borderColor: item.accent,
              background: selected === item.key ? `${item.accent}25` : "rgba(255, 255, 255, 0.03)",
              color: selected === item.key ? item.accent : "#fff",
              padding: "10px 18px",
              borderRadius: 8,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onClick={() => setSelected(item.key)}
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* Sub Header & View Toggles */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className={`btn ${activeTab === "study" ? "btn-start" : "btn-ghost"}`}
            style={{ padding: "8px 16px", fontSize: 12 }}
            onClick={() => setActiveTab("study")}
          >
            📖 STUDY NOTES ({filteredNotes.length})
          </button>
          <button
            className={`btn ${activeTab === "personal" ? "btn-start" : "btn-ghost"}`}
            style={{ padding: "8px 16px", fontSize: 12, borderColor: topic.accent, color: activeTab === "personal" ? "#fff" : topic.accent }}
            onClick={() => setActiveTab("personal")}
          >
            ✏️ MY PERSONAL NOTEPAD
          </button>
        </div>

        {activeTab === "study" && (
          <div style={{ position: "relative", minWidth: 260 }}>
            <input
              type="text"
              className="auth-input"
              placeholder={`🔍 Search ${topic.title} notes…`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: "8px 14px", fontSize: 12, margin: 0 }}
            />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeTab === "study" ? (
        <article className="vault-card" style={{ border: `1px solid ${topic.accent}40`, borderRadius: 12, overflow: "hidden" }}>
          <div className="vault-card-header" style={{ background: `${topic.accent}18`, padding: "18px 24px", borderBottom: `1px solid ${topic.accent}30` }}>
            <span className="vault-card-badge" style={{ background: topic.accent, color: "#000", fontWeight: 800, padding: "4px 10px", borderRadius: 6, fontSize: 12 }}>
              {topic.title} SUMMARY
            </span>
            <p style={{ margin: "10px 0 0 0", fontSize: 14, color: "#fff", lineHeight: 1.5 }}>{topic.summary}</p>
          </div>

          <div className="vault-card-notes" style={{ padding: "24px", display: "grid", gap: 20 }}>
            {filteredNotes.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px", color: "var(--text-dim)" }}>
                No study notes matched your search query "{searchQuery}".
              </div>
            ) : (
              filteredNotes.map((note, idx) => (
                <div
                  key={note.heading || idx}
                  className="vault-note glass-panel"
                  style={{ padding: "16px 20px", borderRadius: 10, background: "rgba(255, 255, 255, 0.02)", borderLeft: `3px solid ${topic.accent}` }}
                >
                  <h3 style={{ margin: "0 0 8px 0", fontSize: 16, color: topic.accent }}>
                    {idx + 1}. {note.heading}
                  </h3>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--text-primary)", lineHeight: 1.6 }}>{note.text}</p>
                </div>
              ))
            )}
          </div>
        </article>
      ) : (
        /* Personal User Notepad Area */
        <div className="glass-panel" style={{ padding: "24px", borderRadius: 12, border: `1px solid ${topic.accent}50` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <h3 style={{ margin: 0, color: topic.accent, fontSize: 18 }}>
                ✏️ Personal Notes for {topic.title}
              </h3>
              <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "var(--text-dim)" }}>
                Write your own custom formulas, code snippets, or key reminders. Automatically saved in your browser!
              </p>
            </div>
            {saveStatus && (
              <span style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", background: "rgba(34, 197, 94, 0.15)", padding: "4px 10px", borderRadius: 6 }}>
                {saveStatus}
              </span>
            )}
          </div>

          <textarea
            className="auth-input"
            rows={12}
            placeholder={`Type your custom ${topic.title} notes, code snippets, or study reminders here…`}
            value={userNotes[selected] || ""}
            onChange={(e) => handleSaveNotes(e.target.value)}
            style={{ width: "100%", fontFamily: "monospace", fontSize: 13, lineHeight: 1.6, resize: "vertical" }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
              Character Count: {(userNotes[selected] || "").length}
            </span>
            <button
              className="btn btn-start"
              onClick={() => handleSaveNotes(userNotes[selected] || "")}
              style={{ padding: "8px 20px", fontSize: 12 }}
            >
              💾 SAVE NOTES
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
