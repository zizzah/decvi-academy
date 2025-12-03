const mergedStylingCurriculum = {
  course: {
    slug: 'modern-styling-mastery',
    title: 'Modern CSS & Tailwind Mastery',
    description:
      'A complete 4-week styling curriculum that teaches students everything from core CSS fundamentals to modern Tailwind CSS workflows, applied directly to real-world Next.js projects.',
    duration_weeks: 4,

    weeks: [
      // -------------------------------------------------------------
      // WEEK 1 — CSS FOUNDATIONS
      // -------------------------------------------------------------
      {
        week: 1,
        title: 'CSS Fundamentals & Core Styling Concepts',
        description:
          'Students learn foundational CSS concepts including selectors, the cascade, the box model, typography, colors, spacing, and units. By the end of the week, they will be able to style simple components confidently.',

        lessons: [
          {
            title: 'Introduction to CSS & How Browsers Render Styles',
            content: [
              'What CSS is and how it works in web development',
              'How browsers apply styles (CSSOM + Render Tree basics)',
              'Inline vs Internal vs External CSS',
              'How to properly link CSS files',
              'Writing your first CSS ruleset'
            ]
          },
          {
            title: 'Selectors, Cascade, Specificity & Inheritance',
            content: [
              'Understanding type, class, ID, and attribute selectors',
              'Pseudo classes (:hover, :focus, :active)',
              'Pseudo elements (::before, ::after)',
              'Cascade layers and specificity ranking',
              'How inheritance works (and when it does not)',
              'Best practices for writing maintainable CSS'
            ]
          },
          {
            title: 'CSS Box Model, Borders, Spacing & Display',
            content: [
              'Margin vs padding vs borders',
              'Content box vs border box',
              'Block vs inline vs inline-block elements',
              'Using box-sizing: border-box everywhere',
              'Visual demos to reinforce the box model'
            ]
          },
          {
            title: 'Units, Typography & Colors',
            content: [
              'Absolute units (px) vs relative units (rem, em, %)',
              'When to use rem vs em',
              'Fluid typography basics',
              'Color systems: hex, rgb, hsl',
              'Line-height, letter-spacing, font-weight'
            ]
          }
        ],

        assignments: [
          {
            title: 'Assignment 1: Style Your First Component',
            tasks: [
              'Create a card component using HTML + CSS',
              'Apply margins, padding, borders',
              'Change typography (font-size, weight, color)',
              'Add hover states using pseudo-classes'
            ],
            expected_skill:
              'Students demonstrate understanding of the box model, selectors, and fundamental styling.'
          },
          {
            title: 'Assignment 2: Build a Simple Landing Section',
            tasks: [
              'Create a hero section with a heading, subtext, and button',
              'Apply spacing consistently using rem',
              'Add a hover animation to the button',
              'Use colors and typography intentionally'
            ],
            expected_skill:
              'Students begin thinking in structured layout and spacing principles.'
          }
        ]
      },

      // -------------------------------------------------------------
      // WEEK 2 — INTERMEDIATE CSS + FLEXBOX + GRID
      // -------------------------------------------------------------
      {
        week: 2,
        title: 'Layouts, Positioning, Flexbox & Grid',
        description:
          'Students learn how to build modern layouts using Flexbox, CSS Grid, and helper techniques for arranging content. They master responsive design fundamentals and media queries.',

        lessons: [
          {
            title: 'CSS Positioning & Layout Flow',
            content: [
              'Static, relative, absolute, and fixed positioning',
              'When to use z-index (and when not to)',
              'Understanding stacking contexts',
              'Practical use cases for each positioning mode'
            ]
          },
          {
            title: 'Mastering Flexbox',
            content: [
              'Flex direction, justify-content, align-items',
              'Flex-wrap and gap',
              'Building navbars, cards, and centered layouts',
              'Common flexbox patterns for real UI'
            ]
          },
          {
            title: 'CSS Grid Essentials',
            content: [
              'Defining rows & columns',
              'Grid template areas',
              'Gap, auto-fit, auto-fill',
              'Two-dimensional layouts for dashboards and galleries'
            ]
          },
          {
            title: 'Responsive CSS & Media Queries',
            content: [
              'Mobile-first vs desktop-first',
              'Breakpoints and best practices',
              'Fluid layouts using %, vw, minmax(), repeat()',
              'Scaling typography responsively'
            ]
          }
        ],

        assignments: [
          {
            title: 'Assignment 3: Recreate a Popular Website Layout',
            tasks: [
              'Choose a simple website (YouTube, Airbnb, Stripe homepage)',
              'Recreate the header, layout, cards using Flexbox or Grid',
              'Make it responsive with media queries'
            ],
            expected_skill:
              'Students master real-world layout techniques.'
          },
          {
            title: 'Assignment 4: Build a Responsive Multi-Section Page',
            tasks: [
              'Header + hero + features + footer',
              'Use flexbox and grid appropriately',
              'Make the page responsive at 2–3 breakpoints'
            ],
            expected_skill:
              'Students become comfortable structuring full-page layouts.'
          }
        ]
      },

      // -------------------------------------------------------------
      // WEEK 3 — TAILWIND INTRO & FUNDAMENTALS
      // -------------------------------------------------------------
      {
        week: 3,
        title: 'Introduction to Tailwind CSS & Utility-First Styling',
        description:
          'Students transition from raw CSS to Tailwind, learning how utility-first styling works and how to build professional UIs rapidly.',

        lessons: [
          {
            title: 'Installing Tailwind in a Next.js Project',
            content: [
              'Setting up a fresh Next.js app',
              'Installing Tailwind via npm',
              'Configuring tailwind.config.js',
              'Creating global styles & understanding @tailwind directives'
            ]
          },
          {
            title: 'Tailwind Utility System Deep Dive',
            content: [
              'Spacing, colors, fonts, borders',
              'How classes map directly to CSS rules',
              'Responsiveness using breakpoints (sm, md, lg, xl)',
              'Dark mode handling'
            ]
          },
          {
            title: 'Styling Components With Tailwind',
            content: [
              'Buttons, cards, navbars, input fields',
              'Using hover:, focus:, active:, disabled:',
              'Transitions & animations with Tailwind utilities',
              'Best practices for readability'
            ]
          },
          {
            title: 'Tailwind Layout Techniques',
            content: [
              'Flexbox utilities in Tailwind',
              'Grid utilities in Tailwind',
              'Building responsive layouts faster with utility classes',
              'Container & screens configuration'
            ]
          }
        ],

        assignments: [
          {
            title: 'Assignment 5: Convert Previous CSS Components to Tailwind',
            tasks: [
              'Take your CSS card, hero, or navbar',
              'Rebuild it using Tailwind utilities',
              'Refactor layout with Tailwind flex/grid classes'
            ],
            expected_skill:
              'Students begin thinking in utility-first design.'
          },
          {
            title: 'Assignment 6: Build a Tailwind UI Kit',
            tasks: [
              'Create buttons (3 types), cards (2 versions), input fields, badges',
              'Make all components responsive',
              'Document them in a simple components page'
            ],
            expected_skill:
              'Students have a component system they can reuse in projects.'
          }
        ]
      },

      // -------------------------------------------------------------
      // WEEK 4 — ADVANCED TAILwind + REAL PROJECT
      // -------------------------------------------------------------
      {
        week: 4,
        title: 'Advanced Tailwind Concepts & Component Architectures',
        description:
          'Students learn how to build production-ready designs using Tailwind, organize classes cleanly, extract components, and use Tailwind plugins. They finish with a real project.',

        lessons: [
          {
            title: 'Tailwind Best Practices & Class Organization',
            content: [
              'How to avoid long unreadable class lists',
              'Using @apply for component extraction',
              'Extracting reusable components with React',
              'The “partial abstraction” rule'
            ]
          },
          {
            title: 'Customizing Tailwind Config',
            content: [
              'Theme extension: fonts, colors, spacing',
              'Adding custom animations',
              'Creating brand color palettes',
              'Custom screens & container settings'
            ]
          },
          {
            title: 'Using Tailwind Plugins',
            content: [
              '@tailwind/forms, @tailwind/typography, @tailwind/aspect-ratio',
              'When to use plugins vs custom CSS'
            ]
          },
          {
            title: 'Building a Small Real-World UI in Next.js',
            content: [
              'Page layouts with Tailwind',
              'Reusable components',
              'Dark mode toggle',
              'Deployment prep'
            ]
          }
        ],

        assignments: [
          {
            title: 'Assignment 7: Build a Fully Styled Multi-Page UI',
            tasks: [
              'Home page + dashboard + profile page',
              'Use advanced Tailwind utilities',
              'Add dark mode support',
              'Create a small design system using @apply'
            ],
            expected_skill:
              'Students confidently build full UIs in Tailwind.'
          },
          {
            title: 'Final Project: Tailwind-Powered Mini Web App',
            tasks: [
              'Students choose a simple SaaS/dashboard/e-commerce idea',
              'Design the entire frontend with Tailwind',
              'Use responsive design and custom themes',
              'Submit GitHub repo + live deployment'
            ],
            expected_skill:
              'Students can style real applications professionally.'
          }
        ]
      }
    ]
  }
};

export default mergedStylingCurriculum;
