// prisma/seeds/html-curriculum-seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * HTML Curriculum Seed Data
 * 4-week comprehensive HTML course for absolute beginners
 */

const htmlCurriculumData = {
  course: {
    slug: 'html-for-beginners',
    title: 'HTML Mastery Bootcamp',
    description: 'A comprehensive 4-week curriculum designed to take absolute beginners from zero coding experience to building fully functional multi-page websites.',
    duration_weeks: 4,
    difficulty: 'beginner',
  },

  weeks: [
    // ============================================
    // WEEK 1: HTML Fundamentals & Document Structure
    // ============================================
    {
      week_number: 1,
      title: 'HTML Fundamentals & Document Structure',
      description: 'Master the foundational concepts of HTML, understand how browsers work, and create your first valid HTML documents.',
      objectives: [
        'Understand what HTML is and its role in web development',
        'Learn the basic structure of HTML documents',
        'Create valid HTML5 pages from scratch',
        'Use essential HTML tags and attributes',
        'Preview and validate HTML in browsers'
      ],
      lessons: [
        // DAY 1
        {
          day_number: 1,
          title: 'Introduction to HTML & The Structure of a Webpage',
          objectives: [
            'Explain what HTML is and how it works',
            'Understand how browsers interpret HTML',
            'Create your first valid HTML document from scratch',
            'Use essential boilerplate structure (DOCTYPE, html, head, body)',
            'Open and preview an HTML file in your browser'
          ],
          duration_mins: 45,
          content: `
# What is HTML?

HTML stands for **HyperText Markup Language** — the basic language used to structure all web pages.

## The House Analogy

Think of a website like a house:
- **HTML** = the building blocks (walls, rooms, foundation)
- **CSS** = the paint, decoration
- **JavaScript** = the electricity that makes things interactive

## HTML Tags - The Containers

HTML uses **tags** (like containers) to organize content:

\`\`\`html
<p>This is a paragraph</p>
\`\`\`

Tags usually come in pairs:
- Opening tag: \`<p>\`
- Content: \`This is a paragraph\`
- Closing tag: \`</p>\`

## How Browsers Work

A browser (Chrome, Safari, Firefox) reads your HTML file line by line and builds a visual page. It's like following a recipe to bake a cake!

## The HTML Document Structure

Every webpage is built on the same foundation — like the human skeleton:
- **Head** (information about the page)
- **Body** (visible content)



### The Essential Structure

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My First Webpage</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is my first HTML page.</p>
</body>
</html>
\`\`\`
          `,
          code_examples: [
            {
              title: 'Your First HTML File',
              code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My First Webpage</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is my first HTML page.</p>
</body>
</html>`,
              explanation: 'This is the minimal structure every HTML page needs. The DOCTYPE declares HTML5, head contains metadata, and body contains visible content.'
            }
          ],
          common_mistakes: [
            {
              mistake: 'Forgetting closing tags',
              why: 'Breaks page structure and can cause display issues',
              fix: 'Always use closing tags: <p>Content</p>'
            },
            {
              mistake: 'Using capital letters for tags',
              why: 'While HTML is forgiving, it creates inconsistency',
              fix: 'Keep everything lowercase: <body> not <BODY>'
            },
            {
              mistake: 'Missing <!DOCTYPE html>',
              why: 'Browser may switch to quirks mode',
              fix: 'Always include it as the first line'
            }
          ],
          resources: [
            {
              title: 'MDN: What is HTML',
              url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
              type: 'documentation'
            }
          ],
          tasks: [
            {
              title: 'Create Your First HTML Page',
              description: 'Build a simple "About Me" page using the HTML structure you learned today.',
              instructions: `
1. Create a new file named \`about-me.html\`
2. Set up the basic HTML structure (DOCTYPE, html, head, body)
3. Add a title to your page
4. Inside the body, add:
   - An \`<h1>\` with your name
   - A \`<p>\` with a sentence about what you want to learn
   - Another \`<p>\` with a fun fact about yourself
5. Save the file and open it in your browser
              `,
              starter_code: `<!DOCTYPE html>
<html lang="en">
<head>
  <title></title>
</head>
<body>
</body>
</html>`,
              solution_code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>About John</title>
</head>
<body>
  <h1>John Doe</h1>
  <p>I am learning HTML.</p>
</body>
</html>`,
              estimated_time: 30,
              difficulty: 'beginner'
            }
          ]
        },
        // DAY 2
        {
          day_number: 2,
          title: 'HTML Head Section & Meta Tags',
          objectives: [
            'Understand the purpose of the <head> section',
            'Use meta tags for character encoding and viewport',
            'Add page titles and descriptions',
            'Link external resources (CSS, fonts)',
            'Understand the importance of SEO metadata'
          ],
          duration_mins: 45,
          content: `
# The HTML Head Section

The \`<head>\` section is like the control center of your webpage — it contains information **about** your page, not content that visitors see.

## Essential Meta Tags

### 1. Viewport Meta Tag
\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
\`\`\`
This makes your website responsive on mobile devices. **Essential for modern web development!**

### 2. Page Title
\`\`\`html
<title>HTML Basics - Learn Web Development</title>
\`\`\`
          `,
          code_examples: [
            {
              title: 'Complete Head Section',
              code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="A beginner-friendly guide to HTML">
  <title>HTML Tutorial - Day 2</title>
</head>
<body>
  <h1>Content goes here</h1>
</body>
</html>`,
              explanation: 'A properly structured head section with all essential meta tags.'
            }
          ],
          common_mistakes: [
            {
              mistake: 'Forgetting the viewport meta tag',
              why: 'Makes your site look zoomed out on mobile devices',
              fix: 'Always include: <meta name="viewport" content="width=device-width, initial-scale=1.0">'
            }
          ],
          resources: [],
          tasks: [
            {
              title: 'Build a Professional Head Section',
              description: 'Create an HTML page with a complete, SEO-optimized head section',
              instructions: 'Create a file named my-portfolio.html and add all standard meta tags.',
              estimated_time: 30,
              difficulty: 'beginner'
            }
          ]
        },
        // DAY 3
        {
          day_number: 3,
          title: 'Headings and Text Hierarchy',
          objectives: [
            'Use heading tags (h1-h6) correctly',
            'Understand heading hierarchy and accessibility',
            'Create proper document outlines'
          ],
          duration_mins: 45,
          content: `
# HTML Headings

Headings are like the chapter titles in a book.

## The Six Heading Levels
\`\`\`html
<h1>Main Title (Only one per page)</h1>
<h2>Major Section</h2>
<h3>Sub-section</h3>
\`\`\`
          `,
          code_examples: [],
          common_mistakes: [
            {
              mistake: 'Multiple h1 tags',
              why: 'Confuses search engines',
              fix: 'Use only one h1 per page'
            }
          ],
          resources: [],
          tasks: [
            {
              title: 'Create a Blog Structure',
              description: 'Write a blog post structure using h1 through h4 tags correctly.',
              instructions: 'Pick a topic and write an outline using headings.',
              estimated_time: 25,
              difficulty: 'beginner'
            }
          ]
        },
        // DAY 4
        {
          day_number: 4,
          title: 'Paragraphs and Text Formatting',
          objectives: [
            'Create paragraphs with <p> tags',
            'Apply basic text formatting (bold, italic)',
            'Understand semantic vs presentational markup'
          ],
          duration_mins: 45,
          content: `
# Text Formatting

## Semantic Tags (Preferred)
- \`<strong>\` - **Important text** (bold)
- \`<em>\` - *Emphasized text* (italic)

## Paragraphs
Always wrap text blocks in \`<p>\` tags.
          `,
          code_examples: [],
          common_mistakes: [],
          resources: [],
          tasks: [
            {
              title: 'Format a News Article',
              description: 'Take plain text and apply HTML formatting.',
              instructions: 'Use p, strong, em, and hr tags to format a raw text file.',
              estimated_time: 30,
              difficulty: 'beginner'
            }
          ]
        },
        // DAY 5
        {
          day_number: 5,
          title: 'HTML Comments and Code Organization',
          objectives: [
            'Write HTML comments',
            'Organize code with proper indentation',
            'Comment out code for debugging'
          ],
          duration_mins: 30,
          content: `
# Comments
Comments are for humans, not computers.

\`\`\`html
<p>Visible content</p>
\`\`\`
          `,
          code_examples: [],
          common_mistakes: [],
          resources: [],
          tasks: [
            {
              title: 'Cleanup Code',
              description: 'Refactor messy code with proper indentation and comments.',
              instructions: 'Fix the indentation of the provided messy HTML file.',
              estimated_time: 20,
              difficulty: 'beginner'
            }
          ]
        }
      ],
      assignment: {
        title: 'Week 1 Mini-Project: Personal Profile Page',
        description: 'Create a complete personal profile page using everything learned in Week 1',
        requirements: [
          'Valid HTML5 document structure',
          'Complete head section',
          'Proper heading hierarchy (h1-h3)',
          'Text formatting with semantic tags',
          'Clean indentation'
        ],
        bonus_tasks: ['Add a "fun facts" section with a horizontal rule'],
        estimated_time: 120,
        success_criteria: ['HTML validates without errors', 'Code is clean']
      }
    },

    // ============================================
    // WEEK 2: Text Content, Links & Media Elements
    // ============================================
    {
      week_number: 2,
      title: 'Text Content, Links & Media Elements',
      description: 'Learn to create hyperlinks, embed images and videos, and work with lists to make your content interactive and engaging.',
      objectives: [
        'Create internal and external hyperlinks',
        'Embed and optimize images',
        'Work with ordered and unordered lists',
        'Embed videos and audio'
      ],
      lessons: [
        // DAY 6
        {
          day_number: 6,
          title: 'Anchors & Hyperlinks',
          objectives: ['Understand the anchor <a> tag', 'Create external links to other websites', 'Create internal links to other pages'],
          duration_mins: 45,
          content: `
# Connecting the Web

The "HyperText" in HTML refers to links. The anchor tag \`<a>\` is used to create links.

## The HREF Attribute
\`href\` stands for **Hypertext Reference**.

\`\`\`html
<a href="https://google.com">Go to Google</a>
\`\`\`

## Opening in New Tabs
Use \`target="_blank"\` to open a link in a new tab.
          `,
          code_examples: [{ title: 'Link Types', code: '<a href="about.html">Internal Link</a>\n<a href="https://google.com">External Link</a>', explanation: 'Difference between local files and web URLs' }],
          common_mistakes: [{ mistake: 'Missing href attribute', why: 'Link wont go anywhere', fix: 'Always add href="..."' }],
          resources: [],
          tasks: [{ title: 'Create a Navigation Menu', description: 'Create a list of links to different websites.', instructions: 'Create 5 links to your favorite sites.', estimated_time: 30, difficulty: 'beginner' }]
        },
        // DAY 7
        {
          day_number: 7,
          title: 'File Paths & Folder Structure',
          objectives: ['Understand relative vs absolute paths', 'Navigate folders with ./ and ../'],
          duration_mins: 50,
          content: `
# Where is my file?

Understanding file paths is crucial for linking pages and images.

- \`./\` = Current folder
- \`../\` = Go up one folder
- \`folder/file.html\` = Go down into a folder


          `,
          code_examples: [],
          common_mistakes: [],
          resources: [],
          tasks: [{ title: 'Fix Broken Links', description: 'Given a complex folder structure, write the correct paths.', instructions: 'Link index.html to pages/about.html', estimated_time: 40, difficulty: 'intermediate' }]
        },
        // DAY 8
        {
          day_number: 8,
          title: 'Images & Alt Text',
          objectives: ['Embed images with <img>', 'Use alt text for accessibility', 'Control image size attributes'],
          duration_mins: 45,
          content: `
# Adding Images

The \`<img>\` tag is self-closing (void).

\`\`\`html
<img src="cat.jpg" alt="A cute orange cat" width="300">
\`\`\`

## Alt Text
**Always** include \`alt\` text. It describes the image for screen readers and search engines.
          `,
          code_examples: [],
          common_mistakes: [{ mistake: 'Missing alt text', why: 'Bad for accessibility', fix: 'Always describe the image' }],
          resources: [],
          tasks: [{ title: 'Create a Photo Gallery', description: 'Display 3 images with proper alt text.', instructions: 'Find 3 images online and display them.', estimated_time: 30, difficulty: 'beginner' }]
        },
        // DAY 9
        {
          day_number: 9,
          title: 'Lists (Ordered & Unordered)',
          objectives: ['Create bullet points <ul>', 'Create numbered lists <ol>', 'Nest lists inside lists'],
          duration_mins: 40,
          content: `
# Organizing Data with Lists

## Unordered Lists (Bullets)
Used when order doesn't matter (e.g., shopping list).
\`\`\`html
<ul>
  <li>Milk</li>
  <li>Eggs</li>
</ul>
\`\`\`

## Ordered Lists (Numbers)
Used when sequence matters (e.g., recipes).
\`\`\`html
<ol>
  <li>Mix flour</li>
  <li>Bake cake</li>
</ol>
\`\`\`
          `,
          code_examples: [],
          common_mistakes: [{ mistake: 'Text outside <li>', why: 'Invalid HTML', fix: 'All content in a list must be inside <li> tags' }],
          resources: [],
          tasks: [{ title: 'Build a Resume', description: 'Use lists to show skills and education.', instructions: 'Use UL for skills and OL for education history.', estimated_time: 35, difficulty: 'beginner' }]
        },
        // DAY 10
        {
          day_number: 10,
          title: 'Multimedia: Audio & Video',
          objectives: ['Embed video files', 'Embed audio files', 'Use controls attribute'],
          duration_mins: 45,
          content: `
# Modern Media

HTML5 makes it easy to add media without plugins.

\`\`\`html
<video src="movie.mp4" controls width="500"></video>
<audio src="song.mp3" controls></audio>
\`\`\`

The \`controls\` attribute gives the user play/pause buttons.
          `,
          code_examples: [],
          common_mistakes: [],
          resources: [],
          tasks: [{ title: 'Media Player Page', description: 'Embed a video and an audio file.', instructions: 'Create a page that plays a sample video.', estimated_time: 30, difficulty: 'beginner' }]
        }
      ],
      assignment: {
        title: 'Week 2 Mini-Project: The Hobby Site',
        description: 'Create a multi-page website about a hobby.',
        requirements: ['3 linked pages (Home, Gallery, About)', 'Navigation menu on all pages', 'At least 5 images with alt text', 'Use of lists'],
        bonus_tasks: ['Embed a YouTube video', 'Use folder structure for images'],
        estimated_time: 150,
        success_criteria: ['All links work', 'Images load correctly']
      }
    },

    // ============================================
    // WEEK 3: Forms, Tables & Semantic HTML
    // ============================================
    {
      week_number: 3,
      title: 'Forms, Tables & Semantic HTML',
      description: 'Learn how to collect user input with forms, display data in tables, and structure your code using modern semantic elements.',
      objectives: [
        'Build data tables',
        'Create interactive forms',
        'Use semantic containers (div, span, header, footer)',
        'Understand block vs inline elements'
      ],
      lessons: [
        // DAY 11
        {
          day_number: 11,
          title: 'Tables for Data',
          objectives: ['Create tables with tr, td, th', 'Understand when NOT to use tables (layout)'],
          duration_mins: 50,
          content: `
# HTML Tables

Tables are for **data**, not layout.

\`\`\`html
<table>
  <tr>
    <th>Name</th>
    <th>Age</th>
  </tr>
  <tr>
    <td>Alice</td>
    <td>25</td>
  </tr>
</table>
\`\`\`
          `,
          code_examples: [],
          common_mistakes: [],
          resources: [],
          tasks: [{ title: 'TV Schedule', description: 'Create a TV guide using a table.', instructions: 'Rows for channels, columns for time slots.', estimated_time: 40, difficulty: 'intermediate' }]
        },
        // DAY 12
        {
          day_number: 12,
          title: 'Forms & Inputs (Part 1)',
          objectives: ['Create a <form>', 'Use text inputs', 'Use labels correctly'],
          duration_mins: 50,
          content: `
# Collecting User Input

The \`<form>\` element wraps all inputs.

## The Input Tag
\`\`\`html
<label for="fname">First Name:</label>
<input type="text" id="fname" name="fname">
\`\`\`

**Note:** Always match the label's \`for\` attribute with the input's \`id\`.
          `,
          code_examples: [],
          common_mistakes: [{ mistake: 'Missing name attribute', why: 'Server receives no data', fix: 'Inputs need a name attribute' }],
          resources: [],
          tasks: [{ title: 'Newsletter Signup', description: 'Create a simple email signup form.', instructions: 'Ask for Name and Email.', estimated_time: 30, difficulty: 'beginner' }]
        },
        // DAY 13
        {
          day_number: 13,
          title: 'Forms & Inputs (Part 2)',
          objectives: ['Use checkboxes and radio buttons', 'Use dropdown selects', 'Use textareas'],
          duration_mins: 50,
          content: `
# Advanced Inputs

- **Radio:** Select one option (gender, yes/no).
- **Checkbox:** Select multiple options.
- **Select:** Dropdown menu.
- **Textarea:** Multi-line text (messages).

\`\`\`html
<textarea rows="4"></textarea>
\`\`\`
          `,
          code_examples: [],
          common_mistakes: [],
          resources: [],
          tasks: [{ title: 'Pizza Order Form', description: 'Create a complex order form.', instructions: 'Use radios for size, checkboxes for toppings.', estimated_time: 45, difficulty: 'intermediate' }]
        },
        // DAY 14
        {
          day_number: 14,
          title: 'Block vs Inline & Divs',
          objectives: ['Understand the <div> container', 'Understand <span>', 'Differentiate block and inline elements'],
          duration_mins: 45,
          content: `
# Containers

## Block Elements (<div>)
They take up the full width and start a new line. Used for grouping sections.

## Inline Elements (<span>)
They only take up necessary width. Used for styling text inside a paragraph.


          `,
          code_examples: [],
          common_mistakes: [],
          resources: [],
          tasks: [{ title: 'Group Content', description: 'Use divs to group article sections.', instructions: 'Refactor a flat page into logical sections.', estimated_time: 30, difficulty: 'beginner' }]
        },
        // DAY 15
        {
          day_number: 15,
          title: 'Semantic HTML Structure',
          objectives: ['Use header, nav, main, footer', 'Use article and section', 'Understand why semantics matter'],
          duration_mins: 45,
          content: `
# Semantic HTML

Don't just use divs! Use tags that describe the content.

- \`<header>\`: Top of page
- \`<nav>\`: Navigation links
- \`<main>\`: Primary content
- \`<footer>\` Bottom info

This helps screen readers and SEO.
          `,
          code_examples: [],
          common_mistakes: [{ mistake: 'Using div for everything', why: 'Poor accessibility', fix: 'Use semantic tags where possible' }],
          resources: [],
          tasks: [{ title: 'Refactor Layout', description: 'Update a div-heavy layout to use semantic tags.', instructions: 'Replace <div id="header"> with <header>.', estimated_time: 35, difficulty: 'intermediate' }]
        }
      ],
      assignment: {
        title: 'Week 3 Mini-Project: Contact Page',
        description: 'Build a functional Contact Me page.',
        requirements: ['Semantic layout (Header/Main/Footer)', 'A working form with various inputs', 'A table showing availability'],
        bonus_tasks: ['Use a placeholder for form submission'],
        estimated_time: 120,
        success_criteria: ['Labels are connected to inputs', 'Table is structured correctly']
      }
    },

    // ============================================
    // WEEK 4: Best Practices & Final Project
    // ============================================
    {
      week_number: 4,
      title: 'Best Practices, Accessibility & Final Project',
      description: 'Polish your skills with SEO, accessibility standards, and build your final portfolio website.',
      objectives: [
        'Implement SEO meta tags',
        'Audit for accessibility (ARIA)',
        'Validate code',
        'Plan and deploy a final project'
      ],
      lessons: [
        // DAY 16
        {
          day_number: 16,
          title: 'Social Meta Tags & Open Graph',
          objectives: ['Understand Open Graph tags', 'Make links look good on social media'],
          duration_mins: 40,
          content: `
# Sharing on Social Media

When you share a link on Twitter or Facebook, how does it know what image to show? **Meta Tags.**

\`\`\`html
<meta property="og:title" content="My Portfolio">
<meta property="og:image" content="me.jpg">
\`\`\`
          `,
          code_examples: [],
          common_mistakes: [],
          resources: [],
          tasks: [{ title: 'Add Social Tags', description: 'Add Open Graph tags to your portfolio.', instructions: 'Make your site ready for sharing.', estimated_time: 30, difficulty: 'beginner' }]
        },
        // DAY 17
        {
          day_number: 17,
          title: 'Web Accessibility (A11y)',
          objectives: ['Understand ARIA labels', 'Ensure keyboard navigation', 'Check color contrast'],
          duration_mins: 50,
          content: `
# Web for Everyone

Accessibility means making sure people with disabilities can use your site.

1. **Alt Text:** For screen readers.
2. **Keyboard Nav:** Can you use the site without a mouse?
3. **Labels:** All forms must have labels.
          `,
          code_examples: [],
          common_mistakes: [],
          resources: [],
          tasks: [{ title: 'Accessibility Audit', description: 'Check your forms and images.', instructions: 'Fix any missing alt tags or labels.', estimated_time: 40, difficulty: 'intermediate' }]
        },
        // DAY 18
        {
          day_number: 18,
          title: 'Validation & Code Quality',
          objectives: ['Use the W3C Validator', 'Fix parsing errors', 'Format code consistently'],
          duration_mins: 40,
          content: `
# Validating Code

Browsers are forgiving, but invalid code causes bugs. Use the **W3C Validator** to check your work.

Common errors:
- Unclosed tags
- Duplicate IDs
- Nesting errors
          `,
          code_examples: [],
          common_mistakes: [],
          resources: [{ title: 'W3C Validator', url: 'https://validator.w3.org/', type: 'tool' }],
          tasks: [{ title: 'Validate Your Portfolio', description: 'Run your code through W3C.', instructions: 'Achieve 0 errors.', estimated_time: 30, difficulty: 'beginner' }]
        },
        // DAY 19
        {
          day_number: 19,
          title: 'Project Planning & Wireframing',
          objectives: ['Plan file structure', 'Sketch layouts (Wireframing)', 'Prepare assets'],
          duration_mins: 60,
          content: `
# Planning Before Coding

Don't just start typing!
1. **Sketch:** Draw your layout on paper.
2. **Structure:** Create folders (css, images, pages).
3. **Gather:** Get your text and photos ready.
          `,
          code_examples: [],
          common_mistakes: [],
          resources: [],
          tasks: [{ title: 'Project Blueprint', description: 'Draw the wireframe for your final site.', instructions: 'Sketch Home, About, and Contact pages.', estimated_time: 45, difficulty: 'beginner' }]
        },
        // DAY 20
        {
          day_number: 20,
          title: 'Deployment & GitHub',
          objectives: ['Understand hosting', 'Introduction to Netlify/Vercel', 'Go live'],
          duration_mins: 60,
          content: `
# Going Live!

Your website lives on your computer (localhost). Let's put it on the internet.

We will use **Netlify Drop** or **GitHub Pages**. These are free services for static HTML sites.
          `,
          code_examples: [],
          common_mistakes: [],
          resources: [],
          tasks: [{ title: 'Deploy Your Site', description: 'Upload your folder to Netlify.', instructions: 'Get a public URL to share with friends.', estimated_time: 30, difficulty: 'beginner' }]
        }
      ],
      assignment: {
        title: 'Week 4 Project: Final Portfolio',
        description: 'Build and deploy your personal developer portfolio.',
        requirements: ['Home, About, Work, Contact pages', 'Fully semantic and accessible', 'Validated code', 'Deployed to a live URL'],
        bonus_tasks: ['Add a "Hire Me" button', 'Link to your real resume'],
        estimated_time: 240,
        success_criteria: ['Site is live on the internet', 'Looks professional']
      }
    }
  ]
};

/**
 * Seed the HTML curriculum into the database
 */
async function seedHTMLCurriculum() {
  console.log('🌱 Starting HTML curriculum seed...');

  try {
    // 1. Delete existing course to allow re-seeding without unique constraint errors
    const existingCourse = await prisma.course.findUnique({
      where: { slug: htmlCurriculumData.course.slug },
    });

    if (existingCourse) {
      console.log(`🗑️  Deleting existing course: ${htmlCurriculumData.course.title}`);
      await prisma.course.delete({
        where: { slug: htmlCurriculumData.course.slug },
      });
    }

    // 2. Create the full curriculum with nested writes
    console.log(`📝 Creating course: ${htmlCurriculumData.course.title}`);
    
    await prisma.course.create({
      data: {
        slug: htmlCurriculumData.course.slug,
        title: htmlCurriculumData.course.title,
        description: htmlCurriculumData.course.description,
        durationWeeks: htmlCurriculumData.course.duration_weeks,
        difficulty: htmlCurriculumData.course.difficulty,
        
        weeks: {
          create: htmlCurriculumData.weeks.map(week => ({
            weekNumber: week.week_number,
            title: week.title,
            description: week.description,
            objectives: week.objectives,
            
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
              create: week.lessons.map(lesson => ({
                dayNumber: lesson.day_number,
                title: lesson.title,
                objectives: lesson.objectives,
                durationMins: lesson.duration_mins,
                content: lesson.content,
                
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
                  create: lesson.tasks?.map(task => ({
                    title: task.title,
                    description: task.description,
                    instructions: task.instructions,
                    starterCode: task.starter_code,
                    solutionCode: task.solution_code,
                    estimatedTime: task.estimated_time,
                    difficulty: task.difficulty
                  })) || []
                }
              }))
            }
          }))
        }
      }
    });

    console.log('✅ HTML curriculum seed completed successfully');
  } catch (error) {
    console.error('❌ Error seeding HTML curriculum:', error);
    throw error;
  }
}

export { seedHTMLCurriculum, htmlCurriculumData };

if (require.main === module) {
  seedHTMLCurriculum()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}