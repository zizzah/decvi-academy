// prisma/seeds/css-tailwind-curriculum-seed.ts

import { PrismaClient, CourseLevel } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * CSS & Tailwind Curriculum Seed Data
 * 6-week comprehensive CSS course for absolute beginners
 * Weeks 1-4: Pure CSS fundamentals
 * Weeks 5-6: Tailwind CSS framework
 */

const cssCurriculumData = {
  course: {
    slug: 'css-tailwind-mastery',
    title: 'CSS & Tailwind Mastery Bootcamp',
    description: 'A comprehensive 6-week curriculum designed to take absolute beginners from zero styling knowledge to building beautiful, responsive websites with CSS and Tailwind CSS.',
    duration_weeks: 6,
    level: 'BEGINNER',
  },

  weeks: [
    // ============================================
    // WEEK 1: CSS Fundamentals & Selectors
    // ============================================
    // ============================================
    // WEEK 2: Box Model & Layout Fundamentals
    // ============================================
    // WEEK 3 COMPLETE: Flexbox - Modern Layout System

    {
      week_number: 1,
      title: 'CSS Fundamentals & Selectors',
      description: 'Master the foundational concepts of CSS, understand how to style HTML elements, and learn various ways to select and target elements.',
      objectives: [
        'Understand what CSS is and how it works with HTML',
        'Learn three ways to add CSS to your HTML',
        'Master basic CSS selectors (element, class, ID)',
        'Apply colors, backgrounds, and basic text styles',
        'Understand the CSS cascade and specificity'
      ],
      lessons: [
        // DAY 1
        {
          day_number: 1,
          title: 'Introduction to CSS & Adding Styles',
          objectives: [
            'Understand what CSS is and its role in web development',
            'Learn the three ways to add CSS (inline, internal, external)',
            'Write your first CSS rules',
            'Understand CSS syntax (selector, property, value)',
            'Link an external stylesheet to HTML'
          ],
          duration_mins: 50,
          content: `
# What is CSS?

CSS stands for **Cascading Style Sheets**. It's the language used to style and layout web pages.

## The House Analogy Revisited

Remember our house analogy?
- **HTML** = The structure (walls, rooms, doors)
- **CSS** = The decoration (paint colors, furniture, lighting)
- **JavaScript** = The functionality (lights that turn on, doors that open)

Without CSS, every website would look like a plain text document!

## CSS Syntax

CSS follows a simple pattern:

\`\`\`css
selector {
  property: value;
}
\`\`\`

**Example:**
\`\`\`css
p {
  color: blue;
  font-size: 18px;
}
\`\`\`

This says: "Make all paragraphs blue and 18 pixels in size."

## Three Ways to Add CSS

### 1. Inline CSS (Not Recommended)
Styles written directly in the HTML element:
\`\`\`html
<p style="color: red;">This is red text</p>
\`\`\`

**Why avoid it?** Hard to maintain, not reusable.

### 2. Internal CSS
Styles written in the \`<head>\` section using \`<style>\` tags:
\`\`\`html
<head>
  <style>
    p {
      color: blue;
    }
  </style>
</head>
\`\`\`

**Good for:** Single-page websites or testing.

### 3. External CSS (Best Practice)
Styles in a separate \`.css\` file, linked to your HTML:
\`\`\`html
<head>
  <link rel="stylesheet" href="styles.css">
</head>
\`\`\`

**Why it's best:** Clean separation, reusable across multiple pages, easier to maintain.

## Your First External Stylesheet

**index.html:**
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Styled Page</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Welcome to CSS</h1>
  <p>This paragraph will be styled!</p>
</body>
</html>
\`\`\`

**styles.css:**
\`\`\`css
h1 {
  color: darkblue;
  font-size: 36px;
}

p {
  color: gray;
  font-size: 16px;
}
\`\`\`
          `,
          code_examples: [
            {
              title: 'Complete External CSS Example',
              code: `/* styles.css */
body {
  background-color: #f0f0f0;
  font-family: Arial, sans-serif;
}

h1 {
  color: #2c3e50;
  text-align: center;
}

p {
  color: #555;
  line-height: 1.6;
}`,
              explanation: 'A basic external stylesheet that styles the body, headings, and paragraphs with colors and fonts.'
            }
          ],
          common_mistakes: [
            {
              mistake: 'Wrong file path in <link> tag',
              why: 'Browser cannot find the CSS file',
              fix: 'Make sure href="styles.css" matches your actual filename and location'
            },
            {
              mistake: 'Forgetting semicolons after CSS properties',
              why: 'CSS ignores rules without proper syntax',
              fix: 'Always end each property with a semicolon: color: red;'
            },
            {
              mistake: 'Using equals sign instead of colon',
              why: 'CSS uses colons, not equals (like HTML attributes)',
              fix: 'Use color: blue; not color=blue;'
            }
          ],
          resources: [
            {
              title: 'MDN: CSS Basics',
              url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics',
              type: 'documentation'
            },
            {
              title: 'CSS Color Names Reference',
              url: 'https://www.w3schools.com/colors/colors_names.asp',
              type: 'reference'
            }
          ],
          tasks: [
            {
              title: 'Style Your About Me Page',
              description: 'Take your HTML "About Me" page from Week 1 and add external CSS styling.',
              instructions: `
1. Create a new file named \`styles.css\` in the same folder as your HTML
2. Link the stylesheet in your HTML <head> section
3. Add the following styles:
   - Change the body background color to a light color
   - Style your h1 heading with a dark color and larger font size
   - Make your paragraphs a gray color with readable line height
   - Change the font family for the entire page
4. Save both files and refresh your browser to see the changes
              `,
              starter_code: `/* styles.css */
/* Add your CSS rules here */

body {
  /* background color */
  /* font family */
}

h1 {
  /* color */
  /* font size */
}`,
              solution_code: `/* styles.css */
body {
  background-color: #f5f5f5;
  font-family: Arial, sans-serif;
  margin: 20px;
}

h1 {
  color: #2c3e50;
  font-size: 42px;
  text-align: center;
}

p {
  color: #555;
  line-height: 1.8;
  font-size: 18px;
}`,
              estimated_time: 35,
              difficulty: 'beginner'
            }
          ]
        },
        // DAY 2
        {
          day_number: 2,
          title: 'CSS Selectors: Class and ID',
          objectives: [
            'Understand the difference between classes and IDs',
            'Apply styles using class selectors',
            'Apply styles using ID selectors',
            'Know when to use class vs ID',
            'Use multiple classes on one element'
          ],
          duration_mins: 50,
          content: `
# Beyond Element Selectors

Styling all \`<p>\` tags is useful, but what if you want some paragraphs to look different?

## Class Selectors

Classes let you create reusable styles. You can apply the same class to multiple elements.

**HTML:**
\`\`\`html
<p class="intro">This is an introduction.</p>
<p class="intro">This is also an intro.</p>
<p>This is a normal paragraph.</p>
\`\`\`

**CSS:**
\`\`\`css
.intro {
  font-size: 20px;
  font-weight: bold;
  color: navy;
}
\`\`\`

**Key Points:**
- Classes start with a dot (.) in CSS
- One element can have multiple classes: \`class="intro highlight"\`
- Many elements can share the same class

## ID Selectors

IDs are unique identifiers. Each ID should only be used **once per page**.

**HTML:**
\`\`\`html
<div id="header">Site Header</div>
<div id="main-content">Main content here</div>
\`\`\`

**CSS:**
\`\`\`css
#header {
  background-color: darkblue;
  color: white;
  padding: 20px;
}

#main-content {
  margin: 20px;
}
\`\`\`

**Key Points:**
- IDs start with a hash (#) in CSS
- Use IDs for unique elements (like main navigation, footer)
- IDs have higher specificity than classes

## Class vs ID: When to Use What?

| Feature | Class | ID |
|---------|-------|-----|
| Reusability | ✅ Use many times | ❌ Once per page |
| CSS Symbol | . (dot) | # (hash) |
| Best for | Styling groups | Unique elements |
| JavaScript | Can use | Often used |

**Golden Rule:** When in doubt, use a class. Classes are more flexible.

## Multiple Classes

You can apply multiple classes to style elements in combinations:

\`\`\`html
<button class="btn btn-primary btn-large">Click Me</button>
\`\`\`

\`\`\`css
.btn {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background-color: blue;
  color: white;
}

.btn-large {
  font-size: 20px;
}
\`\`\`
          `,
          code_examples: [
            {
              title: 'Classes for Button Styles',
              code: `/* CSS */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

/* HTML */
<button class="btn btn-success">Save</button>
<button class="btn btn-danger">Delete</button>`,
              explanation: 'Reusable button styles where .btn provides base styling and .btn-success/.btn-danger add color variations.'
            }
          ],
          common_mistakes: [
            {
              mistake: 'Using # for classes in CSS',
              why: '# is for IDs, not classes',
              fix: 'Use .classname not #classname for classes'
            },
            {
              mistake: 'Using the same ID multiple times',
              why: 'IDs must be unique on a page',
              fix: 'If you need to style multiple elements, use a class instead'
            },
            {
              mistake: 'Forgetting the dot or hash in CSS',
              why: 'Without . or #, CSS thinks it\'s an element selector',
              fix: '.intro not intro for classes, #header not header for IDs'
            }
          ],
          resources: [
            {
              title: 'MDN: Class Selectors',
              url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors',
              type: 'documentation'
            }
          ],
          tasks: [
            {
              title: 'Create a Card Component',
              description: 'Build a styled card component using classes for different card types.',
              instructions: `
1. Create an HTML file with three div elements
2. Give each div a class of "card"
3. Add additional classes: "card-blue", "card-green", "card-red"
4. In your CSS:
   - Style .card with padding, border, and border-radius
   - Style .card-blue with blue background
   - Style .card-green with green background
   - Style .card-red with red background
5. Add an element with an ID of "page-title" and style it uniquely
              `,
              starter_code: `/* styles.css */
.card {
  /* Add base card styles */
}

.card-blue {
  /* Add blue background */
}`,
              solution_code: `/* styles.css */
.card {
  padding: 20px;
  border: 2px solid #ddd;
  border-radius: 8px;
  margin: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-blue {
  background-color: #e3f2fd;
  border-color: #2196f3;
}

.card-green {
  background-color: #e8f5e9;
  border-color: #4caf50;
}

.card-red {
  background-color: #ffebee;
  border-color: #f44336;
}

#page-title {
  color: #333;
  text-align: center;
  font-size: 32px;
  margin-bottom: 30px;
}`,
              estimated_time: 40,
              difficulty: 'beginner'
            }
          ]
        },
        // DAY 3
        {
          day_number: 3,
          title: 'Colors in CSS',
          objectives: [
            'Use color keywords',
            'Apply hexadecimal colors',
            'Use RGB and RGBA colors',
            'Understand color theory basics',
            'Apply colors to text and backgrounds'
          ],
          duration_mins: 45,
          content: `
# Working with Colors

CSS gives you multiple ways to specify colors.

## 1. Color Keywords

CSS has 140 named colors:
\`\`\`css
color: red;
color: blue;
color: hotpink;
color: cornflowerblue;
\`\`\`

**Good for:** Quick prototyping, but limited options.

## 2. Hexadecimal (Hex) Colors

Most common format. Represents Red, Green, Blue values:
\`\`\`css
color: #FF0000; /* Red */
color: #00FF00; /* Green */
color: #0000FF; /* Blue */
color: #000000; /* Black */
color: #FFFFFF; /* White */
\`\`\`

**Format:** #RRGGBB
- Each pair is a value from 00 to FF (0-255 in decimal)

**Shorthand:** When pairs match, you can shorten:
\`\`\`css
#FF0000 → #F00
#00FF00 → #0F0
\`\`\`

## 3. RGB Colors

Specifies Red, Green, Blue with numbers 0-255:
\`\`\`css
color: rgb(255, 0, 0);     /* Red */
color: rgb(0, 255, 0);     /* Green */
color: rgb(128, 128, 128); /* Gray */
\`\`\`

## 4. RGBA Colors (With Transparency)

Same as RGB but with an alpha channel (opacity):
\`\`\`css
background-color: rgba(255, 0, 0, 0.5);  /* 50% transparent red */
background-color: rgba(0, 0, 0, 0.8);    /* 80% transparent black */
\`\`\`

**Alpha value:** 0 (fully transparent) to 1 (fully opaque)

## Text Color vs Background Color

\`\`\`css
.box {
  color: white;              /* Text color */
  background-color: #2c3e50; /* Background color */
}
\`\`\`

## Color Accessibility Tip

Always ensure good **contrast** between text and background colors. Dark text on light backgrounds, or light text on dark backgrounds.

**Bad:** Light gray text on white background
**Good:** Dark gray text on white background
          `,
          code_examples: [
            {
              title: 'Color Palette Example',
              code: `.primary {
  background-color: #3498db; /* Bright blue */
  color: white;
}

.secondary {
  background-color: #2ecc71; /* Green */
  color: white;
}

.dark {
  background-color: #2c3e50; /* Dark blue-gray */
  color: #ecf0f1;
}

.transparent-overlay {
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
}`,
              explanation: 'A cohesive color scheme using hex colors and RGBA for transparency effects.'
            }
          ],
          common_mistakes: [
            {
              mistake: 'Forgetting the # in hex colors',
              why: 'Without #, CSS doesn\'t recognize it as a color',
              fix: 'Use #FF0000 not FF0000'
            },
            {
              mistake: 'Poor color contrast',
              why: 'Text becomes unreadable',
              fix: 'Use dark text on light backgrounds or vice versa'
            },
            {
              mistake: 'Using color for important information only',
              why: 'Colorblind users might miss it',
              fix: 'Combine color with text or icons'
            }
          ],
          resources: [
            {
              title: 'Adobe Color Wheel',
              url: 'https://color.adobe.com',
              type: 'tool'
            },
            {
              title: 'Coolors Palette Generator',
              url: 'https://coolors.co',
              type: 'tool'
            }
          ],
          tasks: [
            {
              title: 'Build a Color Palette',
              description: 'Create a webpage displaying a color palette with different color formats.',
              instructions: `
1. Create 5 div elements with class "color-swatch"
2. Apply different background colors using:
   - One color keyword
   - Two hex colors
   - One RGB color
   - One RGBA color with transparency
3. Add text inside each div showing the color value
4. Style the text color to be readable against each background
              `,
              starter_code: `<div class="color-swatch swatch-1">
  <p>Color Name</p>
</div>`,
              solution_code: `/* CSS */
.color-swatch {
  width: 200px;
  height: 150px;
  display: inline-block;
  margin: 10px;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.swatch-1 {
  background-color: coral;
  color: white;
}

.swatch-2 {
  background-color: #3498db;
  color: white;
}

.swatch-3 {
  background-color: #2ecc71;
  color: white;
}

.swatch-4 {
  background-color: rgb(155, 89, 182);
  color: white;
}

.swatch-5 {
  background-color: rgba(231, 76, 60, 0.8);
  color: white;
}`,
              estimated_time: 35,
              difficulty: 'beginner'
            }
          ]
        },
        // DAY 4
        {
          day_number: 4,
          title: 'Text Styling & Typography',
          objectives: [
            'Style text with font properties',
            'Use web-safe fonts and Google Fonts',
            'Control text alignment and spacing',
            'Apply text decorations and transformations',
            'Understand line-height and letter-spacing'
          ],
          duration_mins: 50,
          content: `
# Making Text Beautiful

Typography is one of the most important aspects of web design.

## Font Family

The \`font-family\` property changes the typeface:
\`\`\`css
body {
  font-family: Arial, Helvetica, sans-serif;
}
\`\`\`

**Font Stack:** List multiple fonts as fallbacks. Browser uses the first available font.

**Common Web-Safe Fonts:**
- Arial, Helvetica, sans-serif
- Georgia, Times New Roman, serif
- Courier New, monospace
- Verdana, sans-serif

## Google Fonts

Thousands of free fonts available:

**1. Add to HTML <head>:**
\`\`\`html
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
\`\`\`

**2. Use in CSS:**
\`\`\`css
body {
  font-family: 'Roboto', sans-serif;
}
\`\`\`

## Font Size

\`\`\`css
h1 { font-size: 48px; }
p { font-size: 16px; }
\`\`\`

**Units:**
- \`px\` - Pixels (fixed size)
- \`em\` - Relative to parent font size
- \`rem\` - Relative to root font size
- \`%\` - Percentage of parent

## Font Weight

Controls how bold text appears:
\`\`\`css
.light { font-weight: 300; }
.normal { font-weight: 400; } /* default */
.bold { font-weight: 700; }
.extra-bold { font-weight: 900; }
\`\`\`

## Text Alignment

\`\`\`css
.left { text-align: left; }
.center { text-align: center; }
.right { text-align: right; }
.justify { text-align: justify; }
\`\`\`

## Line Height

Space between lines of text:
\`\`\`css
p {
  line-height: 1.6; /* 1.6 times the font size */
}
\`\`\`

**Rule of thumb:** Line height between 1.4 and 1.8 for body text.

## Text Decoration

\`\`\`css
.underline { text-decoration: underline; }
.no-underline { text-decoration: none; } /* Remove default link underline */
.line-through { text-decoration: line-through; }
\`\`\`

## Text Transform

\`\`\`css
.uppercase { text-transform: uppercase; } /* HELLO */
.lowercase { text-transform: lowercase; } /* hello */
.capitalize { text-transform: capitalize; } /* Hello World */
\`\`\`

## Letter Spacing

\`\`\`css
.spaced {
  letter-spacing: 2px;
}
\`\`\`
          `,
          code_examples: [
            {
              title: 'Professional Typography Styles',
              code: `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

body {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

h1 {
  font-size: 48px;
  font-weight: 700;
  letter-spacing: -1px;
  line-height: 1.2;
}

h2 {
  font-size: 36px;
  font-weight: 600;
  margin-top: 30px;
}

p {
  font-size: 18px;
  line-height: 1.8;
  margin-bottom: 20px;
}

.caption {
  font-size: 14px;
  color: #666;
  font-style: italic;
}

.button-text {
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}`,
              explanation: 'A complete typography system using Google Fonts with proper hierarchy and spacing.'
            }
          ],
          common_mistakes: [
            {
              mistake: 'Using too many different fonts',
              why: 'Makes the design look unprofessional and cluttered',
              fix: 'Stick to 2-3 font families maximum per website'
            },
            {
              mistake: 'Text that\'s too small',
              why: 'Hard to read, especially on mobile',
              fix: 'Body text should be at least 16px'
            },
            {
              mistake: 'Lines of text too long',
              why: 'Hard to track from line to line',
              fix: 'Keep line length to 50-75 characters (use max-width)'
            }
          ],
          resources: [
            {
              title: 'Google Fonts',
              url: 'https://fonts.google.com',
              type: 'tool'
            }
          ],
          tasks: [
            {
              title: 'Style a Blog Article',
              description: 'Create a beautifully styled blog article with proper typography.',
              instructions: `
1. Create an HTML article with h1, h2, and multiple paragraphs
2. Import a Google Font (try Roboto, Open Sans, or Lato)
3. Style the article with:
   - Body font size of 18px and line-height of 1.8
   - H1 at 48px, H2 at 32px
   - Center-aligned title
   - Justified paragraph text
   - A .lead class for intro paragraph (larger, bold)
   - A .caption class for image captions (smaller, gray)
              `,
              starter_code: `<article>
  <h1>Article Title</h1>
  <p class="lead">Introduction paragraph</p>
  <h2>Section Title</h2>
  <p>Regular paragraph</p>
</article>`,
              solution_code: `@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');

body {
  font-family: 'Lato', sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  font-size: 48px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

h2 {
  font-size: 32px;
  font-weight: 700;
  margin-top: 40px;
  color: #34495e;
}

p {
  font-size: 18px;
  line-height: 1.8;
  text-align: justify;
  margin-bottom: 20px;
  color: #555;
}

.lead {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
}

.caption {
  font-size: 14px;
  color: #7f8c8d;
  font-style: italic;
  text-align: center;
}`,
              estimated_time: 45,
              difficulty: 'beginner'
            }
          ]
        },
        // DAY 5
        {
          day_number: 5,
          title: 'The CSS Cascade & Specificity',
          objectives: [
            'Understand how the cascade works',
            'Learn CSS specificity rules',
            'Know which styles take precedence',
            'Use !important (and when not to)',
            'Debug CSS conflicts'
          ],
          duration_mins: 45,
          content: `
# Why is it Called "Cascading"?

CSS stands for **Cascading** Style Sheets. The cascade determines which style wins when multiple rules apply to the same element.

## Three Key Concepts

### 1. Inheritance
Some CSS properties pass down from parent to child:
\`\`\`css
body {
  color: navy; /* All text in body inherits this color */
  font-family: Arial;
}
\`\`\`

**Inherited properties:** color, font-family, line-height
**Not inherited:** border, padding, margin, background

### 2. Specificity
When multiple rules target the same element, specificity determines the winner.

**Specificity Hierarchy (weakest to strongest):**
1. Element selectors: \`p\`, \`div\`, \`h1\`
2. Class selectors: \`.classname\`
3. ID selectors: \`#idname\`
4. Inline styles: \`style="color: red"\`
5. !important flag

**Examples:**
\`\`\`css
p { color: blue; }              /* Specificity: 1 */
.intro { color: green; }        /* Specificity: 10 */
#header { color: red; }         /* Specificity: 100 */
\`\`\`

If a paragraph has both a class and an ID, the ID color wins.

### 3. Source Order
When specificity is equal, the **last rule** wins:
\`\`\`css
p { color: blue; }
p { color: red; }  /* This wins - it's last */
\`\`\`

## The !important Flag

Override everything (use sparingly!):
\`\`\`css
p {
  color: red !important; /* This beats even inline styles */
}
\`\`\`

**When to use:** Almost never. It makes debugging harder.
**Exception:** Overriding third-party CSS you can't edit.

## Combining Selectors

You can increase specificity by combining selectors:
\`\`\`css
div.container p {  /* More specific */
  color: blue;
}

p {  /* Less specific */
  color: red;
}
\`\`\`

## Debugging Specificity

Use browser DevTools (F12) to see which styles apply and why others are crossed out.
          `,
          code_examples: [
            {
              title: 'Specificity in Action',
              code: `/* Lowest specificity */
p {
  color: gray;
}

/* Medium specificity */
.intro {
  color: blue;
}

/* Higher specificity */
#main-content .intro {
  color: green;
}

/* Highest specificity (avoid!) */
p {
  color: red !important;
}

/* HTML */
<div id="main-content">
  <p class="intro">What color am I?</p>
</div>

/* Answer: green (from #main-content .intro) */`,
              explanation: 'Demonstrates how different selector types compete, with higher specificity winning.'
            }
          ],
          common_mistakes: [
            {
              mistake: 'Overusing !important',
              why: 'Makes CSS hard to maintain and override',
              fix: 'Use more specific selectors instead'
            },
            {
              mistake: 'Writing overly specific selectors',
              why: 'Makes it harder to override later',
              fix: 'Keep selectors as simple as possible'
            }
          ],
          resources: [
            {
              title: 'Specificity Calculator',
              url: 'https://specificity.keegan.st',
              type: 'tool'
            }
          ],
          tasks: [
            {
              title: 'Specificity Challenge',
              description: 'Predict and test which styles will apply based on specificity rules.',
              instructions: `
1. Create an HTML element with both a class and an ID
2. Write three CSS rules targeting it differently:
   - One using just the element name
   - One using the class
   - One using the ID
3. Give each rule a different color
4. Predict which color will display
5. Test in browser and verify with DevTools
              `,
              starter_code: `<p id="special" class="highlight">Test paragraph</p>`,
              solution_code: `/* CSS */
p {
  color: blue;  /* Specificity: 1 */
}

.highlight {
  color: green;  /* Specificity: 10 */
}

#special {
  color: red;  /* Specificity: 100 - THIS WINS */
}

/* The paragraph will be red because ID has highest specificity */`,
              estimated_time: 30,
              difficulty: 'beginner'
            }
          ]
        }
      ],
      assignment: {
        title: 'Week 1 Mini-Project: Styled Landing Page',
        description: 'Create a single-page landing page with professional styling using all Week 1 concepts.',
        requirements: [
          'External CSS stylesheet properly linked',
          'Use of classes and at least one ID',
          'Custom color palette with at least 3 colors',
          'Typography with Google Fonts',
          'Different text styles for headings and paragraphs'
        ],
        bonus_tasks: [
          'Create a CSS color palette with HEX, RGB, and RGBA',
          'Use multiple classes on elements for reusable styles'
        ],
        estimated_time: 150,
        success_criteria: [
          'Page looks visually appealing',
          'Text is readable with good contrast',
          'CSS is organized and commented'
        ]
      }
    },


     {
      week_number: 2,
      title: 'Box Model & Layout Fundamentals',
      description: 'Master the CSS Box Model, learn spacing with margin and padding, understand borders, and control element display types.',
      objectives: [
        'Understand the CSS Box Model',
        'Use margin and padding effectively',
        'Style borders and border-radius',
        'Control element display types (block, inline, inline-block)',
        'Calculate element dimensions with box-sizing'
      ],
      lessons: [
        // DAY 6
        {
          day_number: 6,
          title: 'The CSS Box Model',
          objectives: [
            'Understand the four parts of the box model',
            'Visualize how content, padding, border, and margin work',
            'Calculate total element width and height',
            'Use box-sizing property'
          ],
          duration_mins: 50,
          content: `
# The Box Model - Every Element is a Box

Every HTML element is a rectangular box. The CSS Box Model describes the space that box takes up.

## Four Layers of the Box

From inside to outside:

1. **Content** - The actual content (text, images)
2. **Padding** - Space between content and border (inside)
3. **Border** - Line around the padding
4. **Margin** - Space outside the border (between elements)

\`\`\`
┌─────────────── MARGIN ───────────────┐
│  ┌───────────── BORDER ──────────┐   │
│  │  ┌────────── PADDING ──────┐  │   │
│  │  │                          │  │   │
│  │  │       CONTENT            │  │   │
│  │  │                          │  │   │
│  │  └──────────────────────────┘  │   │
│  └─────────────────────────────────┘   │
└────────────────────────────────────────┘
\`\`\`

## Visualizing with DevTools

Press F12 in your browser and hover over an element. You'll see the box model highlighted in different colors!

## Default Box Sizing

By default, width and height only apply to content:

\`\`\`css
.box {
  width: 200px;
  padding: 20px;
  border: 5px solid black;
}
\`\`\`

**Actual width = 200px + 40px (padding) + 10px (border) = 250px!**

## Box-Sizing to the Rescue

\`\`\`css
* {
  box-sizing: border-box;
}
\`\`\`

Now width includes padding and border!

\`\`\`css
.box {
  box-sizing: border-box;
  width: 200px;        /* Total width is exactly 200px */
  padding: 20px;       /* Included in 200px */
  border: 5px solid;   /* Included in 200px */
}
\`\`\`

**Best Practice:** Add \`box-sizing: border-box\` to all elements at the start of your CSS.
          `,
          code_examples: [
            {
              title: 'Box Model Reset',
              code: `/* Apply to all elements - best practice! */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.card {
  width: 300px;
  padding: 30px;
  border: 2px solid #ddd;
  margin: 20px;
  background-color: #f9f9f9;
}

/* Total width is exactly 300px thanks to border-box */`,
              explanation: 'Universal box-sizing reset ensures predictable element sizing across the entire page.'
            }
          ],
          common_mistakes: [
            {
              mistake: 'Not using box-sizing: border-box',
              why: 'Element sizes become unpredictable and hard to calculate',
              fix: 'Add * { box-sizing: border-box; } at the top of your CSS'
            },
            {
              mistake: 'Forgetting margins collapse',
              why: 'Vertical margins between elements merge',
              fix: 'Be aware that 20px margin top + 20px margin bottom = 20px (not 40px)'
            }
          ],
          resources: [
            {
              title: 'MDN: Box Model',
              url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model',
              type: 'documentation'
            }
          ],
          tasks: [
            {
              title: 'Build a Card with Proper Spacing',
              description: 'Create a card element that demonstrates understanding of the box model.',
              instructions: `
1. Create a div with class "card"
2. Set width to 350px with border-box sizing
3. Add 25px padding on all sides
4. Add a 3px solid border
5. Add 20px margin
6. Add background color and text content
7. Use DevTools to inspect the box model
              `,
              estimated_time: 35,
              difficulty: 'beginner'
            }
          ]
        },
        // DAY 7
        {
          day_number: 7,
          title: 'Margin & Padding',
          objectives: [
            'Apply margin and padding to elements',
            'Use shorthand vs longhand syntax',
            'Understand margin collapsing',
            'Center elements with margin auto'
          ],
          duration_mins: 45,
          content: `
# Spacing Elements with Margin and Padding

## Padding (Inside Space)

Padding creates space between content and border.

**Longhand:**
\`\`\`css
.box {
  padding-top: 10px;
  padding-right: 20px;
  padding-bottom: 10px;
  padding-left: 20px;
}
\`\`\`

**Shorthand (all sides):**
\`\`\`css
.box {
  padding: 20px; /* All four sides */
}
\`\`\`

**Shorthand (vertical | horizontal):**
\`\`\`css
.box {
  padding: 10px 20px; /* Top/Bottom = 10px, Left/Right = 20px */
}
\`\`\`

**Shorthand (top | horizontal | bottom):**
\`\`\`css
.box {
  padding: 10px 20px 15px; /* Top=10px, Sides=20px, Bottom=15px */
}
\`\`\`

**Shorthand (all different):**
\`\`\`css
.box {
  padding: 10px 20px 15px 25px; /* Top, Right, Bottom, Left (clockwise!) */
}
\`\`\`

**Memory Trick:** Think of a clock - starts at 12 (top) and goes clockwise!

## Margin (Outside Space)

Margin creates space between elements.

Same syntax as padding:
\`\`\`css
.box {
  margin: 20px;              /* All sides */
  margin: 10px 20px;         /* Vertical | Horizontal */
  margin: 10px 20px 15px;    /* Top | Horizontal | Bottom */
  margin: 10px 20px 15px 25px; /* Top Right Bottom Left */
}
\`\`\`

## Centering with Margin Auto

\`\`\`css
.container {
  width: 800px;
  margin: 0 auto; /* Centers horizontally */
}
\`\`\`

This works for **block** elements with a set width.

## Margin Collapsing

Vertical margins between elements collapse (merge):

\`\`\`css
.box1 {
  margin-bottom: 30px;
}

.box2 {
  margin-top: 20px;
}
/* Gap between boxes is 30px (not 50px!) */
\`\`\`

The **larger margin wins**.

## Negative Margin

You can use negative values to overlap elements:
\`\`\`css
.overlap {
  margin-top: -20px; /* Moves element up */
}
\`\`\`
          `,
          code_examples: [
            {
              title: 'Spacing Patterns',
              code: `/* Container with centered content */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Card with even spacing */
.card {
  padding: 30px;
  margin-bottom: 20px;
}

/* Button with custom spacing */
.button {
  padding: 12px 24px; /* More horizontal than vertical */
  margin: 10px;
}

/* Section spacing */
section {
  margin: 60px 0; /* Vertical spacing between sections */
  padding: 40px 20px;
}`,
              explanation: 'Common spacing patterns for containers, cards, buttons, and sections.'
            }
          ],
          common_mistakes: [
            {
              mistake: 'Confusing margin and padding',
              why: 'Leads to unexpected spacing',
              fix: 'Remember: padding is inside (affects background), margin is outside (transparent)'
            },
            {
              mistake: 'Using margin on inline elements',
              why: 'Vertical margin doesn\'t work on inline elements',
              fix: 'Change to inline-block or block display'
            }
          ],
          resources: [],
          tasks: [
            {
              title: 'Create a Spaced Layout',
              description: 'Build a page section with proper spacing between elements.',
              instructions: `
1. Create a container div, center it with margin auto
2. Add 3 card divs inside with padding
3. Space cards apart with margin-bottom
4. Add a button with padding for click area
5. Experiment with negative margin on one card
              `,
              estimated_time: 40,
              difficulty: 'beginner'
            }
          ]
        },

        {
    day_number: 8,
    title: 'Borders & Border Radius',
    objectives: [
      'Apply borders to elements',
      'Use border-radius for rounded corners',
      'Create circles and complex shapes',
      'Style individual border sides',
      'Combine borders with box-shadow'
    ],
    duration_mins: 45,
    content: `
# Styling Borders

Borders add visual definition to elements.

## Basic Border Syntax

\`\`\`css
.box {
  border: 2px solid black;
  /* width | style | color */
}
\`\`\`

## Border Styles

\`\`\`css
.solid { border-style: solid; }
.dashed { border-style: dashed; }
.dotted { border-style: dotted; }
.double { border-style: double; }
.groove { border-style: groove; }
\`\`\`

## Individual Sides

\`\`\`css
.card {
  border-top: 3px solid blue;
  border-bottom: 1px solid gray;
  border-left: none;
  border-right: none;
}
\`\`\`

## Border Radius (Rounded Corners)

\`\`\`css
.rounded {
  border-radius: 10px; /* All corners */
}

.different-corners {
  border-radius: 10px 20px 30px 40px;
  /* top-left, top-right, bottom-right, bottom-left */
}

.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%; /* Perfect circle */
}

.pill {
  border-radius: 25px; /* Pill shape */
}
\`\`\`

## Box Shadow

Add depth with shadows:
\`\`\`css
.card {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  /* x-offset y-offset blur color */
}

.elevated {
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.multiple-shadows {
  box-shadow: 
    0 2px 4px rgba(0,0,0,0.1),
    0 4px 8px rgba(0,0,0,0.1);
}
\`\`\`
    `,
    code_examples: [
      {
        title: 'Card with Borders and Shadow',
        code: `.card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s;
}

.card:hover {
  box-shadow: 0 8px 12px rgba(0,0,0,0.15);
}

.profile-pic {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #3498db;
}`,
        explanation: 'Professional card styling with smooth hover effects and a circular profile picture.'
      }
    ],
    common_mistakes: [
      {
        mistake: 'Forgetting border-style',
        why: 'Border won\'t show without a style',
        fix: 'Always specify: border: 2px solid black;'
      }
    ],
    resources: [
       {
              title: 'MDN: Box Model',
              url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model',
              type: 'documentation'
            }
    ],
    tasks: [
      {
        title: 'Create Profile Cards',
        description: 'Build profile cards with borders, rounded corners, and shadows.',
        instructions: `
1. Create 3 profile card divs
2. Add border-radius for rounded corners
3. Add subtle box-shadow
4. Create a circular profile image area
5. Add hover effect that increases shadow
        `,
        estimated_time: 40,
        difficulty: 'beginner'
      }
    ]
  },
  // DAY 9
  {
    day_number: 9,
    title: 'Display Property & Element Types',
    objectives: [
      'Understand block vs inline elements',
      'Use display: inline-block',
      'Hide elements with display: none',
      'Control element visibility',
      'Know when to use each display type'
    ],
    duration_mins: 50,
    content: `
# Display Types

Every HTML element has a default display type.

## Block Elements

Take up full width, stack vertically:
- \`<div>\`, \`<p>\`, \`<h1>\`, \`<section>\`

\`\`\`css
.block-element {
  display: block;
  /* Takes full width */
  /* Starts on new line */
}
\`\`\`

## Inline Elements

Flow with text, only take needed width:
- \`<span>\`, \`<a>\`, \`<strong>\`, \`<em>\`

\`\`\`css
.inline-element {
  display: inline;
  /* Cannot set width/height */
  /* No top/bottom margin */
}
\`\`\`

## Inline-Block (Best of Both)

\`\`\`css
.inline-block {
  display: inline-block;
  /* Flows inline BUT */
  /* Can set width/height */
  /* Can set all margins */
}
\`\`\`

Perfect for: Navigation buttons, image galleries

## Hiding Elements

\`\`\`css
.hidden {
  display: none; /* Completely removed from flow */
}

.invisible {
  visibility: hidden; /* Hidden but still takes space */
}

.transparent {
  opacity: 0; /* Invisible but still takes space and is clickable */
}
\`\`\`
    `,
    code_examples: [
      {
        title: 'Navigation Menu with Display',
        code: `.nav {
  background: #333;
  padding: 0;
}

.nav-item {
  display: inline-block;
  padding: 15px 20px;
  color: white;
  text-decoration: none;
}

.nav-item:hover {
  background: #555;
}`,
        explanation: 'Horizontal navigation using inline-block for proper spacing control.'
      }
    ],
    common_mistakes: [
      {
        mistake: 'Trying to set width on inline elements',
        why: 'Inline elements ignore width/height',
        fix: 'Use display: inline-block or display: block'
      }
    ],
    resources: [
       {
              title: 'MDN: Box Model',
              url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model',
              type: 'documentation'
            }
    ],
    tasks: [
      {
        title: 'Build a Navigation Bar',
        description: 'Create a horizontal navigation bar using inline-block.',
        instructions: `
1. Create a nav element with multiple links
2. Style links as inline-block
3. Add padding and hover effects
4. Create a toggle to hide/show with display: none
        `,
        estimated_time: 45,
        difficulty: 'beginner'
      }
    ]
  },
  // DAY 10
  {
    day_number: 10,
    title: 'Width, Height & Sizing',
    objectives: [
      'Set element dimensions',
      'Use different sizing units',
      'Apply max-width and min-width',
      'Create responsive sizing',
      'Understand percentage-based sizing'
    ],
    duration_mins: 45,
    content: `
# Controlling Element Size

## Fixed Sizing

\`\`\`css
.fixed {
  width: 300px;
  height: 200px;
}
\`\`\`

## Percentage Sizing

Relative to parent container:
\`\`\`css
.half-width {
  width: 50%; /* 50% of parent */
}
\`\`\`

## Viewport Units

Relative to browser window:
\`\`\`css
.full-screen {
  width: 100vw;  /* 100% of viewport width */
  height: 100vh; /* 100% of viewport height */
}

.half-screen {
  height: 50vh;
}
\`\`\`

## Max & Min Width

\`\`\`css
.container {
  width: 100%;
  max-width: 1200px; /* Never wider than 1200px */
  min-width: 300px;  /* Never narrower than 300px */
  margin: 0 auto;    /* Center it */
}
\`\`\`

## Responsive Images

\`\`\`css
img {
  max-width: 100%;
  height: auto; /* Maintains aspect ratio */
}
\`\`\`
    `,
    code_examples: [
      {
        title: 'Responsive Container Pattern',
        code: `.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.card {
  width: 100%;
  max-width: 400px;
  height: auto;
  min-height: 200px;
}

.hero {
  width: 100%;
  height: 60vh;
  min-height: 400px;
}`,
        explanation: 'Flexible sizing that works across all screen sizes.'
      }
    ],
    common_mistakes: [
      {
        mistake: 'Setting fixed heights on text content',
        why: 'Text might overflow or get cut off',
        fix: 'Use min-height instead of height'
      }
    ],
    resources: [
       {
              title: 'MDN: Box Model',
              url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model',
              type: 'documentation'
            }
    ],
    tasks: [
      {
        title: 'Create a Responsive Layout',
        description: 'Build a page with responsive sizing.',
        instructions: `
1. Create a container with max-width
2. Add a hero section with viewport height
3. Create cards with percentage widths
4. Make all images responsive
        `,
        estimated_time: 50,
        difficulty: 'beginner'
      }
    ]
  }



        // Continue with remaining lessons...
      ],
      assignment: {
        title: 'Week 2 Mini-Project: Profile Card',
        description: 'Create a styled profile card demonstrating mastery of the box model.',
        requirements: [
          'Proper use of padding and margin',
          'Border and border-radius styling',
          'Centered layout with margin auto',
          'Box-sizing: border-box applied'
        ],
        bonus_tasks: ['Add shadow effects', 'Create hover states'],
        estimated_time: 120,
        success_criteria: ['Card is properly spaced and centered', 'All spacing is intentional']
      }
    },

    {
      week_number: 3,
      title: 'Flexbox - Modern Layout System',
  description: 'Master Flexbox, the modern way to create flexible, responsive layouts with ease. Learn to align, distribute, and organize elements efficiently.',
  objectives: [
    'Understand Flexbox concepts and terminology',
    'Create flexible layouts with flex containers',
    'Align and distribute items along main and cross axes',
    'Control item sizing with flex-grow, flex-shrink, flex-basis',
    'Build common UI patterns with Flexbox'
  ],
      lessons: [
        // Lessons for Week 3 would go here

        // DAY 11
    {
      day_number: 11,
      title: 'Introduction to Flexbox',
      objectives: [
        'Understand what Flexbox is and when to use it',
        'Learn Flexbox terminology (container, items, axes)',
        'Create your first flex container',
        'Understand flex-direction',
        'Switch between row and column layouts'
      ],
      duration_mins: 50,
      content: `
# Welcome to Flexbox!

Flexbox (Flexible Box Layout) is a modern CSS layout system that makes creating flexible, responsive layouts much easier than older methods.

## Why Flexbox?

**Before Flexbox:**
- Vertical centering was hard
- Equal-height columns required hacks
- Responsive layouts needed complex calculations

**With Flexbox:**
- ✅ Easy vertical and horizontal centering
- ✅ Flexible, responsive layouts
- ✅ Items automatically adjust to available space

## Flexbox Terminology

**Flex Container:** The parent element with \`display: flex\`
**Flex Items:** The direct children of the flex container
**Main Axis:** Primary direction (default: horizontal)
**Cross Axis:** Perpendicular to main axis (default: vertical)

\`\`\`
Main Axis (flex-direction: row) →
┌─────────────────────────────────┐
│ ┌─────┐ ┌─────┐ ┌─────┐         │ ↕ Cross Axis
│ │Item1│ │Item2│ │Item3│         │
│ └─────┘ └─────┘ └─────┘         │
└─────────────────────────────────┘
\`\`\`

## Creating a Flex Container

\`\`\`css
.container {
  display: flex; /* That's it! Children become flex items */
}
\`\`\`

\`\`\`html
<div class="container">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
\`\`\`

Items now sit side by side (default behavior).

## Flex Direction

Controls the main axis direction:

\`\`\`css
.row {
  display: flex;
  flex-direction: row; /* Default: left to right → */
}

.row-reverse {
  display: flex;
  flex-direction: row-reverse; /* Right to left ← */
}

.column {
  display: flex;
  flex-direction: column; /* Top to bottom ↓ */
}

.column-reverse {
  display: flex;
  flex-direction: column-reverse; /* Bottom to top ↑ */
}
\`\`\`

**Most common:** \`row\` (horizontal) and \`column\` (vertical)

## Your First Flexbox Layout

\`\`\`css
.nav {
  display: flex;
  flex-direction: row;
  background-color: #2c3e50;
  padding: 10px;
}

.nav-item {
  padding: 10px 20px;
  color: white;
  text-decoration: none;
}
\`\`\`

Items automatically sit next to each other!
      `,
      code_examples: [
        {
          title: 'Flex Direction Examples',
          code: `/* Horizontal navigation */
.nav {
  display: flex;
  flex-direction: row;
  background-color: #34495e;
  padding: 15px;
}

.nav a {
  padding: 10px 20px;
  color: white;
  text-decoration: none;
}

/* Vertical sidebar menu */
.sidebar {
  display: flex;
  flex-direction: column;
  width: 200px;
  background-color: #2c3e50;
  padding: 20px;
}

.sidebar a {
  padding: 15px;
  color: white;
  text-decoration: none;
  margin-bottom: 10px;
}

/* Card layout */
.card-container {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.card {
  width: 250px;
  padding: 20px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
}`,
          explanation: 'Common patterns using flex-direction for navigation, sidebars, and card layouts.'
        }
      ],
      common_mistakes: [
        {
          mistake: 'Applying flex properties to items instead of container',
          why: 'display: flex must be on the parent, not children',
          fix: 'Put display: flex on the container that wraps the items'
        },
        {
          mistake: 'Forgetting that only direct children become flex items',
          why: 'Grandchildren don\'t become flex items automatically',
          fix: 'Apply display: flex to each level that needs flexible layout'
        }
      ],
      resources: [
        {
          title: 'Flexbox Froggy Game',
          url: 'https://flexboxfroggy.com',
          type: 'interactive'
        },
        {
          title: 'CSS Tricks: Flexbox Guide',
          url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox',
          type: 'reference'
        }
      ],
      tasks: [
        {
          title: 'Build Horizontal and Vertical Layouts',
          description: 'Create both horizontal navigation and vertical sidebar using Flexbox.',
          instructions: `
1. Create a horizontal navigation bar using display: flex
2. Add 5 navigation links that sit side by side
3. Create a vertical sidebar menu with flex-direction: column
4. Add 5 menu items that stack vertically
5. Style both with colors, padding, and hover effects
          `,
          starter_code: `<nav class="horizontal-nav">
  <a href="#">Home</a>
  <a href="#">About</a>
  <a href="#">Services</a>
</nav>

<aside class="vertical-sidebar">
  <a href="#">Dashboard</a>
  <a href="#">Profile</a>
  <a href="#">Settings</a>
</aside>`,
          solution_code: `/* Horizontal Navigation */
.horizontal-nav {
  display: flex;
  flex-direction: row;
  background-color: #2c3e50;
  padding: 15px 30px;
}

.horizontal-nav a {
  padding: 12px 24px;
  color: white;
  text-decoration: none;
  margin-right: 10px;
  border-radius: 5px;
  transition: background 0.3s;
}

.horizontal-nav a:hover {
  background-color: #34495e;
}

/* Vertical Sidebar */
.vertical-sidebar {
  display: flex;
  flex-direction: column;
  width: 220px;
  background-color: #34495e;
  padding: 20px;
  min-height: 100vh;
}

.vertical-sidebar a {
  padding: 15px 20px;
  color: white;
  text-decoration: none;
  margin-bottom: 10px;
  border-radius: 5px;
  transition: background 0.3s;
}

.vertical-sidebar a:hover {
  background-color: #2c3e50;
}`,
          estimated_time: 40,
          difficulty: 'beginner'
        }
      ]
    },

    // DAY 12
    {
      day_number: 12,
      title: 'Justify-Content & Align-Items',
      objectives: [
        'Distribute items along the main axis with justify-content',
        'Align items along the cross axis with align-items',
        'Center elements horizontally and vertically',
        'Create space between and around flex items',
        'Build professional layouts with proper alignment'
      ],
      duration_mins: 50,
      content: `
# Aligning and Distributing Flex Items

Two powerful properties control spacing and alignment in Flexbox.

## Justify-Content (Main Axis)

Controls how items are distributed along the **main axis** (horizontal by default).

\`\`\`css
.container {
  display: flex;
  justify-content: flex-start; /* Default */
}
\`\`\`

### Values:

**flex-start** - Items at the start (left)
\`\`\`
┌──────────────────────┐
│ [1][2][3]            │
└──────────────────────┘
\`\`\`

**flex-end** - Items at the end (right)
\`\`\`
┌──────────────────────┐
│            [1][2][3] │
└──────────────────────┘
\`\`\`

**center** - Items in the center
\`\`\`
┌──────────────────────┐
│      [1][2][3]       │
└──────────────────────┘
\`\`\`

**space-between** - Even space between items
\`\`\`
┌──────────────────────┐
│ [1]     [2]     [3]  │
└──────────────────────┘
\`\`\`

**space-around** - Even space around items
\`\`\`
┌──────────────────────┐
│  [1]   [2]   [3]     │
└──────────────────────┘
\`\`\`

**space-evenly** - Perfectly even space
\`\`\`
┌──────────────────────┐
│   [1]   [2]   [3]    │
└──────────────────────┘
\`\`\`

## Align-Items (Cross Axis)

Controls how items are aligned along the **cross axis** (vertical by default).

\`\`\`css
.container {
  display: flex;
  align-items: stretch; /* Default */
}
\`\`\`

### Values:

**stretch** - Items stretch to fill container (default)
**flex-start** - Items at top
**flex-end** - Items at bottom
**center** - Items in middle
**baseline** - Items aligned by text baseline

## Perfect Centering!

The holy grail of CSS - center anything:

\`\`\`css
.center-everything {
  display: flex;
  justify-content: center; /* Horizontal center */
  align-items: center; /* Vertical center */
  height: 100vh;
}
\`\`\`

## Practical Examples

**Navigation with logo and links:**
\`\`\`css
.nav {
  display: flex;
  justify-content: space-between; /* Logo left, links right */
  align-items: center; /* Vertically centered */
  padding: 20px;
}
\`\`\`

**Card grid:**
\`\`\`css
.card-grid {
  display: flex;
  justify-content: space-evenly; /* Even spacing */
  align-items: flex-start; /* Align to top */
}
\`\`\`

**Button group:**
\`\`\`css
.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
}
\`\`\`
      `,
      code_examples: [
        {
          title: 'Alignment Patterns',
          code: `/* Centered hero section */
.hero {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #3498db;
  color: white;
}

/* Header with logo and nav */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background-color: #2c3e50;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.nav-links {
  display: flex;
  gap: 20px;
}

/* Card container */
.cards {
  display: flex;
  justify-content: space-evenly;
  align-items: stretch;
  padding: 40px;
  gap: 20px;
}

.card {
  width: 300px;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

/* Footer with centered content */
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background-color: #34495e;
  color: white;
}`,
          explanation: 'Common layout patterns using justify-content and align-items for headers, heroes, cards, and footers.'
        }
      ],
      common_mistakes: [
        {
          mistake: 'Confusing justify-content and align-items',
          why: 'justify-content is for main axis, align-items is for cross axis',
          fix: 'Remember: justify = main axis (horizontal by default), align = cross axis (vertical by default)'
        },
        {
          mistake: 'Using space-between with only one item',
          why: 'space-between needs multiple items to work',
          fix: 'Use justify-content: center or flex-start for single items'
        }
      ],
      resources: [
        {
          title: 'Flexbox Playground',
          url: 'https://codepen.io/enxaneta/full/adLPwv',
          type: 'interactive'
        }
      ],
      tasks: [
        {
          title: 'Build a Modern Header',
          description: 'Create a website header with logo on left, navigation links on right, all vertically centered.',
          instructions: `
1. Create a header container with display: flex
2. Add a logo div on the left
3. Add a nav with 4 links on the right
4. Use justify-content: space-between to push them apart
5. Use align-items: center for vertical alignment
6. Add styling, colors, and hover effects
          `,
          starter_code: `<header class="header">
  <div class="logo">MyBrand</div>
  <nav class="nav-links">
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Services</a>
    <a href="#">Contact</a>
  </nav>
</header>`,
          solution_code: `/* CSS */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 50px;
  background-color: #2c3e50;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.logo {
  font-size: 28px;
  font-weight: bold;
  color: #3498db;
  letter-spacing: 1px;
}

.nav-links {
  display: flex;
  gap: 30px;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 5px;
  transition: background 0.3s, color 0.3s;
}

.nav-links a:hover {
  background-color: #3498db;
  color: white;
}`,
          estimated_time: 35,
          difficulty: 'beginner'
        }
      ]
    },

    // DAY 13
    {
      day_number: 13,
      title: 'Flex-Wrap & Gap',
      objectives: [
        'Allow flex items to wrap with flex-wrap',
        'Create responsive layouts that adapt to screen size',
        'Use gap property for clean spacing',
        'Understand flex-flow shorthand',
        'Build responsive card grids'
      ],
      duration_mins: 45,
      content: `
# Wrapping and Spacing Flex Items

## Flex-Wrap

By default, flex items stay on one line. \`flex-wrap\` allows them to wrap to new lines.

\`\`\`css
.container {
  display: flex;
  flex-wrap: nowrap; /* Default - all items on one line */
}
\`\`\`

### Values:

**nowrap** (default) - All items forced onto one line
\`\`\`
┌────────────────────────┐
│ [1][2][3][4][5][6]     │
└────────────────────────┘
\`\`\`

**wrap** - Items wrap to new lines as needed
\`\`\`
┌────────────────────────┐
│ [1][2][3]              │
│ [4][5][6]              │
└────────────────────────┘
\`\`\`

**wrap-reverse** - Items wrap to new lines in reverse
\`\`\`
┌────────────────────────┐
│ [4][5][6]              │
│ [1][2][3]              │
└────────────────────────┘
\`\`\`

## Responsive Card Grid

Perfect for responsive layouts:

\`\`\`css
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  width: 300px; /* Fixed width */
  /* Cards automatically wrap when container is too narrow */
}
\`\`\`

## Gap Property

Modern way to add spacing between flex items (no margin needed!):

\`\`\`css
.container {
  display: flex;
  gap: 20px; /* 20px space between all items */
}

.container-2 {
  display: flex;
  gap: 20px 40px; /* 20px vertical, 40px horizontal */
}
\`\`\`

**Before gap (old way):**
\`\`\`css
.item {
  margin-right: 20px;
}

.item:last-child {
  margin-right: 0; /* Remove margin from last item */
}
\`\`\`

**With gap (modern way):**
\`\`\`css
.container {
  display: flex;
  gap: 20px; /* Much cleaner! */
}
\`\`\`

## Flex-Flow Shorthand

Combine flex-direction and flex-wrap:

\`\`\`css
.container {
  display: flex;
  flex-flow: row wrap;
  /* Same as:
     flex-direction: row;
     flex-wrap: wrap;
  */
}
\`\`\`

## Responsive Gallery Example

\`\`\`css
.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 20px;
}

.photo {
  width: 250px;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
}

/* Photos automatically wrap on smaller screens! */
\`\`\`
      `,
      code_examples: [
        {
          title: 'Responsive Layouts with Wrap',
          code: `/* Responsive card grid */
.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  padding: 40px;
  justify-content: center;
}

.product-card {
  width: 280px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

/* Tag list */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  padding: 6px 16px;
  background-color: #3498db;
  color: white;
  border-radius: 20px;
  font-size: 14px;
}

/* Image gallery */
.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 20px;
}

.gallery-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s;
}

.gallery-image:hover {
  transform: scale(1.05);
}`,
          explanation: 'Real-world responsive layouts using flex-wrap and gap for products, tags, and image galleries.'
        }
      ],
      common_mistakes: [
        {
          mistake: 'Using margin instead of gap',
          why: 'Margins can cause spacing issues at edges and require :last-child fixes',
          fix: 'Use gap property for cleaner, more maintainable spacing'
        },
        {
          mistake: 'Not setting width on flex items with wrap',
          why: 'Without width, items won\'t wrap predictably',
          fix: 'Set explicit width or min-width on flex items when using flex-wrap'
        }
      ],
      resources: [
        {
          title: 'Can I Use: Gap',
          url: 'https://caniuse.com/flexbox-gap',
          type: 'reference'
        }
      ],
      tasks: [
        {
          title: 'Build a Responsive Product Grid',
          description: 'Create a product grid that automatically wraps on smaller screens.',
          instructions: `
1. Create a container with display: flex and flex-wrap: wrap
2. Add 6-8 product cards with fixed width (250-300px)
3. Use gap property for spacing (20px)
4. Each card should have image, title, price
5. Add hover effects
6. Test by resizing browser - cards should wrap automatically
          `,
          starter_code: `<div class="product-grid">
  <div class="product-card">
    <img src="product1.jpg" alt="Product">
    <h3>Product Name</h3>
    <p class="price">$29.99</p>
  </div>
  <!-- Repeat for more products -->
</div>`,
          solution_code: `/* CSS */
.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  padding: 40px;
  justify-content: center;
  background-color: #f8f9fa;
}

.product-card {
  width: 280px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}

.product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-card h3 {
  padding: 15px 20px 5px;
  font-size: 18px;
  color: #2c3e50;
}

.product-card .price {
  padding: 0 20px 20px;
  font-size: 24px;
  font-weight: bold;
  color: #3498db;
}`,
          estimated_time: 45,
          difficulty: 'beginner'
        }
      ]
    },

      ]
    },

     {
  week_number: 4,
  title: 'CSS Grid, Positioning & Responsive Design',
  description: 'Master CSS Grid for complex 2D layouts, learn CSS positioning, and create responsive designs that work perfectly on all devices.',
  objectives: [
    'Build 2D layouts with CSS Grid',
    'Use grid template areas for intuitive layouts',
    'Master CSS positioning (relative, absolute, fixed, sticky)',
    'Create responsive layouts with media queries',
    'Implement mobile-first design principles'
  ],
  lessons: [
    // DAY 16: CSS GRID BASICS
    {
      day_number: 16,
      title: 'Introduction to CSS Grid',
      objectives: [
        'Understand what CSS Grid is and when to use it',
        'Create a grid container and grid items',
        'Define columns and rows with grid-template',
        'Use fr units for flexible track sizing',
        'Build your first grid layout'
      ],
      duration_mins: 50,
      content: `
# Welcome to CSS Grid!

CSS Grid is a powerful 2D layout system. While Flexbox is one-dimensional (row OR column), Grid handles both dimensions at once.



## Flexbox vs Grid

**Flexbox:** Best for one-dimensional layouts (navigation, card rows)
**Grid:** Best for two-dimensional layouts (page layouts, photo galleries)

## Creating a Grid

\`\`\`css
.container {
  display: grid; /* Creates grid container */
}
\`\`\`

## Grid Template Columns

Define column structure:

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: 200px 200px 200px; /* 3 columns, each 200px */
}
\`\`\`



## The FR Unit (Fractional Unit)

Represents a fraction of available space:

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* 3 equal columns */
}
\`\`\`

Mixed units:
\`\`\`css
.grid {
  display: grid;
  grid-template-columns: 200px 1fr 1fr;
  /* First column fixed 200px, remaining space split equally */
}
\`\`\`

## Grid Template Rows

Same syntax for rows:

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 100px 200px; /* First row 100px, second 200px */
}
\`\`\`

## Gap (Gutters)

Space between grid items:

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px; /* 20px gap between all items */
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 40px; /* row-gap | column-gap */
}
\`\`\`

## Repeat Function

Avoid repetition:

\`\`\`css
/* Instead of: 1fr 1fr 1fr 1fr 1fr */
.grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 equal columns */
}

.mixed {
  display: grid;
  grid-template-columns: 200px repeat(3, 1fr);
  /* Fixed 200px, then 3 flexible columns */
}
\`\`\`

## Your First Grid Layout

\`\`\`css
.photo-gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.photo {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
\`\`\`
      `,
      code_examples: [
        {
          title: 'Basic Grid Layouts',
          code: `/* Simple 3-column grid */
.grid-simple {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
}

.grid-item {
  background-color: #3498db;
  color: white;
  padding: 40px;
  text-align: center;
  border-radius: 8px;
}

/* Sidebar layout */
.grid-sidebar {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 30px;
  min-height: 100vh;
}

.sidebar {
  background-color: #2c3e50;
  padding: 20px;
  color: white;
}

.main {
  background-color: #ecf0f1;
  padding: 30px;
}

/* Photo gallery */
.gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  padding: 20px;
}

.gallery img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

/* Card grid with different sizes */
.card-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 200px 200px;
  gap: 20px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}`,
          explanation: 'Common Grid layouts including galleries, sidebars, and card grids with various column configurations.'
        }
      ],
      common_mistakes: [
        {
          mistake: 'Using Grid for simple one-dimensional layouts',
          why: 'Flexbox is simpler and more appropriate',
          fix: 'Use Grid for 2D layouts, Flexbox for 1D rows or columns'
        },
        {
          mistake: 'Not understanding fr units',
          why: 'Makes layouts unpredictable',
          fix: 'Remember: 1fr means "1 fraction of available space"'
        }
      ],
      resources: [
        {
          title: 'Grid Garden Game',
          url: 'https://cssgridgarden.com',
          type: 'interactive'
        },
        {
          title: 'CSS Tricks: Grid Guide',
          url: 'https://css-tricks.com/snippets/css/complete-guide-grid',
          type: 'reference'
        }
      ],
      tasks: [
        {
          title: 'Build a Photo Gallery',
          description: 'Create a responsive photo gallery using CSS Grid.',
          instructions: `
1. Create a grid container with 4 columns
2. Use 1fr units for equal-width columns
3. Add 15px gap between items
4. Add 8-12 image placeholders
5. Make images fill their containers with proper sizing
6. Add border-radius for rounded corners
          `,
          starter_code: `<div class="gallery">
  <img src="photo1.jpg" alt="Photo 1">
  <img src="photo2.jpg" alt="Photo 2">
  </div>`,
          solution_code: `/* CSS */
.gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  padding: 30px;
  background-color: #f8f9fa;
}

.gallery img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.gallery img:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}`,
          estimated_time: 40,
          difficulty: 'beginner'
        }
      ]
    },

    // DAY 17: GRID AREAS
    {
      day_number: 17,
      title: 'Grid Template Areas & Spanning',
      objectives: [
        'Use grid-template-areas for intuitive layouts',
        'Make items span multiple columns with grid-column',
        'Make items span multiple rows with grid-row',
        'Create complex page layouts visually',
        'Build newspaper-style layouts'
      ],
      duration_mins: 50,
      content: `
# Advanced Grid Techniques

## Grid Template Areas

Name areas of your grid for intuitive layouts:



\`\`\`css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"
    "sidebar content ads"
    "footer footer footer";
  min-height: 100vh;
  gap: 20px;
}

header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.ads { grid-area: ads; }
footer { grid-area: footer; }
\`\`\`

Visual result:
\`\`\`
┌─────────────────────────┐
│        header           │
├────────┬────────┬───────┤
│sidebar │content │  ads  │
│        │        │       │
├────────┴────────┴───────┤
│        footer           │
└─────────────────────────┘
\`\`\`

Clean and readable!

## Grid Column Span

Make items span multiple columns:

\`\`\`css
.item-1 {
  grid-column: 1 / 3; /* Start at line 1, end at line 3 (spans 2 columns) */
}

.item-2 {
  grid-column: span 2; /* Span 2 columns from current position */
}

.item-3 {
  grid-column: 1 / -1; /* Start at 1, end at last line (full width) */
}
\`\`\`

## Grid Row Span

Make items span multiple rows:

\`\`\`css
.tall-item {
  grid-row: 1 / 3; /* Spans rows 1 and 2 */
}

.taller-item {
  grid-row: span 3; /* Spans 3 rows */
}
\`\`\`

## Combined Spanning

\`\`\`css
.feature-card {
  grid-column: span 2; /* 2 columns wide */
  grid-row: span 2; /* 2 rows tall */
}
\`\`\`

## Magazine Layout Example

\`\`\`css
.magazine {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 200px);
  gap: 15px;
}

.featured {
  grid-column: span 2;
  grid-row: span 2;
}

.small {
  grid-column: span 1;
  grid-row: span 1;
}
\`\`\`

## Empty Cells

Use \`.\` for empty cells in grid-template-areas:

\`\`\`css
.layout {
  grid-template-areas:
    "header header header"
    "sidebar content ."
    "footer footer footer";
}
/* The "." leaves that cell empty */
\`\`\`
      `,
      code_examples: [
        {
          title: 'Complex Grid Layouts',
          code: `/* Complete page layout with areas */
.page-layout {
  display: grid;
  grid-template-columns: 250px 1fr 200px;
  grid-template-rows: 80px 1fr 60px;
  grid-template-areas:
    "header header header"
    "sidebar main ads"
    "footer footer footer";
  min-height: 100vh;
  gap: 0;
}

header {
  grid-area: header;
  background-color: #2c3e50;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 40px;
}

.sidebar {
  grid-area: sidebar;
  background-color: #34495e;
  padding: 20px;
  color: white;
}

.main {
  grid-area: main;
  background-color: #ecf0f1;
  padding: 30px;
}

.ads {
  grid-area: ads;
  background-color: #95a5a6;
  padding: 20px;
}

footer {
  grid-area: footer;
  background-color: #2c3e50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Magazine-style grid */
.magazine-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 200px;
  gap: 15px;
  padding: 20px;
}

.article {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.article.featured {
  grid-column: span 2;
  grid-row: span 2;
}

.article.large {
  grid-column: span 2;
}

.article.tall {
  grid-row: span 2;
}`,
          explanation: 'Advanced layouts using grid-template-areas and spanning for page layouts and magazine-style grids.'
        }
      ],
      common_mistakes: [
        {
          mistake: 'Misspelling grid area names',
          why: 'CSS is case-sensitive and typos break the layout',
          fix: 'Use consistent, simple names and double-check spelling'
        },
        {
          mistake: 'Not matching quotes in grid-template-areas',
          why: 'Each row must be a separate quoted string',
          fix: 'Ensure each row is in quotes: "header header" not header header'
        }
      ],
      resources: [
        {
          title: 'Grid by Example',
          url: 'https://gridbyexample.com',
          type: 'examples'
        }
      ],
      tasks: [
        {
          title: 'Build a Magazine Layout',
          description: 'Create a magazine-style grid with featured and regular articles.',
          instructions: `
1. Create a grid with 4 columns and auto rows
2. Add 8 article cards
3. Make one article span 2 columns and 2 rows (featured)
4. Make two articles span 2 columns (large)
5. Make one article span 2 rows (tall)
6. Add 15px gaps and proper styling
          `,
          starter_code: `<div class="magazine">
  <article class="featured">Featured</article>
  <article class="large">Large</article>
  <article>Regular</article>
  </div>`,
          solution_code: `/* CSS */
.magazine {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 200px;
  gap: 15px;
  padding: 30px;
  background-color: #f8f9fa;
}

article {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s;
}

article:hover {
  transform: translateY(-5px);
}

.featured {
  grid-column: span 2;
  grid-row: span 2;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.large {
  grid-column: span 2;
  background-color: #3498db;
  color: white;
}

.tall {
  grid-row: span 2;
  background-color: #2ecc71;
  color: white;
}`,
          estimated_time: 45,
          difficulty: 'intermediate'
        }
      ]
    },

    // DAY 18: POSITIONING
    {
      day_number: 18,
      title: 'CSS Positioning',
      objectives: [
        'Understand the 5 position types',
        'Use relative positioning for small adjustments',
        'Master absolute positioning within containers',
        'Create fixed navigation bars',
        'Build sticky headers and sidebars'
      ],
      duration_mins: 50,
      content: `
# CSS Positioning

The \`position\` property changes how elements are placed in the document flow.



## Position: Static (Default)

Normal document flow. Top, right, bottom, left have no effect.

\`\`\`css
.static {
  position: static; /* Default, rarely written */
}
\`\`\`

## Position: Relative

Positioned relative to its normal position. Stays in document flow.

\`\`\`css
.relative {
  position: relative;
  top: 20px; /* Moves 20px down from normal position */
  left: 30px; /* Moves 30px right from normal position */
}
\`\`\`

**Use cases:**
- Small positioning adjustments
- Creating a positioning context for absolute children

## Position: Absolute

Removed from document flow. Positioned relative to nearest positioned ancestor.

\`\`\`css
.container {
  position: relative; /* Creates positioning context */
}

.absolute {
  position: absolute;
  top: 0;
  right: 0; /* Positioned at top-right of container */
}
\`\`\`

**Key point:** "Positioned ancestor" means any parent with \`position: relative\` (or anything other than static).
      `,
      code_examples: [],
      common_mistakes: [],
      resources: [],
      tasks: []
    },

    // DAY 19: RESPONSIVE DESIGN & MEDIA QUERIES
    {
      day_number: 19,
      title: 'Responsive Design & Media Queries',
      objectives: [
        'Understand logical breakpoints',
        'Use max-width and min-width queries',
        'Implement responsive typography',
        'Hide and show elements based on device size'
      ],
      duration_mins: 50,
      content: `
# Responsive Design



Responsive design ensures your site looks good on all devices.

## Media Queries

\`\`\`css
/* Show only on mobile */
.mobile-only {
  display: block;
}

@media (min-width: 768px) {
  .mobile-only {
    display: none;
  }
}
\`\`\`

## Responsive Typography

\`\`\`css
/* Mobile */
h1 {
  font-size: 28px;
}

p {
  font-size: 16px;
  line-height: 1.6;
}

/* Desktop */
@media (min-width: 1024px) {
  h1 {
    font-size: 48px;
  }
  
  p {
    font-size: 18px;
    line-height: 1.8;
  }
}
\`\`\`

## Max-Width Queries

Target specific ranges:

\`\`\`css
/* Only on mobile (below 768px) */
@media (max-width: 767px) {
  .sidebar {
    display: none;
  }
}
\`\`\`
      `,
      code_examples: [
        {
          title: 'Complete Responsive Layout',
          code: `/* Base Mobile Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', sans-serif;
}

/* Header - Mobile */
.header {
  background-color: #2c3e50;
  color: white;
  padding: 15px;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav a {
  color: white;
  text-decoration: none;
  padding: 12px;
  background-color: #34495e;
  border-radius: 5px;
}

/* Main Content - Mobile */
.container {
  padding: 20px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.sidebar {
  display: none; /* Hidden on mobile */
}

/* Tablet: 768px and up */
@media (min-width: 768px) {
  .header {
    padding: 20px 40px;
  }
  
  .nav {
    flex-direction: row;
    justify-content: center;
  }
  
  .nav a {
    background-color: transparent;
  }
  
  .container {
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
    gap: 30px;
    padding: 40px 30px;
  }
  
  .sidebar {
    display: block;
    flex: 0 0 250px;
  }
  
  .main {
    flex: 1;
  }
  
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 1024px and up */
@media (min-width: 1024px) {
  .header {
    padding: 25px 60px;
  }
  
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
  }
  
  .card {
    padding: 30px;
  }
}

/* Large Desktop: 1440px and up */
@media (min-width: 1440px) {
  .container {
    max-width: 1400px;
  }
  
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}`,
          explanation: 'Mobile-first responsive layout that adapts from single column on mobile to multi-column on larger screens.'
        }
      ],
      common_mistakes: [
        {
          mistake: 'Forgetting viewport meta tag',
          why: 'Site appears zoomed out on mobile',
          fix: 'Always include <meta name="viewport" content="width=device-width, initial-scale=1.0">'
        },
        {
          mistake: 'Using exact device widths',
          why: 'Devices come in many sizes',
          fix: 'Use logical breakpoints (768px, 1024px) not device-specific widths'
        },
        {
          mistake: 'Desktop-first instead of mobile-first',
          why: 'Mobile users get unnecessary code',
          fix: 'Write mobile styles first, add desktop with @media (min-width:)'
        }
      ],
      resources: [
        {
          title: 'Responsive Design Checker',
          url: 'https://responsivedesignchecker.com',
          type: 'tool'
        }
      ],
      tasks: [
        {
          title: 'Build a Fully Responsive Page',
          description: 'Create a page that adapts beautifully from mobile to desktop.',
          instructions: `
1. Start with mobile styles (single column, vertical nav)
2. Add tablet breakpoint (768px): 2-column grid, horizontal nav
3. Add desktop breakpoint (1024px): show sidebar, 3-column grid
4. Add proper viewport meta tag
5. Test by resizing browser window
6. Ensure text is readable at all sizes
          `,
          starter_code: `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* Your CSS here */
  </style>
</head>
<body>
  <header class="header">
    <nav class="nav">
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Services</a>
      <a href="#">Contact</a>
    </nav>
  </header>
  
  <div class="container">
    <aside class="sidebar">Sidebar</aside>
    <main class="main">
      <div class="grid">
        <div class="card">Card 1</div>
        <div class="card">Card 2</div>
        <div class="card">Card 3</div>
        <div class="card">Card 4</div>
        <div class="card">Card 5</div>
        <div class="card">Card 6</div>
      </div>
    </main>
  </div>
</body>
</html>`,
          solution_code: `/* Mobile First Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

/* Header - Mobile */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav a {
  color: white;
  text-decoration: none;
  padding: 15px;
  background-color: rgba(255,255,255,0.1);
  border-radius: 8px;
  text-align: center;
  transition: background 0.3s;
}

.nav a:hover {
  background-color: rgba(255,255,255,0.2);
}

/* Main - Mobile */
.container {
  padding: 20px;
}

.sidebar {
  display: none;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Tablet: 768px+ */
@media (min-width: 768px) {
  .header {
    padding: 25px 40px;
  }
  
  .nav {
    flex-direction: row;
    justify-content: center;
    gap: 20px;
  }
  
  .nav a {
    background-color: transparent;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 30px;
  }
  
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
  }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .container {
    display: flex;
    gap: 30px;
  }
  
  .sidebar {
    display: block;
    flex: 0 0 250px;
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    height: fit-content;
    position: sticky;
    top: 20px;
  }
  
  .main {
    flex: 1;
  }
  
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
  }
}`,
          estimated_time: 60,
          difficulty: 'intermediate'
        }
      ]
    },

    // DAY 20: MOBILE FIRST & REVIEW
    {
      day_number: 20,
      title: 'Mobile-First Best Practices',
      objectives: [
        'Master mobile-first design principles',
        'Optimize images for responsive design',
        'Create touch-friendly interfaces',
        'Test responsive layouts',
        'Review all CSS fundamentals learned'
      ],
      duration_mins: 50,
      content: `
# Mobile-First Design Principles

## Why Mobile-First?

1. **More users on mobile** - Over 60% of web traffic is mobile
2. **Performance** - Mobile users download only what they need
3. **Design constraints** - Forces you to prioritize content

## Mobile-First Mindset

\`\`\`css
/* ❌ Desktop-first (bad) */
.container {
  width: 1200px; /* Desktop default */
}

@media (max-width: 768px) {
  .container {
    width: 100%; /* Override for mobile */
  }
}

/* ✅ Mobile-first (good) */
.container {
  width: 100%; /* Mobile default */
}

@media (min-width: 768px) {
  .container {
    width: 1200px; /* Add complexity for desktop */
  }
}
\`\`\`

## Touch-Friendly Design

Mobile users tap with fingers, not click with mouse:

\`\`\`css
/* Minimum touch target: 44x44px */
.button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 24px;
}

/* Larger tap areas for links */
nav a {
  padding: 15px 20px; /* Easy to tap */
  display: block; /* Full width tap area */
}
\`\`\`

## Responsive Images

\`\`\`css
/* Basic responsive image */
img {
  max-width: 100%; /* Never exceed container */
  height: auto; /* Maintain aspect ratio */
}

/* Background images */
.hero {
  background-image: url('hero-mobile.jpg');
  background-size: cover;
  background-position: center;
}

@media (min-width: 768px) {
  .hero {
    background-image: url('hero-desktop.jpg'); /* Larger image for desktop */
  }
}
\`\`\`

## Readable Text on Mobile

\`\`\`css
body {
  font-size: 16px; /* Minimum 16px for readability */
  line-height: 1.6;
}

p {
  max-width: 70ch; /* 70 characters max width for readability */
}

/* Larger headings on desktop */
h1 {
  font-size: 28px; /* Mobile */
}

@media (min-width: 768px) {
  h1 {
    font-size: 48px; /* Desktop */
  }
}
\`\`\`

## Testing Responsive Design

**Browser DevTools:**
1. Open DevTools (F12)
2. Click device toolbar icon
3. Test different device sizes

**Real Device Testing:**
- Test on actual phones/tablets when possible
- Check touch interactions

## Common Mobile Issues

**Problem:** Text too small
**Solution:** Minimum 16px font size

**Problem:** Buttons too small to tap
**Solution:** Minimum 44x44px touch targets

**Problem:** Content too wide
**Solution:** Use max-width: 100% and padding

**Problem:** Horizontal scroll
**Solution:** Check for fixed widths, use max-width instead

## Reviewing CSS Fundamentals

Over the past 4 weeks, you've learned:

**Week 1:** Selectors, Colors, Typography, Specificity
**Week 2:** Box Model, Margin/Padding, Borders, Display
**Week 3:** Flexbox - Modern 1D layouts
**Week 4:** Grid, Positioning, Responsive Design

You now have a complete CSS foundation! 🎉

## Preparing for Tailwind

After mastering these CSS fundamentals, you're ready for Tailwind CSS (Weeks 5-6), which uses these same concepts with utility classes:

\`\`\`html
<div class="w-full md:w-1/2 lg:w-1/3 p-4 bg-blue-500">
  </div>
\`\`\`

You'll learn Tailwind in Weeks 5-6!
      `,
      code_examples: [
        {
          title: 'Complete Mobile-First Example',
          code: `/* Mobile-First Complete Portfolio Page */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  background-color: #f8f9fa;
}

/* Header - Mobile */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header h1 {
  font-size: 24px;
  margin-bottom: 15px;
}

/* Navigation - Mobile */
.nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-link {
  padding: 15px;
  min-height: 44px;
  background-color: rgba(255,255,255,0.1);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  transition: background 0.3s;
}

.nav-link:active {
  background-color: rgba(255,255,255,0.3);
}

/* Container */
.container {
  padding: 30px 20px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Hero Section */
.hero {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-bottom: 40px;
}

.hero h2 {
  font-size: 32px;
  margin-bottom: 15px;
  color: #2c3e50;
}

.hero p {
  font-size: 18px;
  color: #666;
  margin-bottom: 25px;
}

/* Button */
.btn {
  display: inline-block;
  padding: 15px 35px;
  min-height: 44px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  transition: transform 0.3s, box-shadow 0.3s;
}

.btn:active {
  transform: scale(0.98);
}

/* Projects Section */
.projects h2 {
  font-size: 28px;
  margin-bottom: 30px;
  color: #2c3e50;
}

/* Card Grid - Mobile */
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 25px;
}

.card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card h3 {
  font-size: 22px;
  padding: 20px 20px 10px;
  color: #2c3e50;
}

.card p {
  padding: 0 20px 20px;
  color: #666;
  line-height: 1.6;
}

.card .btn {
  margin: 0 20px 20px;
}

/* Footer */
.footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 30px;
  margin-top: 60px;
}

/* Tablet: 768px+ */
@media (min-width: 768px) {
  .header {
    padding: 25px 40px;
  }
  
  .header h1 {
    font-size: 32px;
    margin-bottom: 20px;
  }
  
  .nav {
    flex-direction: row;
    justify-content: center;
    gap: 20px;
  }
  
  .nav-link {
    padding: 12px 24px;
    background-color: transparent;
  }
  
  .nav-link:hover {
    background-color: rgba(255,255,255,0.2);
  }
  
  .container {
    padding: 50px 40px;
  }
  
  .hero {
    padding: 60px 40px;
  }
  
  .hero h2 {
    font-size: 48px;
  }
  
  .hero p {
    font-size: 20px;
  }
  
  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
  
  .projects h2 {
    font-size: 36px;
  }
  
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .header h1 {
    font-size: 36px;
  }
  
  .hero {
    padding: 80px 60px;
  }
  
  .hero h2 {
    font-size: 56px;
  }
  
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .card img {
    height: 250px;
  }
}`,
          explanation: 'Complete mobile-first portfolio page with touch-friendly sizes, responsive images, and progressive enhancement.'
        }
      ],
      common_mistakes: [
        {
          mistake: 'Touch targets too small',
          why: 'Users can\'t accurately tap buttons',
          fix: 'Minimum 44x44px for all interactive elements'
        },
        {
          mistake: 'Using hover effects on mobile',
          why: 'Mobile doesn\'t have hover, only tap',
          fix: 'Use :active for mobile, :hover only in desktop media queries'
        },
        {
          mistake: 'Not testing on real devices',
          why: 'Simulators don\'t show real-world issues',
          fix: 'Always test on actual phones/tablets'
        }
      ],
      resources: [
        {
          title: 'Mobile-First Design',
          url: 'https://www.lukew.com/ff/entry.asp?933',
          type: 'article'
        },
        {
          title: 'Chrome DevTools Device Mode',
          url: 'https://developer.chrome.com/docs/devtools/device-mode',
          type: 'tool'
        }
      ],
      tasks: [
        {
          title: 'Build a Complete Mobile-First Portfolio',
          description: 'Create your final CSS project - a complete portfolio page using all techniques learned.',
          instructions: `
1. Start with mobile styles (single column, vertical nav)
2. Ensure all touch targets are minimum 44x44px
3. Use responsive images that scale properly
4. Add tablet breakpoint (768px) with 2-column grid
5. Add desktop breakpoint (1024px) with 3-column grid
6. Include proper viewport meta tag
7. Test by resizing browser from mobile to desktop
8. Use Box Model, Flexbox, Grid, and Positioning
9. Add hover effects only for desktop
10. Include all sections: header, hero, projects, footer
          `,
          starter_code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Portfolio</title>
  <style>
    /* Your complete mobile-first CSS here */
  </style>
</head>
<body>
  <header class="header">
    <h1>My Portfolio</h1>
    <nav class="nav">
      <a href="#" class="nav-link">Home</a>
      <a href="#" class="nav-link">About</a>
      <a href="#" class="nav-link">Projects</a>
      <a href="#" class="nav-link">Contact</a>
    </nav>
  </header>
  
  <main class="container">
    <section class="hero">
      <h2>Welcome</h2>
      <p>I'm a web developer</p>
      <a href="#" class="btn">View Projects</a>
    </section>
    
    <section class="projects">
      <h2>My Projects</h2>
      <div class="card-grid">
        <article class="card">
          <img src="project1.jpg" alt="Project 1">
          <h3>Project Title</h3>
          <p>Description</p>
          <a href="#" class="btn">Learn More</a>
        </article>
        </div>
    </section>
  </main>
  
  <footer class="footer">
    <p>&copy; 2024 My Portfolio</p>
  </footer>
</body>
</html>`,
          solution_code: `/* Use the complete example from code_examples above */`,
          estimated_time: 120,
          difficulty: 'intermediate'
        }
      ]
    }
  ],
  assignment: {
    title: 'Week 4 Final Project: Complete Responsive Website',
    description: 'Build a fully responsive multi-page website using all CSS techniques learned: Grid, Flexbox, Positioning, and Media Queries.',
    requirements: [
      'Mobile-first responsive design',
      'Fixed or sticky navigation bar',
      'Grid layout for content sections',
      'Flexbox for header and footer',
      'Proper positioning for badges/overlays',
      'Media queries for tablet and desktop',
      'Touch-friendly sizing (44px minimum)',
      'Responsive images',
      'Professional appearance across all devices'
    ],
    bonus_tasks: [
      'Add CSS Grid template areas for page layout',
      'Implement sticky sidebar on desktop',
      'Add smooth scrolling and transitions',
      'Create accessible navigation',
      'Optimize images for different screen sizes'
    ],
    estimated_time: 240,
    success_criteria: [
      'Works perfectly on mobile, tablet, and desktop',
      'All interactive elements are touch-friendly',
      'Layout never breaks or causes horizontal scroll',
      'Navigation is usable on all devices',
      'Code is clean, organized, and commented',
      'Passes responsive design check',
      'Demonstrates mastery of all 4 weeks of CSS'
    ]
  }
},
     {
  week_number: 5,
  title: 'Introduction to Tailwind CSS',
  description: 'Transition from vanilla CSS to the utility-first workflow. Learn to build beautiful, responsive UIs rapidly without leaving your HTML.',
  objectives: [
    'Understand the Utility-First fundamentals',
    'Master color, typography, and spacing utilities',
    'Implement Flexbox and Grid layouts using Tailwind classes',
    'Handle hover, focus, and active states',
    'Build responsive layouts using Tailwind breakpoints'
  ],
  lessons: [
    // DAY 21
    {
      day_number: 21,
      title: 'The Utility-First Workflow',
      objectives: [
        'Set up Tailwind via CDN for learning',
        'Understand the difference between Semantic CSS and Utility CSS',
        'Master the Box Model utilities (margin, padding, sizing)',
        'Apply colors to backgrounds and text',
        'Build a simple button component'
      ],
      duration_mins: 50,
      content: `
# Hello, Tailwind CSS!

You have spent 4 weeks mastering CSS fundamentals. Now, you get superpowers.

## What is Tailwind?

Tailwind is a "utility-first" CSS framework. Instead of writing CSS in a separate file like this:

\`\`\`css
/* Traditional CSS */
.chat-notification {
  display: flex;
  max-width: 24rem;
  margin: 0 auto;
  padding: 1.5rem;
  border-radius: 0.5rem;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
\`\`\`

You write classes directly in your HTML:

\`\`\`html
<div class="flex max-w-sm mx-auto p-6 rounded-lg bg-white shadow-xl">
  </div>
\`\`\`



## Setting Up (CDN)

For learning, we use the Play CDN. *Note: In production, we use a build step (npm), but for now, we just want to code.*

\`\`\`html
<script src="https://cdn.tailwindcss.com"></script>
\`\`\`

## The Core Utilities

### 1. Spacing (Margin & Padding)
Tailwind uses a scale. \`4\` usually equals \`1rem\` (16px).

* \`p-4\`: padding: 1rem;
* \`m-4\`: margin: 1rem;
* \`px-2\`: padding-left & padding-right: 0.5rem;
* \`my-8\`: margin-top & margin-bottom: 2rem;

### 2. Colors
Colors are named: Slate, Gray, Zinc, Red, Orange, Amber, Yellow, Lime, Green, Emerald, Teal, Cyan, Sky, Blue, Indigo, Violet, Purple, Fuchsia, Pink, Rose.

Scale runs 50-950.
* \`bg-blue-500\`: Standard blue background
* \`text-slate-800\`: Dark text
* \`border-red-200\`: Light red border

### 3. Sizing
* \`w-full\`: width: 100%
* \`h-screen\`: height: 100vh
* \`max-w-md\`: max-width: 28rem

## Your First Component

Let's build a card without writing a single line of CSS in a \`<style>\` tag.
      `,
      code_examples: [
        {
          title: 'Traditional vs Tailwind Comparison',
          code: `<style>
  .btn {
    background-color: #3b82f6;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    font-weight: bold;
    border: none;
    cursor: pointer;
  }
  .btn:hover {
    background-color: #2563eb;
  }
</style>
<button class="btn">Click Me</button>

<button class="bg-blue-500 text-white py-2 px-4 rounded font-bold hover:bg-blue-600">
  Click Me
</button>`,
          explanation: 'Notice how we achieve the same result without naming the class "btn" or opening a style block.'
        }
      ],
      common_mistakes: [
        {
          mistake: 'Memorizing every class immediately',
          why: 'There are thousands of classes',
          fix: 'Keep the Tailwind documentation open in a separate tab. It has a great search bar.'
        },
        {
          mistake: 'Thinking inline styles are the same as Tailwind',
          why: 'Inline styles have no constraints (magic numbers)',
          fix: 'Tailwind uses a design system (constraints) which keeps design consistent.'
        }
      ],
      resources: [
        {
          title: 'Official Tailwind Documentation',
          url: 'https://tailwindcss.com/docs',
          type: 'reference'
        },
        {
          title: 'Tailwind Cheat Sheet',
          url: 'https://nerdcave.com/tailwind-cheat-sheet',
          type: 'tool'
        }
      ],
      tasks: [
        {
          title: 'Build a User Profile Card',
          description: 'Create a centered profile card with an image, name, title, and button using only Tailwind classes.',
          instructions: `
1. Create a container with a gray background
2. Create a white card centered in the container
3. Add a rounded avatar image
4. Add the name (bold, large text) and job title (gray text)
5. Add a "Connect" button with a blue background and rounded corners
6. Use p-*, m-*, and text-* utilities
          `,
          starter_code: `<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div>
    <img src="https://i.pravatar.cc/150" alt="Avatar">
    <h3>Sarah Smith</h3>
    <p>Product Designer</p>
    <button>Connect</button>
  </div>
</body>
</html>`,
          solution_code: `<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 flex items-center justify-center min-h-screen">

  <div class="bg-white p-8 rounded-xl shadow-lg text-center max-w-sm w-full mx-4">
    <img 
      class="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-100" 
      src="https://i.pravatar.cc/150?img=5" 
      alt="Avatar"
    >
    <h3 class="text-xl font-bold text-gray-900">Sarah Smith</h3>
    <p class="text-gray-500 mb-6">Product Designer</p>
    <button class="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition">
      Connect
    </button>
  </div>

</body>
</html>`,
          estimated_time: 45,
          difficulty: 'beginner'
        }
      ]
    },

    // DAY 22
    {
      day_number: 22,
      title: 'Typography & Decorative Effects',
      objectives: [
        'Master font sizing, weight, and line-height',
        'Control letter-spacing and text alignment',
        'Apply borders, dividing lines, and outline rings',
        'Use box-shadows and opacity',
        'Understand gradients in Tailwind'
      ],
      duration_mins: 50,
      content: `
# Typography & Decorating

Tailwind makes styling text and boxes incredibly fast.

## Typography

Instead of \`font-size: 1.25rem\`, we use a t-shirt sizing scale:

* \`text-xs\` (0.75rem)
* \`text-sm\` (0.875rem)
* \`text-base\` (1rem - standard)
* \`text-lg\` (1.125rem)
* \`text-xl\` (1.25rem)
* ...up to \`text-9xl\`

**Weights:**
\`font-thin\`, \`font-light\`, \`font-normal\`, \`font-semibold\`, \`font-bold\`, \`font-black\`.

**Alignment:**
\`text-left\`, \`text-center\`, \`text-right\`, \`text-justify\`.

## Borders & Dividers

**Basic Border:**
\`\`\`html
<div class="border border-gray-300 rounded-md p-4">
\`\`\`

**Individual Sides:**
\`border-b\` (bottom only), \`border-l-4\` (left, 4px thick).

**Divide Utility (The Magic):**
If you have a list of items, you don't need to add a border to every child. Use \`divide-y\` on the parent!

\`\`\`html
<ul class="divide-y divide-gray-200">
  <li class="p-4">Item 1</li>
  <li class="p-4">Item 2</li>
  <li class="p-4">Item 3</li>
</ul>
\`\`\`

## Shadows (Elevation)

Tailwind provides a beautiful shadow system inspired by Material Design:

* \`shadow-sm\`
* \`shadow\`
* \`shadow-md\`
* \`shadow-lg\`
* \`shadow-xl\`
* \`shadow-2xl\`

## Gradients

Tailwind makes gradients easy using "From", "Via", and "To":

\`\`\`html
<div class="bg-gradient-to-r from-blue-500 to-purple-500 h-40"></div>
\`\`\`
      `,
      code_examples: [
        {
          title: 'Pricing Card Example',
          code: `<div class="max-w-sm mx-auto border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
  <div class="bg-gray-50 p-6 border-b border-gray-200">
    <h3 class="text-lg font-medium text-gray-900">Pro Plan</h3>
    <div class="mt-4 flex items-baseline text-gray-900">
      <span class="text-5xl font-extrabold tracking-tight">$29</span>
      <span class="ml-1 text-xl font-semibold text-gray-500">/month</span>
    </div>
  </div>
  <div class="p-6 bg-white">
    <ul class="space-y-4">
      <li class="flex items-center">
        <span class="text-green-500 mr-2">✓</span>
        <span class="text-gray-600">Unlimited Access</span>
      </li>
      <li class="flex items-center">
        <span class="text-green-500 mr-2">✓</span>
        <span class="text-gray-600">24/7 Support</span>
      </li>
    </ul>
    <button class="mt-8 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-indigo-700">
      Get Started
    </button>
  </div>
</div>`,
          explanation: 'Demonstrates borders, shadows, typography sizing/weight, and spacing utilities.'
        }
      ],
      common_mistakes: [
        {
          mistake: 'Using too many font sizes',
          why: 'Inconsistent design',
          fix: 'Stick to a few sizes (e.g., xl for headers, base for text, sm for captions).'
        },
        {
          mistake: 'Forgetting tracking (letter-spacing)',
          why: 'Large headings often look better with tighter spacing',
          fix: 'Use `tracking-tight` on large headings and `tracking-wide` on small uppercase text.'
        }
      ],
      resources: [],
      tasks: [
        {
          title: 'Design a Blog Post Preview',
          description: 'Create a card that displays a blog post summary using typography best practices.',
          instructions: `
1. Create a card with a shadow-md
2. Add a category tag (e.g., "Technology") in small, uppercase, bold text with tracking-wide
3. Add a Headline (text-xl, font-bold, text-gray-900)
4. Add an excerpt (text-gray-600, leading-relaxed)
5. Add an "Author" section at the bottom with a rounded-full avatar
          `,
          starter_code: `<div>
  <span>Article</span>
  <h2>Boost your conversion rate</h2>
  <p>Lorem ipsum dolor sit amet...</p>
  <div>
    <img src="avatar.jpg">
    <span>By Author Name</span>
  </div>
</div>`,
          solution_code: `<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4 border border-gray-100">
  <div class="p-8">
    <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Case Study</div>
    <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Finding customers for your new business</a>
    <p class="mt-2 text-slate-500">Getting a new business off the ground is a lot of hard work. Here are five ideas you can use to find your first customers.</p>
    
    <div class="mt-6 flex items-center">
      <div class="flex-shrink-0">
        <img class="h-10 w-10 rounded-full" src="https://i.pravatar.cc/150?img=32" alt="Author">
      </div>
      <div class="ml-3">
        <div class="text-sm font-medium text-slate-900">Tom Cook</div>
        <div class="text-sm text-slate-500">Aug 18</div>
      </div>
    </div>
  </div>
</div>`,
          estimated_time: 45,
          difficulty: 'beginner'
        }
      ]
    },

    // DAY 23
    {
      day_number: 23,
      title: 'Flexbox & Grid in Tailwind',
      objectives: [
        'Map CSS Flexbox properties to Tailwind classes',
        'Control flex direction, wrapping, and alignment',
        'Create grid layouts using utility classes',
        'Control gap, column spans, and row spans',
        'Build a navigation bar and gallery'
      ],
      duration_mins: 60,
      content: `
# Layouts: Flex & Grid

You already know Flexbox and Grid from Weeks 3-4. Now you learn the shorthand.



## Flexbox Mapping

| Standard CSS | Tailwind Class |
| :--- | :--- |
| \`display: flex\` | \`flex\` |
| \`flex-direction: column\` | \`flex-col\` |
| \`justify-content: center\` | \`justify-center\` |
| \`justify-content: space-between\` | \`justify-between\` |
| \`align-items: center\` | \`items-center\` |
| \`flex-wrap: wrap\` | \`flex-wrap\` |
| \`gap: 1rem\` | \`gap-4\` |
| \`flex: 1 1 0%\` | \`flex-1\` |

**Example Navbar:**
\`\`\`html
<nav class="flex justify-between items-center p-4 bg-gray-800 text-white">
  <div class="font-bold">Logo</div>
  <div class="flex gap-4">
    <a href="#">Home</a>
    <a href="#">About</a>
  </div>
</nav>
\`\`\`

## CSS Grid Mapping

| Standard CSS | Tailwind Class |
| :--- | :--- |
| \`display: grid\` | \`grid\` |
| \`grid-template-columns: repeat(3, 1fr)\` | \`grid-cols-3\` |
| \`gap: 1.5rem\` | \`gap-6\` |
| \`grid-column: span 2\` | \`col-span-2\` |

**Example Gallery:**
\`\`\`html
<div class="grid grid-cols-3 gap-4 p-4">
  <div class="bg-blue-200 h-32">1</div>
  <div class="bg-blue-200 h-32">2</div>
  <div class="bg-blue-200 h-32">3</div>
</div>
\`\`\`

## Space-Between Utilities (The \`space-x\` trick)

Before \`gap\` was supported everywhere in Flexbox, Tailwind introduced \`space-x-{amount}\`. It adds margin to every child *except* the first one.

\`\`\`html
<div class="flex space-x-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
\`\`\`
*(Note: Modern Tailwind usually prefers \`gap\`)*
      `,
      code_examples: [
        {
          title: 'Sidebar Layout (Flex)',
          code: `<div class="flex h-screen">
  <aside class="w-64 bg-slate-800 text-white flex flex-col">
    <div class="p-4 text-2xl font-bold">App</div>
    <nav class="flex-1 p-4 space-y-2">
      <a href="#" class="block p-2 bg-slate-700 rounded">Dashboard</a>
      <a href="#" class="block p-2 hover:bg-slate-700 rounded">Settings</a>
    </nav>
    <div class="p-4 bg-slate-900">User Profile</div>
  </aside>

  <main class="flex-1 bg-gray-100 p-8">
    <h1 class="text-3xl font-bold mb-6">Dashboard</h1>
    <div class="grid grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded shadow h-40">Stat 1</div>
      <div class="bg-white p-6 rounded shadow h-40">Stat 2</div>
      <div class="bg-white p-6 rounded shadow h-40">Stat 3</div>
    </div>
  </main>
</div>`,
          explanation: 'Combines Flex (for sidebar/main split) and Grid (for dashboard stats).'
        }
      ],
      common_mistakes: [
        {
          mistake: 'Using Grid when Flex is needed',
          why: 'Grid is for 2D, Flex is for 1D',
          fix: 'Use Flex for navbars and lists. Use Grid for page layouts and galleries.'
        },
        {
          mistake: 'Forgetting flex-wrap',
          why: 'Items squash together on small screens',
          fix: 'Add `flex-wrap` if items should flow to the next line.'
        }
      ],
      resources: [],
      tasks: [
        {
          title: 'Build a Photo Grid with Spans',
          description: 'Create a Bento-box style layout using Grid utilities.',
          instructions: `
1. Create a container with grid-cols-4 and gap-4
2. Create 6-8 item divs with backgrounds and rounded corners
3. Make the first item span 2 columns (col-span-2)
4. Make the second item span 2 rows (row-span-2)
5. Use flexbox inside the items to center text vertically and horizontally
          `,
          starter_code: `<div class="grid ...">
  </div>`,
          solution_code: `<div class="p-8 grid grid-cols-4 grid-rows-3 gap-4 h-screen">
  <div class="bg-indigo-500 col-span-2 row-span-2 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
    Featured (2x2)
  </div>
  
  <div class="bg-pink-400 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">1</div>
  <div class="bg-pink-400 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">2</div>
  
  <div class="bg-purple-400 col-span-2 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
    Wide Item (2x1)
  </div>
  
  <div class="bg-teal-400 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">3</div>
  <div class="bg-teal-400 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">4</div>
</div>`,
          estimated_time: 50,
          difficulty: 'intermediate'
        }
      ]
    },

    // DAY 24
    {
      day_number: 24,
      title: 'Responsive Design in Tailwind',
      objectives: [
        'Understand the mobile-first prefix system',
        'Memorize the default breakpoints (sm, md, lg, xl, 2xl)',
        'Apply responsive modifiers to layout utilities',
        'Change typography and spacing based on screen size',
        'Build a fully responsive navigation bar'
      ],
      duration_mins: 60,
      content: `
# Responsive Design: The "Prefix" System

In Week 4, you wrote media queries like \`@media (min-width: 768px)\`.
In Tailwind, you just add a prefix.



## The Breakpoints

Tailwind is **Mobile First**. The un-prefixed class applies to mobile (and up). The prefix overrides it at larger screens.

* (None): Mobile (< 640px)
* \`sm:\`: Tablet Portrait (640px+)
* \`md:\`: Tablet Landscape (768px+)
* \`lg:\`: Laptop (1024px+)
* \`xl:\`: Desktop (1280px+)

## How it works

\`\`\`html
<div class="w-full md:w-1/2 lg:w-1/4 bg-blue-500">
  Responsive Box
</div>
\`\`\`

## Responsive Layouts (Grid)

\`\`\`html
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div class="bg-gray-200 p-4">1</div>
  <div class="bg-gray-200 p-4">2</div>
  <div class="bg-gray-200 p-4">3</div>
</div>
\`\`\`

## Responsive Visibility

Hiding elements on mobile, showing on desktop:

\`\`\`html
<nav class="flex justify-between">
  <div>Logo</div>
  
  <ul class="hidden md:flex gap-4">
    <li>Home</li>
    <li>About</li>
  </ul>
  
  <button class="md:hidden">
    Hamburger Menu Icon
  </button>
</nav>
\`\`\`
      `,
      code_examples: [
        {
          title: 'Responsive Product Card',
          code: `<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
  <div class="md:flex">
    <div class="md:shrink-0">
      <img class="h-48 w-full object-cover md:h-full md:w-48" src="https://i.pravatar.cc/300" alt="Product">
    </div>
    <div class="p-8">
      <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">New Release</div>
      <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
        Awesome Headphones
      </a>
      <p class="mt-2 text-slate-500">
        Looking to take your music to the next level? These headphones are perfect for you.
      </p>
    </div>
  </div>
</div>`,
          explanation: 'Uses `md:flex` to switch from stacked (mobile) to side-by-side (desktop) layout.'
        }
      ],
      common_mistakes: [
        {
          mistake: 'Using sm: for mobile styles',
          why: 'sm: means "small screens AND LARGER"',
          fix: 'Write mobile styles without a prefix. Use `sm:` or `md:` to *change* it for larger screens.'
        },
        {
          mistake: 'Thinking max-width breakpoints',
          why: 'Tailwind is min-width driven',
          fix: 'Always think: "What does it look like on a phone?" Start there.'
        }
      ],
      resources: [],
      tasks: [
        {
          title: 'Build a Responsive Testimonial Grid',
          description: 'Create a grid of 3 testimonials that stacks on mobile and aligns in a row on desktop.',
          instructions: `
1. Container: grid with 1 column (default)
2. Add 'md:grid-cols-3' to make it 3 columns on tablet+
3. Gap should be small on mobile (gap-4) and larger on desktop (md:gap-8)
4. Text size should be slightly larger on desktop (text-base mobile, md:text-lg desktop)
          `,
          starter_code: `<div class="grid ...">
  </div>`,
          solution_code: `<div class="bg-slate-50 p-8 min-h-screen flex items-center justify-center">
  <div class="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
    
    <div class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
      <p class="text-slate-600 mb-4">"Tailwind CSS revolutionized how I build websites. It's incredibly fast."</p>
      <div class="font-bold text-slate-900">Jane Doe</div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
      <p class="text-slate-600 mb-4">"I never want to go back to writing vanilla CSS again. Utility classes are the future."</p>
      <div class="font-bold text-slate-900">John Smith</div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
      <p class="text-slate-600 mb-4">"The responsive prefixes make mobile-first design actually enjoyable."</p>
      <div class="font-bold text-slate-900">Sarah Connor</div>
    </div>

  </div>
</div>`,
          estimated_time: 45,
          difficulty: 'intermediate'
        }
      ]
    },

    // DAY 25
    {
      day_number: 25,
      title: 'States & Interactivity',
      objectives: [
        'Style element states: hover, focus, active',
        'Style parent/child interactions with groups',
        'Implement Dark Mode styling',
        'Use transitions and transforms',
        'Apply gradients on hover'
      ],
      duration_mins: 60,
      content: `
# States: Hover, Focus, & More

Tailwind lets you style states by adding a prefix.

## Hover & Active

\`\`\`html
<button class="bg-blue-500 hover:bg-blue-700 active:bg-blue-800 text-white p-2 rounded">
  Hover Me
</button>
\`\`\`

## Focus (Forms)

\`\`\`html
<input class="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-2">
\`\`\`

## Transitions

Tailwind includes sensible defaults for animations.

\`\`\`html
<button class="bg-blue-500 hover:bg-blue-700 transition duration-300 ease-in-out ...">
  Smooth Button
</button>
\`\`\`

## The "Group" Pattern

Style a child when the parent is hovered.

1. Add \`group\` class to parent.
2. Add \`group-hover:{utility}\` to child.

\`\`\`html
<div class="group border p-4 hover:bg-blue-500 cursor-pointer">
  <h3 class="text-black group-hover:text-white">Card Title</h3>
  <p class="text-gray-500 group-hover:text-blue-100">
    The text turns white when the WHOLE card is hovered.
  </p>
</div>
\`\`\`

## Dark Mode

Tailwind supports dark mode out of the box (usually configured to look at system settings or a class on the HTML tag).

\`\`\`html
<div class="bg-white dark:bg-slate-800 text-black dark:text-white">
  I adapt to your system theme!
</div>
\`\`\`
      `,
      code_examples: [
        {
          title: 'Interactive Form Input',
          code: `<form class="max-w-sm mx-auto p-4 space-y-4">
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
    <input 
      type="email" 
      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
             focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
             disabled:bg-gray-50 disabled:text-gray-500" 
      placeholder="you@example.com"
    >
  </div>
  <button class="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
    Sign In
  </button>
</form>`,
          explanation: 'Demonstrates focus rings, outline removal, and hover states on buttons.'
        }
      ],
      common_mistakes: [
        {
          mistake: 'Not adding transition class',
          why: 'Hover effects jump instantly (looks cheap)',
          fix: 'Add `transition` or `transition-all` to make state changes smooth.'
        },
        {
          mistake: 'Overusing the group pattern',
          why: 'Can become hard to read',
          fix: 'Use it only when the target is distinct from the trigger.'
        }
      ],
      resources: [
        {
          title: 'Tailwind Hover/Focus Docs',
          url: 'https://tailwindcss.com/docs/hover-focus-and-other-states',
          type: 'reference'
        }
      ],
      tasks: [
        {
          title: 'Build an Interactive Card',
          description: 'Create a product card that "lifts up" and changes color on hover.',
          instructions: `
1. Create a card with a white background and shadow-sm
2. Add 'transition' and 'duration-300'
3. On hover: scale up slightly (hover:scale-105), increase shadow (hover:shadow-xl)
4. Add a button inside that changes background color on hover
5. Add a "New" badge that only appears when the card is hovered (using group/group-hover)
          `,
          starter_code: `<div class="group ...">
  </div>`,
          solution_code: `<div class="flex justify-center p-10 bg-gray-50 min-h-[50vh]">
  <div class="group relative w-72 bg-white rounded-2xl shadow-sm hover:shadow-xl hover:scale-105 transition duration-300 ease-out cursor-pointer overflow-hidden border border-gray-100">
    
    <div class="h-40 bg-blue-500 group-hover:bg-blue-600 transition"></div>
    
    <span class="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-300">
      NEW
    </span>

    <div class="p-5">
      <h3 class="text-lg font-bold text-gray-800 mb-2">Super Gadget</h3>
      <p class="text-gray-500 text-sm mb-4">Hover this card to see the smooth lift effect and the badge appear.</p>
      <button class="w-full border border-blue-500 text-blue-500 py-2 rounded font-semibold group-hover:bg-blue-500 group-hover:text-white transition">
        Buy Now
      </button>
    </div>
  </div>
</div>`,
          estimated_time: 45,
          difficulty: 'intermediate'
        }
      ]
    }
  ],
  assignment: {
    title: 'Week 5 Project: The Landing Page',
    description: 'Rebuild a modern startup landing page using purely Tailwind CSS. No custom CSS files allowed!',
    requirements: [
      'Fixed navigation bar with logo and links',
      'Hero section with headline, subheadline, and two buttons (primary/secondary)',
      'Feature grid (3 columns on desktop, 1 on mobile)',
      'Responsive design (mobile, tablet, desktop)',
      'Hover states on all interactive elements',
      'Proper use of spacing and typography utilities'
    ],
    bonus_tasks: [
      'Add a dark mode toggle',
      'Use gradients for the hero background',
      'Add a "Testimonials" section with a shadow-lg card',
      'Implement a "Sticky" header'
    ],
    estimated_time: 180,
    success_criteria: [
      'Zero custom CSS in <style> tags',
      'Site looks good on a phone (375px width)',
      'Code uses utility classes efficiently',
      'Color palette is consistent (e.g., all blues are from the same scale)',
      'Interactive elements provide visual feedback'
    ]
  }
},
 {
  week_number: 6,
  title: 'Advanced Tailwind & Capstone',
  description: 'Master customization, component extraction, and advanced visual effects. Build a production-ready portfolio as your final capstone.',
  objectives: [
    'Customize the tailwind.config.js theme',
    'Extract repeated patterns using @apply and components',
    'Implement advanced visual effects (Blur, Filters, Animations)',
    'Master arbitrary values and layout tricks',
    'Complete the comprehensive Final Capstone Project'
  ],
  lessons: [
    // DAY 26
    {
      day_number: 26,
      title: 'Customizing Your Theme',
      objectives: [
        'Understand the tailwind.config.js file',
        'Extend the color palette with custom brand colors',
        'Add custom fonts (Google Fonts)',
        'Extend breakpoints for specific devices',
        'Understand "Extend" vs "Override"'
      ],
      duration_mins: 50,
      content: `
# Customizing Tailwind

Tailwind is not just a set of classes; it's a design engine. You can change every single value.

## The Config File

To customize Tailwind, you need a \`tailwind.config.js\` file. (If using CDN for learning, you define this in a script tag).

\`\`\`javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'brand-primary': '#ff5733',
      }
    }
  }
}
\`\`\`

## Extend vs. Override

* **extend:** Adds your new values *alongside* the default Tailwind values.
* **theme (direct):** *Replaces* all default values. (Dangerous! If you do this for colors, you lose all the built-in colors like 'blue-500').

## Custom Colors & Fonts

**Adding a Brand Color:**
If you add \`brand: '#123456'\`, you immediately get:
* \`bg-brand\`
* \`text-brand\`
* \`border-brand\`
* \`ring-brand\`

**Adding Fonts:**
\`\`\`javascript
fontFamily: {
  sans: ['Inter', 'sans-serif'],
  serif: ['Merriweather', 'serif'],
}
\`\`\`
`,
      code_examples: [
        {
          title: 'Configuration Example',
          code: `<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          clifford: '#da373d',
          'neon-green': '#39ff14',
        },
        fontFamily: {
          display: ['Oswald', 'sans-serif'],
        },
        spacing: {
          '128': '32rem', // Adds w-128, h-128, p-128...
        }
      }
    }
  }
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap');
</style>

<body class="p-10">
  <h1 class="font-display text-5xl text-clifford mb-4">
    Custom Config
  </h1>
  <div class="w-128 bg-neon-green h-12 rounded shadow-lg flex items-center px-4">
    I am 32rem wide using a custom utility!
  </div>
</body>`,
          explanation: 'Demonstrates how to inject custom design tokens into the framework.'
        }
      ],
      common_mistakes: [
        {
          mistake: 'Overriding instead of Extending',
          why: 'You lose all default classes (like bg-white or p-4)',
          fix: 'Always put your custom values inside `theme: { extend: { ... } }` unless you intentionally want to disable defaults.'
        },
        {
          mistake: 'Hardcoding hex codes in HTML',
          why: 'Inconsistent design',
          fix: 'Add the color to the config file so you can reuse it as `bg-brand`, `text-brand`, etc.'
        }
      ],
      resources: [
        {
          title: 'Tailwind Configuration Docs',
          url: 'https://tailwindcss.com/docs/configuration',
          type: 'reference'
        }
      ],
      tasks: [
        {
          title: 'Create a Branded Card',
          description: 'Configure a specific color palette and font, then build a card using those custom utilities.',
          instructions: `
1. Setup a tailwind config script.
2. Add a custom color named 'gold' with value '#ffd700'.
3. Add a custom font named 'retro'.
4. Build a card using 'bg-gold', 'text-gold', and 'font-retro'.
          `,
          starter_code: `<script>
  tailwind.config = {
    theme: {
      extend: {
        // Add colors and fonts here
      }
    }
  }
</script>`,
          solution_code: `<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          brand: {
            light: '#dbeafe',
            DEFAULT: '#2563eb',
            dark: '#1e40af',
          }
        }
      }
    }
  }
</script>

<button class="bg-brand hover:bg-brand-dark text-white py-2 px-4 rounded">
  Custom Brand Button
</button>`,
          estimated_time: 40,
          difficulty: 'intermediate'
        }
      ]
    },

    // DAY 27
    {
      day_number: 27,
      title: 'Reusing Styles: @apply & Components',
      objectives: [
        'Identify when to extract components',
        'Learn the @apply directive (concepts only for CDN)',
        'Manage long class strings efficiently',
        'Understand the "Multi-cursor" editing workflow',
        'Pros/Cons of Tailwind component abstraction'
      ],
      duration_mins: 50,
      content: `
# Handling Repetition

A common complaint about Tailwind is: "My HTML is messy!" and "I have to repeat the same 10 classes for every button!"

## Strategy 1: Multi-Cursor / Editor Tools
In VS Code, you rarely type the same class twice manually. You copy-paste or use multi-cursor editing. This keeps the utility classes visible, which is often preferred for maintainability.

## Strategy 2: JavaScript Components (React/Vue)
The *best* way to use Tailwind is with a component framework.
\`\`\`jsx
// React Component
function Button({ children }) {
  return <button className="px-4 py-2 bg-blue-500 rounded text-white">{children}</button>
}
\`\`\`

## Strategy 3: The \`@apply\` Directive
If you must use standard HTML/CSS, you can extract classes into CSS.

\`\`\`css
/* style.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

.btn-primary {
  @apply py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-700;
}
\`\`\`

\`\`\`html
<button class="btn-primary">Click me</button>
\`\`\`

*Warning: Don't overuse @apply. It reintroduces the problems of traditional CSS (naming things).*
`,
      code_examples: [
        {
          title: 'Refactoring Repetitive HTML',
          code: `<div class="flex gap-4">
  <button class="bg-blue-500 text-white font-bold py-2 px-4 rounded">Btn 1</button>
  <button class="bg-blue-500 text-white font-bold py-2 px-4 rounded">Btn 2</button>
  <button class="bg-blue-500 text-white font-bold py-2 px-4 rounded">Btn 3</button>
</div>

<script>
  const btnClass = "bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition";
</script>

<button class="\${btnClass}">Btn 1</button>
<button class="\${btnClass}">Btn 2</button>`,
          explanation: 'Demonstrates that repetitive classes should be solved via templates/JS, not necessarily by reverting to CSS files.'
        }
      ],
      common_mistakes: [
        {
          mistake: 'Using @apply for everything',
          why: 'You create a separate CSS file that is hard to maintain and bloats your bundle',
          fix: 'Only use @apply for very small, highly reusable primitives like buttons or form inputs.'
        },
        {
          mistake: 'Creating classes like .card-wrapper-inner-div',
          why: 'Naming is hard. Utilities are easy.',
          fix: 'Stick to utility classes in HTML until repetition becomes painful.'
        }
      ],
      resources: [],
      tasks: [
        {
          title: 'Refactor a Nav Menu',
          description: 'Take a messy nav menu with repetitive classes and clean it up using a JS variable or config styling.',
          instructions: `
1. Create a navigation list with 5 links.
2. Initially write the full classes for each link: "text-gray-600 hover:text-blue-500 px-3 py-2 text-sm font-medium".
3. Refactor this using a JavaScript loop to generate the HTML string (simulating a component).
          `,
          starter_code: `<ul>
  <li class="text-gray-600 hover:text-blue-500 px-3 py-2">Home</li>
  <li class="text-gray-600 hover:text-blue-500 px-3 py-2">About</li>
  </ul>`,
          solution_code: `<div id="menu" class="flex gap-4"></div>

<script>
  const links = ['Home', 'About', 'Services', 'Contact'];
  const baseClass = "text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition font-medium cursor-pointer";
  
  const menuHTML = links.map(link => 
    \`<div class="\${baseClass}">\${link}</div>\`
  ).join('');
  
  document.getElementById('menu').innerHTML = menuHTML;
</script>`,
          estimated_time: 45,
          difficulty: 'intermediate'
        }
      ]
    },

    // DAY 28
    {
      day_number: 28,
      title: 'Advanced Visuals: Filters & Arbitrary Values',
      objectives: [
        'Use Blur, Brightness, and Drop Shadow filters',
        'Implement Backdrop Blur (Glassmorphism)',
        'Understand Arbitrary Values (The square bracket notation)',
        'Use Transforms: Rotate, Scale, Skew',
        'Create simple keyframe animations (animate-spin, animate-bounce)'
      ],
      duration_mins: 60,
      content: `
# Visual Polish

This is where Tailwind makes you look like a pro designer.

## Filters

Standard CSS filters are available as utilities.
* \`blur-sm\`, \`blur-lg\`
* \`brightness-50\`, \`brightness-125\`
* \`grayscale\` (Great for inactive states)
* \`sepia\`

## Backdrop Blur (Glass Effect)

The "Apple" frosted glass look.
\`\`\`html
<div class="bg-white/30 backdrop-blur-md border border-white/20 p-6 rounded-xl">
  Glass Card
</div>
\`\`\`
*(Note: Requires a semi-transparent background color like white/30).*

## Arbitrary Values (Square Brackets)

Sometimes you need a very specific value that isn't in the theme (like a precise pixel width or specific hex code). You don't need inline styles!

Use \`[value]\`.

* \`w-[342px]\` -> \`width: 342px;\`
* \`bg-[#bada55]\` -> \`background-color: #bada55;\`
* \`top-[17%]\` -> \`top: 17%;\`

## Transforms & Animations

* \`hover:scale-110\`: Zoom in
* \`hover:-rotate-3\`: Tilted
* \`animate-bounce\`: Bouncing arrow
* \`animate-pulse\`: Skeleton loading state
`,
      code_examples: [
        {
          title: 'Glassmorphism Card',
          code: `<div class="relative flex items-center justify-center min-h-[400px] bg-gradient-to-br from-purple-500 to-pink-500">
  
  <div class="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
  <div class="absolute bottom-10 right-10 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

  <div class="relative bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl rounded-2xl p-8 max-w-sm text-white">
    <h2 class="text-2xl font-bold mb-2">Glass Effect</h2>
    <p class="text-white/80">
      This card uses bg-white/20 and backdrop-blur-lg to create a frosted glass look over the gradient background.
    </p>
    <button class="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg border border-white/40 transition">
      Explore
    </button>
  </div>

</div>`,
          explanation: 'Combines Gradients, Opacity modifiers (/20), Backdrop Blur, and Arbitrary values.'
        }
      ],
      common_mistakes: [
        {
          mistake: 'Using Arbitrary values for everything',
          why: 'w-[12px] p-[5px] m-[3px] destroys consistency',
          fix: 'Only use square brackets when the design requires exact pixel perfection that the scale cannot provide.'
        },
        {
          mistake: 'Forgetting backdrop-filter support',
          why: 'Old browsers might not support it',
          fix: 'Always provide a fallback background color opacity.'
        }
      ],
      resources: [],
      tasks: [
        {
          title: 'Create a Loading Skeleton',
          description: 'Build a "loading" state for a card using the animate-pulse utility.',
          instructions: `
1. Create a card structure (image area, title line, text lines).
2. Apply a gray background (bg-gray-300) to the "empty" areas.
3. Add 'animate-pulse' to the parent container.
4. Place it next to a finished card for comparison.
          `,
          starter_code: `<div class="border p-4 rounded-md shadow max-w-sm w-full mx-auto">
  </div>`,
          solution_code: `<div class="border border-blue-100 shadow rounded-md p-4 max-w-sm w-full mx-auto">
  <div class="animate-pulse flex space-x-4">
    <div class="rounded-full bg-slate-200 h-10 w-10"></div>
    <div class="flex-1 space-y-6 py-1">
      <div class="h-2 bg-slate-200 rounded"></div>
      <div class="space-y-3">
        <div class="grid grid-cols-3 gap-4">
          <div class="h-2 bg-slate-200 rounded col-span-2"></div>
          <div class="h-2 bg-slate-200 rounded col-span-1"></div>
        </div>
        <div class="h-2 bg-slate-200 rounded"></div>
      </div>
    </div>
  </div>
</div>`,
          estimated_time: 30,
          difficulty: 'intermediate'
        }
      ]
    },

    // DAY 29
    {
      day_number: 29,
      title: 'Modern Layout Tricks',
      objectives: [
        'Create Sticky Headers (position: sticky)',
        'Master Z-Index stacking contexts',
        'Handle overflow (scroll, hidden, truncate)',
        'Create a "Masonry" layout using columns',
        'Use "Peer" modifier for sibling interactions'
      ],
      duration_mins: 60,
      content: `
# Layout Mastery

## Sticky Positioning

Keep a nav bar at the top while scrolling.

\`\`\`html
<header class="sticky top-0 z-50 bg-white shadow-md">
  I stay at the top!
</header>
\`\`\`

## Overflow & Truncate

Text too long?
* \`overflow-hidden\`: Clips content.
* \`overflow-scroll\`: Adds scrollbars.
* \`truncate\`: Adds "..." automatically (shorthand for overflow:hidden, whitespace:nowrap, text-overflow:ellipsis).

\`\`\`html
<p class="truncate w-48">
  This is a very long sentence that will be cut off with dots.
</p>
\`\`\`

## Peer Modifier

Style an element based on the state of a *sibling* (like form validation).

\`\`\`html
<input type="email" class="peer border border-gray-300 p-2"/>
<p class="invisible peer-invalid:visible text-red-500">
  Please provide a valid email.
</p>
\`\`\`

## Masonry (CSS Columns)

Tailwind supports \`columns-2\` or \`columns-3\`. Great for Pinterest-style layouts where items have different heights.

\`\`\`html
<div class="columns-2 md:columns-3 gap-4 space-y-4">
  <img src="..." class="w-full rounded" />
  <img src="..." class="w-full rounded" />
  </div>
\`\`\`
`,
      code_examples: [
        {
          title: 'Sticky Header & Masonry Gallery',
          code: `<div class="relative">
  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b p-4 flex justify-between items-center">
    <div class="font-bold text-xl">My Gallery</div>
    <button class="bg-black text-white px-4 py-2 rounded-full">Upload</button>
  </header>

  <main class="p-4 max-w-4xl mx-auto">
    <div class="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
      <div class="bg-red-200 h-40 rounded-xl break-inside-avoid"></div>
      <div class="bg-blue-200 h-64 rounded-xl break-inside-avoid"></div>
      <div class="bg-green-200 h-32 rounded-xl break-inside-avoid"></div>
      <div class="bg-yellow-200 h-80 rounded-xl break-inside-avoid"></div>
      <div class="bg-purple-200 h-52 rounded-xl break-inside-avoid"></div>
      <div class="bg-pink-200 h-44 rounded-xl break-inside-avoid"></div>
    </div>
  </main>
</div>`,
          explanation: 'Sticky keeps the header visible. Columns create a masonry layout. Break-inside-avoid prevents boxes from being sliced in half across columns.'
        }
      ],
      common_mistakes: [
        {
          mistake: 'Sticky not working',
          why: 'Parent element has overflow:hidden',
          fix: 'Ensure no parent of the sticky element has overflow set.'
        },
        {
          mistake: 'Z-index fighting',
          why: 'Not establishing stacking contexts',
          fix: 'Use `isolate` or keep z-indexes simple (0, 10, 20, 50).'
        }
      ],
      resources: [],
      tasks: [
        {
          title: 'Floating Action Button (FAB)',
          description: 'Create a button that stays fixed in the bottom-right corner of the screen.',
          instructions: `
1. Create a long scrolling page (use a large height div).
2. Create a circular button with a shadow and icon (+).
3. Use 'fixed', 'bottom-8', 'right-8' to position it.
4. Add a hover effect that scales it up slightly.
          `,
          starter_code: `<body>
  <div class="h-[200vh] bg-gray-50"></div>
  
  <button> + </button>
</body>`,
          solution_code: `<button class="fixed bottom-8 right-8 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-3xl hover:bg-blue-700 hover:scale-110 hover:-translate-y-1 transition z-50">
  +
</button>`,
          estimated_time: 30,
          difficulty: 'beginner'
        }
      ]
    },

    // DAY 30
    {
      day_number: 30,
      title: 'Course Wrap-Up & Capstone Kickoff',
      objectives: [
        'Review key concepts from Weeks 1-6',
        'Analyze the Capstone Project requirements',
        'Plan the Capstone structure (Wireframing)',
        'Set up the development environment',
        'Celebration of progress!'
      ],
      duration_mins: 45,
      content: `
# Congratulations!

You have gone from zero CSS knowledge to building complex, responsive, modern interfaces with Tailwind CSS.

## The Journey
1.  **Basics:** Selectors, Colors, Fonts.
2.  **Box Model:** Margins, Padding, Borders.
3.  **Flexbox:** Alignment, Layouts.
4.  **Grid:** 2D Layouts.
5.  **Tailwind:** Utility-first workflow.
6.  **Advanced:** Polish, Animation, Config.

## The Final Challenge
It is time to prove your skills. The Capstone Project is a culmination of everything you have learned. It is not just about writing code; it's about building a **product**.
`,
      code_examples: [],
      common_mistakes: [],
      resources: [],
      tasks: [
        {
          title: 'Capstone Planning',
          description: 'Before coding, sketch your layout on paper or Excalidraw.',
          instructions: `
1. Read the Capstone requirements below.
2. Draw boxes for the Hero, Features, Pricing, and Footer sections.
3. Decide on your Color Palette (Primary, Secondary, Accent).
4. Decide on your Font Stack.
          `,
          estimated_time: 60,
          difficulty: 'planning'
        }
      ]
    }
  ],
  
  // FINAL CAPSTONE
  assignment: {
    title: 'Final Capstone: The SaaS Dashboard & Landing Page',
    description: 'Build a complete, multi-page responsive website for a fictional SaaS (Software as a Service) company named "RocketAnalytics".',
    requirements: [
      '**Page 1: Landing Page**',
      '- Sticky Navigation Bar (Logo, Links, CTA)',
      '- Hero Section (Headline, Subtext, Buttons, Image/Illustration)',
      '- Social Proof (Logos of companies using the tool - use grayscale filter)',
      '- Feature Grid (3 columns, icons, text)',
      '- Pricing Section (3 cards, middle one highlighted/scaled)',
      '- Footer (Links, Copyright, Newsletter input)',
      
      '**Page 2: App Dashboard (The Product)**',
      '- Sidebar Layout (Fixed on desktop, hidden on mobile with hamburger menu)',
      '- Top Header (Search bar, User Avatar with notification dot)',
      '- Stats Grid (4 cards showing numbers)',
      '- Main Content Area (Table with rows of data, status badges)',
      
      '**Technical Requirements**',
      '- Completely Responsive (Mobile, Tablet, Desktop)',
      '- Dark Mode support (using `dark:` classes)',
      '- Custom Color Palette defined in config',
      '- Use of `@apply` for buttons only',
      '- Hover and Focus states for all interactive elements',
      '- Clean semantic HTML'
    ],
    bonus_tasks: [
      'Add a simple JavaScript toggle for Dark Mode',
      'Add a chart using CSS Grid (bar chart) inside the dashboard',
      'Use `scroll-smooth` for anchor links on the landing page'
    ],
    estimated_time: 360, // 6 hours
    success_criteria: [
      'Project looks professional and "expensive"',
      'No horizontal scrolling issues on mobile',
      'Dashboard sidebar works correctly on all screen sizes',
      'Code is organized and legible'
    ]
  }
}

    // Additional weeks would continue here with similar structure
    // Week 3: Flexbox, Week 4: Grid, Week 5: Tailwind Basics, Week 6: Tailwind Advanced
  ]
};





















async function seedCSSTailwindCurriculum() {
  console.log('🌱 Starting CSS & Tailwind curriculum seed...');

  try {
    const existingCourse = await prisma.course.findUnique({
      where: { slug: cssCurriculumData.course.slug },
    });

    if (existingCourse) {
      console.log(`🗑️ Deleting existing course: ${cssCurriculumData.course.title}`);
      await prisma.course.delete({
        where: { slug: cssCurriculumData.course.slug },
      });
    }

    console.log(`📚 Creating course: ${cssCurriculumData.course.title}`);
    
    await prisma.course.create({
      data: {
        slug: cssCurriculumData.course.slug,
        title: cssCurriculumData.course.title,
        description: cssCurriculumData.course.description,
        durationWeeks: cssCurriculumData.course.duration_weeks,
        level: CourseLevel.BEGINNER,
        
        weeks: {
          create: cssCurriculumData.weeks.map((week, weekIndex) => ({
            weekNumber: week.week_number,
            title: week.title,
            description: week.description,
            objectives: week.objectives,
            order: weekIndex + 1,

            assignment: week.assignment ? {
              create: {
                title: week.assignment.title,
                description: week.assignment.description,
                requirements: week.assignment.requirements,
                bonusTasks: week.assignment.bonus_tasks,
                estimatedTime: week.assignment.estimated_time,
                successCriteria: week.assignment.success_criteria
              }
            } : undefined,

            lessons: {
              create: week.lessons.map((lesson, lessonIndex) => ({
                dayNumber: lesson.day_number,
                title: lesson.title,
                objectives: lesson.objectives,
                durationMins: lesson.duration_mins,
                content: lesson.content,
                order: lessonIndex + 1,

                codeExamples: {
                  create: lesson.code_examples?.map(ex => ({
                    title: ex.title,
                    code: ex.code,
                    explanation: ex.explanation
                  })) || []
                },

                commonMistakes: {
                  create: lesson.common_mistakes?.map(mistake => ({
                    mistake: mistake.mistake,
                    why: mistake.why,
                    fix: mistake.fix
                  })) || []
                },

                resources: {
                  create: lesson.resources?.map(res => ({
                    title: res.title,
                    url: res.url,
                    type: res.type
                  })) || []
                },

                tasks: {
                  create: lesson.tasks?.map((task, taskIndex) => ({
                    title: task.title,
                    description: task.description,
                    instructions: task.instructions,
                    starterCode: (task as any).starter_code || null,
                    solutionCode: (task as any).solution_code || null,
                    estimatedTime: task.estimated_time,
                    difficulty: task.difficulty === 'beginner' ? 'EASY' :
                              task.difficulty === 'intermediate' ? 'MEDIUM' : 'HARD',
                    order: taskIndex + 1
                  })) || []
                }
              }))
            }
          }))
        }
      }
    });

    console.log('✅ CSS & Tailwind curriculum seed completed successfully');
  } catch (error) {
    console.error('❌ Error seeding CSS & Tailwind curriculum:', error);
    throw error;
  }
}

export { seedCSSTailwindCurriculum, cssCurriculumData };

if (require.main === module) {
  seedCSSTailwindCurriculum()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}