export const javascriptCurriculum = {
  course: {
    slug: 'javascript-mastery',
    title: 'JavaScript Mastery',
    description:
      'A 4-week JavaScript curriculum covering the fundamentals, modern ES6+ concepts, asynchronous programming, DOM manipulation, and building small interactive applications.',
    duration_weeks: 4,

    weeks: [
      // ------------------------------------------
      // WEEK 1 — FUNDAMENTALS
      // ------------------------------------------
      {
        week: 1,
        title: 'JavaScript Foundations',
        description:
          'Students learn the core building blocks of JavaScript: syntax, variables, operators, functions, and control flow.',

        lessons: [
          {
            title: 'Introduction to JavaScript & How It Works',
            content: [
              'What JavaScript is used for',
              'JavaScript engines (V8)',
              'Compilation vs interpretation',
              'How code executes (Call Stack & Memory)'
            ]
          },
          {
            title: 'Variables, Data Types & Operators',
            content: [
              'let vs const vs var',
              'Primitive types vs reference types',
              'String/number/boolean operations',
              'Type coercion & equality (== vs ===)'
            ]
          },
          {
            title: 'Functions & Scope',
            content: [
              'Function declarations vs expressions',
              'Arrow functions',
              'Block/function/global scope',
              'Closures explained simply'
            ]
          },
          {
            title: 'Conditionals & Loops',
            content: [
              'if / else / switch',
              'for, while, forEach, for..of',
              'Looping arrays & objects',
              'Best practices for control flow'
            ]
          }
        ],

        assignments: [
          {
            title: 'JS Assignment 1: Build a Basic Calculator',
            tasks: [
              'Add, subtract, multiply, divide',
              'Accept user input',
              'Use functions for operations'
            ]
          },
          {
            title: 'JS Assignment 2: Number Guessing Game',
            tasks: [
              'Generate random numbers',
              'Use loops + conditionals',
              'Give hints (too high/low)'
            ]
          }
        ]
      },

      // ------------------------------------------
      // WEEK 2 — ARRAYS, OOP & DOM
      // ------------------------------------------
      {
        week: 2,
        title: 'Arrays, Objects, DOM Manipulation',
        description:
          'Students dive into arrays, objects, DOM manipulation, events, and building real interactive features.',

        lessons: [
          {
            title: 'Arrays & Iteration',
            content: [
              'push, pop, map, filter, reduce',
              'Spread, rest, destructuring',
              'Deep vs shallow copy'
            ]
          },
          {
            title: 'Objects & OOP in JavaScript',
            content: [
              'Object literals',
              'Prototypes',
              'Classes & constructors',
              'The “this” keyword explained simply'
            ]
          },
          {
            title: 'DOM Manipulation',
            content: [
              'querySelector & getElementById',
              'Changing text, styles, attributes',
              'Event listeners',
              'Building interactive UI'
            ]
          },
          {
            title: 'Browser APIs',
            content: [
              'localStorage & sessionStorage',
              'Timers (setTimeout/setInterval)',
              'Date & Math'
            ]
          }
        ],

        assignments: [
          {
            title: 'JS Assignment 3: Build a To-Do List App',
            tasks: [
              'Add/delete tasks',
              'Use DOM events',
              'Persist with localStorage'
            ]
          }
        ]
      },

      // ------------------------------------------
      // WEEK 3 — ASYNC + ES6+
      // ------------------------------------------
      {
        week: 3,
        title: 'ES6+, Async JavaScript & API Calls',
        description:
          'Students learn modern JavaScript: promises, async/await, modules, error handling, and working with APIs.',

        lessons: [
          {
            title: 'Modern ES6+ Features',
            content: [
              'let/const recap',
              'Template literals',
              'Default parameters',
              'Destructuring',
              'Modules (import/export)'
            ]
          },
          {
            title: 'Promises & Async/Await',
            content: [
              'Promise states',
              '.then() vs async/await',
              'try/catch and error handling'
            ]
          },
          {
            title: 'Working With APIs (Fetch API)',
            content: [
              'GET/POST requests',
              'JSON parsing',
              'Common error cases',
              'Building dynamic UIs from APIs'
            ]
          },
          {
            title: 'Advanced Array Techniques',
            content: [
              'Chaining map/filter/reduce',
              'Sorting & grouping',
              'Transforming API data'
            ]
          }
        ],

        assignments: [
          {
            title: 'JS Assignment 4: Weather App Using API',
            tasks: [
              'Call a weather API',
              'Display temperature & city info',
              'Handle errors gracefully'
            ]
          }
        ]
      },

      // ------------------------------------------
      // WEEK 4 — BUILDING PROJECTS
      // ------------------------------------------
      {
        week: 4,
        title: 'Project Architecture, Clean Code & Final App',
        description:
          'Students learn to structure apps, separate modules, write reusable code, and build a final project.',

        lessons: [
          {
            title: 'Modular JavaScript',
            content: [
              'File organization',
              'Named vs default exports',
              'Reusable functions'
            ]
          },
          {
            title: 'Clean Code Principles',
            content: [
              'Naming conventions',
              'Avoiding repetition (DRY)',
              'Pure functions'
            ]
          },
          {
            title: 'Debugging & Testing Basics',
            content: [
              'console tools',
              'breakpoints',
              'Try/catch patterns'
            ]
          },
          {
            title: 'Building Your First Small App',
            content: [
              'Fetch + DOM + events',
              'Responsive layout',
              'Project structure'
            ]
          }
        ],

        assignments: [
          {
            title: 'Final JavaScript Project: Build a Mini App',
            tasks: [
              'Choose: Movie App / Notes App / Recipe App / Quiz App',
              'Use API or localStorage',
              'Fully interactive UI',
              'Prepare final GitHub repo'
            ]
          }
        ]
      }
    ]
  }
};
