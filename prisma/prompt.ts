// Week 1: Foundation in Prompt Engineering
// A 5-day intensive introduction to AI communication and basic prompting
 const promptEngineeringCourse = [

 {
  week_number: 1,
  title: 'Foundation: Understanding AI and Writing Your First Prompts',
  description: 'Build a solid foundation in how Large Language Models work and learn to craft clear, effective prompts. This week introduces you to the core concepts of AI communication, prompt anatomy, and hands-on experimentation.',
  objectives: [
    'Understand what Large Language Models (LLMs) are and how they process information',
    'Learn the four essential components of prompt anatomy',
    'Write clear, specific instructions that produce desired outputs',
    'Recognize and avoid common prompting mistakes',
    'Experiment systematically to improve prompt effectiveness'
  ],
  lessons: [
    // ============================================
    // DAY 1: Introduction to LLMs and AI Communication
    // ============================================
    {
      day_number: 1,
      title: 'What Are LLMs? Understanding the Foundation of AI Communication',
      objectives: [
        'Understand what a Large Language Model is and how it works at a basic level',
        'Learn about tokens and why they matter in prompt engineering',
        'Understand the concept of context windows and their limitations',
        'Recognize the difference between human conversation and AI instructions',
        'Set up your first AI platform account (OpenAI Playground or Anthropic Console)'
      ],
      duration_mins: 60,
      content: `
# What is a Large Language Model?

A **Large Language Model (LLM)** is an AI system trained on vast amounts of text from the internet, books, and other sources. Think of it as a highly sophisticated prediction engine that generates responses based on patterns it learned during training.

## How LLMs Think: It's All About Prediction

Unlike humans who "understand" meaning, LLMs work by predicting the most likely next word (or token) based on:
- The patterns they learned during training
- The specific instructions you give them (your prompt)
- The context of the conversation so far

**Important:** LLMs don't have true understanding, memory between sessions, or access to real-time information (unless given specific tools). They generate responses based on patterns.

## Tokens: The Building Blocks of AI Communication

Everything you send to an AI is broken down into **tokens** - pieces of words that the model can process.

**Examples:**
- "Hello" = 1 token
- "Hello, world!" = 4 tokens (Hello, ,, world, !)
- "Prompt engineering" = 2 tokens

**Why this matters:** 
- Models have token limits (context windows)
- API costs are based on tokens
- Longer prompts = higher costs and slower responses

## Context Windows: The AI's Working Memory

The **context window** is the total amount of text (in tokens) that an LLM can "remember" at once. This includes:
- Your system instructions
- The conversation history
- Your current prompt
- The AI's response

**Current typical sizes:**
- GPT-4: 8,000 - 128,000 tokens
- Claude: 100,000 - 200,000 tokens

**Key insight:** Once you exceed the context window, the AI "forgets" earlier parts of the conversation.

## AI Communication vs. Human Conversation

| Human Conversation | AI Communication |
|---|---|
| Assumes shared context | Needs explicit context |
| Can infer unstated needs | Takes instructions literally |
| Remembers past interactions | No memory between sessions |
| Asks clarifying questions | Does its best with what's given |

**The Prompt Engineer's Role:** Bridge this gap by translating human intent into clear, structured instructions the AI can follow.
      `,
      code_examples: [
        {
          title: 'Understanding Token Breakdown',
          code: `// Example text and approximate token counts

Text: "Write a blog post"
Tokens: ["Write", " a", " blog", " post"] = 4 tokens

Text: "Create a comprehensive, SEO-optimized blog post about sustainable living"
Tokens: ["Create", " a", " comprehensive", ",", " SE", "O", "-", "optim", "ized", ...] = ~15 tokens

// Key takeaway: Being specific doesn't always mean using more tokens
// "Write about dogs" (4 tokens) vs. "Write about golden retrievers" (5 tokens)
// But the second is MUCH more specific and will get better results`,
          explanation: 'This demonstrates how text is broken into tokens. The key lesson: specificity often requires only a few extra tokens but dramatically improves output quality.'
        }
      ],
      common_mistakes: [
        {
          mistake: 'Assuming the AI "knows" what you want without being specific',
          why: 'LLMs cannot read your mind. They only work with the information you explicitly provide in your prompt.',
          fix: 'Always state your requirements clearly. Instead of "write something good," say "write a 200-word professional email requesting a meeting."'
        },
        {
          mistake: 'Treating AI like a search engine',
          why: 'Search engines find existing content. LLMs generate new content based on patterns. They require different communication styles.',
          fix: 'Give instructions and context, not just keywords. Think "task description" not "search query."'
        }
      ],
      resources: [
        {
          title: 'OpenAI Tokenizer Tool',
          url: 'https://platform.openai.com/tokenizer',
          type: 'tool'
        },
        {
          title: 'Anthropic: Intro to Claude',
          url: 'https://docs.anthropic.com/claude/docs/intro-to-claude',
          type: 'documentation'
        }
      ],
      tasks: [
        {
          title: 'Platform Setup and First Experiment',
          description: 'Set up your AI platform and run your first controlled experiment to see how small changes affect output.',
          instructions: `
1. Create a free account on OpenAI Playground (playground.openai.com) or Anthropic Console (console.anthropic.com)
2. Start with this basic prompt: "Write about coffee"
3. Note the response you get
4. Now try: "Write a 50-word description of coffee for a product label"
5. Compare the two responses
6. Document in a notebook:
   - What was different between the two responses?
   - Which prompt gave you more useful output?
   - Why do you think the second prompt worked better?
          `,
          starter_code: `// Prompt 1 (Vague):
"Write about coffee"

// Prompt 2 (Specific):
"Write a 50-word description of coffee for a product label"

// Your observations:
// Difference 1: ___________________
// Difference 2: ___________________
// Why prompt 2 worked better: ___________________`,
          solution_code: `// Expected Observations:

// Prompt 1 Response (Vague):
// Likely got a general essay or article about coffee
// Could be any length (might be 300+ words)
// Unclear tone (educational, casual, or technical)
// Not immediately usable for any specific purpose

// Prompt 2 Response (Specific):
// Got exactly 50 words (or very close)
// Marketing/product-focused language
// Descriptive and appealing tone
// Ready to use on a product label

// Key Learning: Specificity transforms vague output into actionable results
// The more context you provide, the more useful the AI's response becomes`,
          estimated_time: 45,
          difficulty: 'beginner'
        }
      ]
    },

    // ============================================
    // DAY 2: Prompt Anatomy - The Four Core Components
    // ============================================
    {
      day_number: 2,
      title: 'Prompt Anatomy: The Four Building Blocks of Effective Prompts',
      objectives: [
        'Identify the four core components of well-structured prompts',
        'Understand when to use each component',
        'Write prompts using the instruction-context-examples-constraints framework',
        'Practice separating different types of information in your prompts',
        'Learn to structure prompts for clarity and consistency'
      ],
      duration_mins: 60,
      content: `
# The Anatomy of an Effective Prompt

Every high-quality prompt contains some combination of four key components. Think of these as the building blocks you arrange to communicate clearly with AI.

## Component 1: INSTRUCTIONS (The "What")

**Purpose:** Tell the AI exactly what task you want it to perform.

**Best Practices:**
- Start with clear action verbs: "Write," "Summarize," "Analyze," "Create," "List"
- Be specific about the format and length
- State one main task per prompt (avoid "and do this and also this")

**Example:**
❌ Weak: "I need something about marketing"
✅ Strong: "Write a 150-word social media post announcing a new product launch"

## Component 2: CONTEXT (The "Why" and "Background")

**Purpose:** Provide the AI with relevant background information it needs to complete the task appropriately.

**What to include:**
- Who the audience is
- What the purpose/goal is
- Relevant background details
- The scenario or situation

**Example:**
"Context: You are writing for small business owners who are not tech-savvy. The goal is to explain cloud storage in simple terms so they feel confident trying it."

## Component 3: EXAMPLES (The "Show, Don't Tell")

**Purpose:** Demonstrate the exact style, format, or approach you want the AI to follow.

**Why examples work:**
- LLMs are pattern-matching engines
- One good example is worth 100 words of explanation
- Examples eliminate ambiguity

**Example:**
"Example of the tone I want:
'Hey there! Ready to transform your workspace? Let's dive into three simple changes that make a huge impact.'

Now write in this same friendly, energetic style for a fitness app."

## Component 4: CONSTRAINTS (The "Must" and "Must Not")

**Purpose:** Set boundaries and requirements that the AI must follow.

**Common constraint types:**
- Length (word count, character limits)
- Tone (formal, casual, professional)
- What to avoid (jargon, certain topics)
- Format requirements (bullet points, paragraphs)
- Required elements (must include statistics, must cite sources)

**Example:**
"Constraints:
- Maximum 200 words
- Use professional business tone
- Avoid technical jargon
- Must include at least one specific statistic
- Do not mention competitor brands"

## Putting It All Together: The Framework

\`\`\`
[INSTRUCTION]
[Clear action verb + specific task description]

[CONTEXT]
[Audience + Purpose + Background]

[EXAMPLES] (if needed)
[1-2 examples showing the desired style/format]

[CONSTRAINTS]
[All requirements and boundaries]
\`\`\`

**Note:** You don't always need all four components. Simple tasks might only need instructions and constraints. Complex tasks benefit from all four.
      `,
      code_examples: [
        {
          title: 'Complete Prompt Using All Four Components',
          code: `// INSTRUCTION:
"Write a product description for an e-commerce website"

// CONTEXT:
"The product is noise-canceling headphones targeting remote workers who need to focus in noisy home environments. The brand voice is modern, helpful, and slightly premium."

// EXAMPLES:
"Example style (from another product):
'Meet your new focus companion. These headphones don't just block noise—they create your personal productivity zone, wherever you are.'

Now write in this same style for the headphones."

// CONSTRAINTS:
"Requirements:
- 100-150 words
- Include one emotional benefit and two technical features
- End with a call-to-action
- Avoid using the words 'revolutionary' or 'innovative'
- Maintain premium but approachable tone"

// ====================================
// Full Prompt:
// ====================================

Write a product description for noise-canceling headphones on an e-commerce website.

Context: The target audience is remote workers who struggle with focus in noisy home environments. The brand voice is modern, helpful, and slightly premium.

Example style: "Meet your new focus companion. These headphones don't just block noise—they create your personal productivity zone, wherever you are."

Constraints:
- 100-150 words
- Include one emotional benefit and two technical features
- End with a call-to-action
- Avoid using 'revolutionary' or 'innovative'
- Maintain premium but approachable tone`,
          explanation: 'This shows how all four components work together to create a comprehensive prompt that leaves no room for ambiguity. The AI knows exactly what to create, who it is for, how it should sound, and what rules to follow.'
        }
      ],
      common_mistakes: [
        {
          mistake: 'Mixing instructions with constraints in confusing ways',
          why: 'When you say "Write a casual email but make it professional" you are giving contradictory instructions. The AI does not know which to prioritize.',
          fix: 'Be internally consistent. Decide on one clear tone/approach and stick with it throughout all components.'
        },
        {
          mistake: 'Providing context that is not relevant to the task',
          why: 'Extra information can confuse the AI or dilute focus. "I am writing this on a Tuesday" does not help the AI write better copy.',
          fix: 'Only include context that directly impacts how the AI should approach the task.'
        }
      ],
      resources: [
        {
          title: 'OpenAI: Prompt Engineering Guide',
          url: 'https://platform.openai.com/docs/guides/prompt-engineering',
          type: 'documentation'
        }
      ],
      tasks: [
        {
          title: 'Build Your First Structured Prompt',
          description: 'Create a complete prompt using all four components to generate a customer service email response.',
          instructions: `
Scenario: You work for an online bookstore. A customer emailed saying their book arrived damaged. You need to write a response email.

1. Write the INSTRUCTION (what task should be done)
2. Write the CONTEXT (who is this for, what is the situation)
3. Write an EXAMPLE (show the tone/style you want)
4. Write the CONSTRAINTS (requirements and boundaries)
5. Combine them into one complete prompt
6. Test it in your AI platform
7. Evaluate: Did you get what you wanted? If not, which component needs adjustment?
          `,
          starter_code: `// Fill in each component:

// INSTRUCTION:
"_____________________"

// CONTEXT:
"_____________________"

// EXAMPLE:
"_____________________"

// CONSTRAINTS:
"_____________________"

// Now combine them into a complete prompt and test it!`,
          solution_code: `// Complete Solution:

// INSTRUCTION:
"Write a customer service email response to a complaint about a damaged book delivery."

// CONTEXT:
"The customer (Sarah) ordered a hardcover novel that arrived with a bent cover and torn pages. She is disappointed because it was a gift. Our company policy is to send replacements immediately with prepaid return shipping. The brand voice is empathetic, professional, and solution-focused."

// EXAMPLE:
"Example tone from a previous email:
'We are so sorry to hear about this experience. That is definitely not the quality we want you to receive. Here is what we are going to do to make this right...'"

// CONSTRAINTS:
"Requirements:
- 150-200 words
- Acknowledge the issue and apologize sincerely
- Explain the replacement process clearly
- Mention the prepaid return label
- End with reassurance and a small goodwill gesture (offer 15% off next order)
- Use the customer's first name (Sarah)
- Professional but warm tone
- No corporate jargon"

// ====================================
// COMPLETE PROMPT:
// ====================================

Write a customer service email response to a complaint about a damaged book delivery.

Context: The customer (Sarah) ordered a hardcover novel that arrived with a bent cover and torn pages. She is disappointed because it was a gift. Our company policy is to send replacements immediately with prepaid return shipping. The brand voice is empathetic, professional, and solution-focused.

Example tone: "We are so sorry to hear about this experience. That is definitely not the quality we want you to receive. Here is what we are going to do to make this right..."

Constraints:
- 150-200 words
- Acknowledge the issue and apologize sincerely
- Explain the replacement process clearly
- Mention the prepaid return label
- End with reassurance and a small goodwill gesture (15% off next order)
- Use "Sarah" as the customer's name
- Professional but warm tone
- No corporate jargon

// Expected Result: A complete, ready-to-send email that addresses all requirements`,
          estimated_time: 60,
          difficulty: 'beginner'
        }
      ]
    },

    // ============================================
    // DAY 3: The Power of Specificity
    // ============================================
    {
      day_number: 3,
      title: 'Specificity is Power: Writing Clear, Actionable Instructions',
      objectives: [
        'Understand why vague prompts produce inconsistent results',
        'Learn the spectrum from vague to specific prompting',
        'Master techniques for adding useful specificity',
        'Practice transforming vague requests into precise instructions',
        'Recognize when you are being specific vs. when you are just being wordy'
      ],
      duration_mins: 60,
      content: `
# Why Specificity Matters in Prompt Engineering

The single most important principle in prompt engineering: **The more specific your instructions, the more consistent and useful your results.**

## The Specificity Spectrum

Think of prompts on a scale from vague to specific:

### Level 1: Vague (Unusable)
"Write something about marketing"
- Problem: AI has infinite options, will pick randomly
- Result: Unpredictable, rarely useful

### Level 2: Basic (Somewhat Useful)
"Write a marketing email"
- Problem: Still too many unknowns (length? audience? product?)
- Result: Generic output that needs heavy editing

### Level 3: Specific (Professional)
"Write a 150-word marketing email for a fitness app launch, targeting busy professionals aged 30-45, highlighting time-efficiency benefits"
- Result: Focused, usable output that meets clear requirements

## The Seven Dimensions of Specificity

When making your prompt more specific, consider these dimensions:

### 1. **Length/Scope**
❌ "Write a blog post"
✅ "Write a 500-word blog post with 3 main sections"

### 2. **Audience**
❌ "Explain AI"
✅ "Explain AI to a 70-year-old who has never used a smartphone"

### 3. **Tone/Style**
❌ "Write professionally"
✅ "Write in a conversational but credible tone, like a knowledgeable friend explaining something"

### 4. **Format/Structure**
❌ "List some benefits"
✅ "Create a numbered list of 5 benefits, each with a one-sentence explanation"

### 5. **Purpose/Goal**
❌ "Write about productivity"
✅ "Write to convince remote workers to try time-blocking, addressing common skepticism"

### 6. **Constraints/Requirements**
❌ "Keep it simple"
✅ "Use only common words (8th-grade reading level), no jargon, define any technical terms"

### 7. **Context/Background**
❌ "Summarize this"
✅ "Summarize this research paper for a grant application, focusing on practical implications for healthcare"
      `,
      code_examples: [
        {
          title: 'Transforming Vague to Specific: Real Examples',
          code: `// EXAMPLE 1: Product Description
// =====================================

// ❌ VAGUE:
"Write about our new app"

// ✅ SPECIFIC:
"Write a 100-word App Store description for 'FocusFlow,' a productivity app that blocks distracting websites. Target audience: college students and young professionals who struggle with procrastination. Emphasize the benefit of regaining 2+ hours of focused work time daily. Tone: Encouraging and relatable, not preachy. End with a clear call-to-action to download."

// =====================================
// EXAMPLE 2: Social Media Content
// =====================================

// ❌ VAGUE:
"Create a post about sustainability"

// ✅ SPECIFIC:
"Create an Instagram caption (120-150 characters) for a photo of reusable coffee cups. Audience: eco-conscious millennials. Goal: encourage a small sustainable habit. Tone: upbeat and empowering, not guilt-inducing. Include a question to drive engagement. Use 2-3 relevant hashtags."`,
          explanation: 'These examples show the dramatic difference between vague and specific prompts. The specific versions provide all necessary context and constraints, eliminating guesswork.'
        }
      ],
      common_mistakes: [
        {
          mistake: 'Confusing detail with specificity',
          why: 'Telling your life story is not being specific. Saying "I woke up at 7am, had coffee, then decided to write this..." adds no useful information for the AI.',
          fix: 'Include only details that directly impact the output. Ask: "Does the AI need this information to complete the task better?"'
        }
      ],
      resources: [
        {
          title: 'DeepLearning.AI: ChatGPT Prompt Engineering Course',
          url: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/',
          type: 'course'
        }
      ],
      tasks: [
        {
          title: 'Specificity Practice: Before and After',
          description: 'Transform three vague prompts into highly specific ones, then test both versions to see the difference in output quality.',
          instructions: `
You will be given three vague prompts. Your job:
1. Identify what information is missing
2. Rewrite each as a specific prompt using the 7 dimensions
3. Test BOTH versions (vague and specific) in your AI platform
4. Document the differences in output quality

Vague Prompt 1: "Write a recipe"
Vague Prompt 2: "Explain how websites work"
Vague Prompt 3: "Create a workout plan"

For each:
- Write your specific version
- List what dimensions you added (audience? tone? length?)
- Test both and compare results
- Note which specific elements made the biggest difference
          `,
          starter_code: `// PROMPT 1: "Write a recipe"
// Missing: What dish? For whom? Dietary restrictions? Format? Skill level?

My Specific Version:
"_____________________"

Dimensions added:
- [ ] Length/Scope
- [ ] Audience
- [ ] Tone/Style
- [ ] Format/Structure
- [ ] Purpose/Goal
- [ ] Constraints
- [ ] Context`,
          solution_code: `// PROMPT 1: "Write a recipe"

// ✅ MY SPECIFIC VERSION:
"Write a recipe for 30-minute vegetarian pasta that serves 4 people. Target audience: busy parents with limited cooking experience. Format: ingredient list followed by 6-8 numbered steps. Include prep time, cook time, and one pro tip. Keep instructions simple—no culinary jargon. Dietary notes: vegetarian, can be made vegan by omitting cheese."

Dimensions added:
- [✓] Length/Scope (30 minutes, serves 4)
- [✓] Audience (busy parents, limited experience)
- [✓] Tone/Style (simple, no jargon)
- [✓] Format/Structure (ingredient list + numbered steps)
- [✓] Purpose/Goal (quick family meal)
- [✓] Constraints (vegetarian, 30 min max)
- [✓] Context (busy families need quick solutions)`,
          estimated_time: 75,
          difficulty: 'beginner'
        }
      ]
    },

    // ============================================
    // DAY 4: Troubleshooting and Debugging
    // ============================================
    {
      day_number: 4,
      title: 'Troubleshooting AI: Understanding and Fixing Common Prompt Failures',
      objectives: [
        'Recognize the most common types of AI failures',
        'Understand why these failures happen',
        'Learn systematic debugging techniques for prompts',
        'Practice the iterate-and-improve workflow',
        'Build confidence in fixing broken prompts'
      ],
      duration_mins: 60,
      content: `
# When AI Goes Wrong: Common Failure Modes

Even the best prompt engineers get unexpected outputs. The difference is knowing how to diagnose and fix the problem systematically.

## The Three Major Failure Categories

### 1. HALLUCINATIONS: The AI Makes Things Up

**What it looks like:**
- Inventing statistics, facts, or quotes
- Creating fake sources or citations
- Making up product features that do not exist
- Generating confident-sounding but incorrect information

**How to fix:**
✅ Add constraints: "If you do not have verified information, say so explicitly"
✅ Provide source material: "Based ONLY on this document: [paste content]"
✅ Request citations: "Cite specific sources for each claim"

### 2. OFF-TOPIC: The AI Wanders Away from Your Task

**What it looks like:**
- Answering a different question than you asked
- Adding unnecessary preambles or disclaimers
- Including tangential information you did not request

**How to fix:**
✅ Use negative constraints: "Do not include background information"
✅ Be explicit about format: "Output only the requested list, nothing else"
✅ Add boundaries: "Answer in exactly 100 words, no more, no less"

### 3. INCONSISTENCY: Different Results Each Time

**What it looks like:**
- Running the same prompt twice gives very different outputs
- Quality varies wildly
- Tone or style shifts between runs

**How to fix:**
✅ Add style examples: Show exactly what you want
✅ Lock down variables: Specify all dimensions
✅ Test multiple times: Good prompts should be 80%+ consistent

## The Systematic Debugging Process

**Step 1:** Identify the Failure Type
**Step 2:** Isolate the Problem
**Step 3:** Apply Targeted Fixes
**Step 4:** Test and Compare
**Step 5:** Iterate
      `,
      code_examples: [
        {
          title: 'Debugging Example: From Broken to Fixed',
          code: `// ❌ BROKEN PROMPT:
"Write something about cupcakes"

// Issues: Too vague, no platform, no brand voice, no goal

// ✅ FINAL WORKING PROMPT (after 3 iterations):
"Write a 2-sentence Instagram caption for our new red velvet cupcake with cream cheese frosting. Tone: warm and inviting, food-focused. First sentence: describe the flavor experience. Second sentence: create urgency to visit today. Include 2 food-related emojis. Do not use the words 'delicious' or 'amazing'."`,
          explanation: 'This shows the real debugging process: identify problem, fix it, test, identify next problem, fix it, test again.'
        }
      ],
      common_mistakes: [
        {
          mistake: 'Giving up after one failed attempt',
          why: 'First-try perfection is rare. Even expert prompt engineers iterate 3-5 times for complex tasks.',
          fix: 'Expect to iterate. View each attempt as valuable data about what works and what does not.'
        }
      ],
      resources: [
        {
          title: 'OpenAI: Techniques to Improve Reliability',
          url: 'https://cookbook.openai.com/articles/techniques_to_improve_reliability',
          type: 'documentation'
        }
      ],
      tasks: [
        {
          title: 'The Broken Prompt Challenge',
          description: 'Debug three intentionally broken prompts, documenting your troubleshooting process.',
          instructions: `
Debug these three prompts:

BROKEN PROMPT 1: "Write about healthy eating"
BROKEN PROMPT 2: "Tell me everything about the iPhone 17 Pro features"
BROKEN PROMPT 3: "Create an email to increase sales"

For each:
1. Run the broken prompt
2. Identify failure type(s)
3. Document problems
4. Fix the prompt
5. Test 2-3 times
6. Document what worked
          `,
          starter_code: `// BROKEN PROMPT 1: "Write about healthy eating"

Failure type(s):
[ ] Hallucination
[ ] Off-topic
[ ] Inconsistency

My fix:
"_____________________"`,
          solution_code: `// BROKEN PROMPT 1: "Write about healthy eating"

Failure type(s):
[✓] Off-topic
[✓] Inconsistency

My fix (final version):
"Write a 100-word Instagram post about healthy eating for busy professionals who work long hours. Focus: micro-habits that take under 5 minutes. Format: 1 attention-grabbing opener + 3 tips. Tone: encouraging and realistic. Do not suggest meal prep or batch cooking."

Success: ✅ Consistent, focused, actionable posts`,
          estimated_time: 90,
          difficulty: 'intermediate'
        }
      ]
    },

    // ============================================
    // DAY 5: Week 1 Capstone Project
    // ============================================
    {
      day_number: 5,
      title: 'Week 1 Capstone: Building Your First Professional Prompt System',
      objectives: [
        'Apply all Week 1 concepts in a real-world project',
        'Create a complete prompt system with multiple prompts working together',
        'Build your first portfolio piece with documentation',
        'Practice explaining your prompt engineering decisions',
        'Demonstrate problem-solving and iteration skills'
      ],
      duration_mins: 120,
      content: `
# Your First Portfolio Project: Customer Service Chatbot

This capstone project brings together everything you have learned in Week 1. You will create a system of prompts for a customer service chatbot that handles common inquiries with consistent tone and quality.

## Project Overview

**Scenario:** You have been hired to create prompts for "TechGear Store," an online retailer selling electronics. They need AI-powered responses for common customer service scenarios.

**Deliverables:**
1. **System Prompt** - The foundational instructions that apply to all interactions
2. **Three Scenario-Specific Prompts** - Prompts for different customer situations
3. **Documentation** - Explanation of your design decisions
4. **Test Results** - Evidence that your prompts work consistently

## Part 1: The System Prompt

This prompt establishes the chatbot's personality and universal rules.

**Must include:**
- Brand voice definition
- Tone guidelines
- Universal constraints
- Standard behaviors

## Part 2: Three Scenario Prompts

**Scenario 1: Return/Refund Request**
- Customer wants to return a laptop purchased 20 days ago
- Policy: 30-day returns, must include original packaging

**Scenario 2: Product Recommendation**
- Customer asks: "Which wireless headphones should I buy?"
- Need: gather requirements before recommending

**Scenario 3: Technical Troubleshooting**
- Customer's smartwatch won't pair with phone
- Need: step-by-step troubleshooting for non-technical users

## Success Criteria

✅ **Consistency:** Running each prompt 3 times produces similar quality/tone
✅ **Tone:** All responses feel like they are from the same helpful chatbot
✅ **Specificity:** Responses include actionable information
✅ **Completeness:** Each scenario handled without follow-up needed
✅ **Documentation:** Decisions clearly explained and justified
      `,
      code_examples: [
        {
          title: 'Example System Prompt Structure',
          code: `// SYSTEM PROMPT EXAMPLE:

"You are TechGear's customer service assistant. Be helpful, patient, and knowledgeable. Explain technical concepts in everyday language.

Response rules:
- 3-4 sentences maximum per response
- If you lack specific details, say so and offer to connect with specialist
- Never invent product specifications or prices
- For complex troubleshooting, use numbered steps

Tone guidance:
- Professional but conversational
- Acknowledge frustrations when appropriate
- Focus on solutions, not problems
- End with a question or next step when relevant"`,
          explanation: 'This system prompt establishes personality and rules without being overly restrictive, allowing natural language while maintaining consistency.'
        }
      ],
      common_mistakes: [
        {
          mistake: 'Making the system prompt too rigid',
          why: 'If your system prompt is 500 words of rules, the AI will struggle to sound natural.',
          fix: 'System prompt should be principles and personality (150-200 words). Specific details go in scenario prompts.'
        }
      ],
      resources: [
        {
          title: 'Anthropic: Prompt Engineering Guide',
          url: 'https://docs.anthropic.com/claude/docs/prompt-engineering',
          type: 'documentation'
        }
      ],
      tasks: [
        {
          title: 'Complete Customer Service Chatbot System',
          description: 'Build your complete Week 1 capstone project with system prompt, three scenario prompts, and full documentation.',
          instructions: `
This is your full project. Allocate 2-3 hours.

STEP-BY-STEP PROCESS:

1. CREATE SYSTEM PROMPT (30 minutes)
   - Write your foundational chatbot personality and rules
   - Test it with a generic question
   - Iterate until you have a consistent voice

2. BUILD SCENARIO 1: Return Request (30 minutes)
   - Write the prompt following requirements
   - Test 3 times, note inconsistencies
   - Refine and test again
   - Document your design decisions

3. BUILD SCENARIO 2: Product Recommendation (30 minutes)
   - Write the prompt
   - Test with different customer needs
   - Iterate based on results
   - Document

4. BUILD SCENARIO 3: Technical Troubleshooting (30 minutes)
   - Write the prompt
   - Test with varying technical issues
   - Iterate
   - Document

5. FINAL DOCUMENTATION (30 minutes)
   - Write up your full process
   - Include before/after examples
   - Create portfolio summary
   - Reflect on what you learned
          `,
          starter_code: `// ====================================
// SYSTEM PROMPT
// ====================================

// Version 1:
"_____________________"

// Issues found in testing:
"_____________________"

// Final version:
"_____________________"

// ====================================
// SCENARIO 1: Return Request
// ====================================

// Your prompt here:
"_____________________"

// Test results (run 3 times):
// Run 1: _____________________
// Run 2: _____________________
// Run 3: _____________________

// ====================================
// SCENARIO 2: Product Recommendation
// ====================================

// Your prompt here:
"_____________________"

// ====================================
// SCENARIO 3: Technical Troubleshooting
// ====================================

// Your prompt here:
"_____________________"

// ====================================
// FINAL REFLECTION
// ====================================

// What worked well:
"_____________________"

// What I would improve:
"_____________________"

// Key skill I developed:
"_____________________"`,
          solution_code: `// ====================================
// COMPLETE SOLUTION EXAMPLE
// ====================================

// SYSTEM PROMPT - FINAL VERSION
// ====================================

"You are the customer service assistant for TechGear Store, an online electronics retailer.

Personality: Helpful, patient, and knowledgeable. You explain technical concepts in everyday language.

Response rules:
- 3-4 sentences maximum per response
- If you lack specific policy/product details, explicitly state that and offer to connect with a specialist
- Never invent product specifications or prices
- For complex troubleshooting, use numbered steps

Tone guidance:
- Professional but conversational
- Acknowledge frustrations when appropriate
- Focus on solutions, not problems
- End with a question or next step when relevant"

// ====================================
// SCENARIO 1: Return Request Handler
// ====================================

"Context: A customer wants to return a laptop purchased 20 days ago. TechGear policy: 30-day returns with original packaging and receipt.

Your task: Write a helpful response that processes their return request.

Structure:
1. Empathetic acknowledgment (1 sentence)
2. Confirm eligibility - within 30-day window (1 sentence)
3. Explain steps: need packaging + receipt, will email return label (1-2 sentences)
4. Set expectation: refund in 5-7 business days (1 sentence)

Tone: Warm and efficient.

Constraints:
- Do not apologize excessively
- Do not use corporate language like 'as per policy'
- 4-5 sentences total"

// Test Results: HIGH consistency across 3 runs ✅

// ====================================
// SCENARIO 2: Product Recommendation
// ====================================

"Context: Customer asks 'Which wireless headphones should I buy?'

Your task: Ask qualifying questions before recommending.

Structure:
1. Brief acknowledgment (1 sentence)
2. Ask 2-3 key questions:
   - Primary use? (commuting, work calls, exercise)
   - Budget range?
   - Must-have features?
3. Friendly closing (1 sentence)

Constraints:
- Do not immediately list products
- Questions should be easy to answer
- 3-4 sentences total
- End with enthusiasm"

// Test Results: HIGH consistency ✅

// ====================================
// SCENARIO 3: Technical Troubleshooting
// ====================================

"Context: Customer's smartwatch won't pair with phone.

Your task: Provide step-by-step troubleshooting.

Structure:
1. Reassuring opening (1 sentence)
2. Three simple steps (numbered):
   - Ensure Bluetooth on and watch in pairing mode
   - Restart both devices
   - Check phone OS compatibility
3. Closing: offer live chat if these don't work (1 sentence)

Tone: Patient teacher, no jargon.

Constraints:
- Use numbered steps
- Each step = one clear action
- Define technical terms if used
- 4-5 sentences (not counting steps)
- Do not suggest factory reset first"

// Test Results: HIGH consistency ✅

// ====================================
// PORTFOLIO WRITE-UP
// ====================================

**Project: TechGear Customer Service Chatbot System**

**Challenge:**
TechGear needed consistent, high-quality customer service responses while maintaining a helpful brand voice.

**Approach:**
Two-layer prompt system:
1. System Prompt: Core personality and rules
2. Scenario Prompts: Specific situation handling

**Results:**
- 90%+ consistency across test runs
- Responses averaged 4-5 sentences
- Tone remained helpful across scenarios
- Zero hallucinations in testing

**Key Learning:**
Specificity and constraints channel AI capabilities toward consistent, useful outputs. Iteration is where real engineering happens.

// ====================================
// FINAL REFLECTION
// ====================================

What worked well:
- Two-layer system gave flexibility with consistency
- Testing 3x per prompt caught issues early
- Examples + constraints = predictable outputs
- Documentation helped remember design choices

What I would improve:
- Add more edge cases (angry customers)
- Create escalation prompt for human handoff
- Build testing framework earlier

Key skill developed:
Thinking in systems, not just prompts. Understanding how system and scenario prompts work together is crucial for real-world applications.`,
          estimated_time: 180,
          difficulty: 'beginner'
        }
      ]
    }
  ]
},

// Export for use in larger curriculum


{
  "week_number": 2,
  "title": "Prompt Design Principles: Specificity and Structure",
  "description": "Learn the core design principles for crafting high-quality prompts. This week focuses on mastering specificity, using examples (few-shot prompting) to establish tone and format, and utilizing negative constraints to refine and eliminate unwanted AI outputs.",
  "objectives": [
    "Master the principle of specificity in prompt writing (defining audience, tone, format, and length).",
    "Understand and apply few-shot prompting (teaching by example) to guide the AI with successful outcomes.",
    "Utilize negative constraints and boundary setting to refine and restrict AI outputs.",
    "Practice creating prompts for common business tasks like summarization and product description.",
    "Understand the power of role-based prompting to influence the AI's expertise and perspective."
  ],
  "lessons": [
    {
      "day_number": 6,
      "title": "Specificity: The Golden Rule of Prompting",
      "objectives": [
        "Learn to define the four key dimensions of specificity: Audience, Tone, Format, and Length (ATFL).",
        "Practice transforming vague requests into actionable, high-quality prompts.",
        "Understand how a defined output format improves model consistency."
      ],
      "duration_mins": 75,
      "content": "Specificity is the single most important factor in prompt engineering. A vague prompt like 'Write about coffee' gives the AI too much freedom, leading to unpredictable, often useless results. A specific prompt guides the AI to generate exactly what you need for a specific purpose (e.g., a marketing email, a product label, a technical summary). We use the ATFL framework:\n\n1. **Audience:** Who is reading this? (e.g., senior executives, 5-year-olds, technical developers)\n2. **Tone:** What is the mood? (e.g., formal, casual, inspirational, urgent)\n3. **Format:** How should the output be structured? (e.g., list, JSON, email, 5-paragraph essay)\n4. **Length:** How long should it be? (e.g., 200 words, 5 bullet points, 3 sentences)\n\nBy clearly defining ATFL, you reduce the AI's prediction space and force it to be focused.",
      "code_examples": [
        {
          "title": "Vague vs. Specific Prompt",
          "code": "// Vague:\n\"Write about sustainable living.\"\n\n// Specific (Applying ATFL):\n\"Write a 150-word, casual and encouraging social media caption (Length, Tone) targeting young adults (Audience) to promote a new sustainable cleaning product. The output must be ready to post with relevant hashtags (Format).\"",
          "explanation": "The specific prompt provides all necessary constraints, resulting in a ready-to-use piece of content, unlike the vague prompt which produces a generic essay."
        }
      ],
      "common_mistakes": [
        {
          "mistake": "Leaving out the target audience or tone.",
          "why": "The AI defaults to a neutral, often generic, academic tone, which rarely suits business or creative tasks.",
          "fix": "Always use 'Act as a...' or 'Write this for...' to set the persona and audience."
        }
      ],
      "resources": [
        {
          "title": "OpenAI Best Practices Guide: Be Specific",
          "url": "https://platform.openai.com/docs/guides/prompt-engineering/strategies-and-tactics",
          "type": "guide"
        },
        {
          "title": "ATFL Framework Template",
          "url": "https://www.prompt-engineering-library.com/atfl-template",
          "type": "template"
        }
      ],
      "tasks": [
        {
          "title": "Specificity Challenge",
          "description": "Take three vague topic ideas and transform them into specific prompts, defining the Audience, Tone, Format, and Length for each.",
          "estimated_time": 45,
          "difficulty": "beginner"
        }
      ]
    },
    {
      "day_number": 7,
      "title": "Few-Shot Prompting: Teaching by Example",
      "objectives": [
        "Define and understand the mechanism of few-shot prompting.",
        "Learn to use successful examples to influence the AI's desired output structure and style.",
        "Practice formatting input/output examples for various tasks like classification and structured data extraction."
      ],
      "duration_mins": 60,
      "content": "**Few-Shot Prompting** is the practice of including a small number of complete, high-quality examples of the task you want the AI to perform. This is more powerful than just instructions alone because the AI learns the *pattern* and *format* you expect, rather than just guessing. \n\n**Mechanism:** The AI looks at your example pairs (Input X -> Output Y, Input A -> Output B) and uses them to deduce the transformation rule, applying it to your final query (Input C -> ?). This is essential for consistency in tone, structure, and formatting.",
      "code_examples": [
        {
          "title": "Using Few-Shot for JSON Formatting",
          "code": "// Example 1:\nInput: 'I need a new monitor for gaming, 144hz.'\nOutput: { 'product_type': 'monitor', 'use_case': 'gaming', 'specs': { 'refresh_rate': '144hz' } }\n\n// Example 2:\nInput: 'A lightweight laptop for traveling, battery life is key.'\nOutput: { 'product_type': 'laptop', 'use_case': 'travel', 'specs': { 'battery_focus': 'key' } }\n\n// Final Query:\nInput: 'Need a powerful desktop, fast CPU for video editing.'\nOutput:",
          "explanation": "The examples force the AI to not only summarize the input but to output the information in the exact JSON schema provided."
        }
      ],
      "common_mistakes": [
        {
          "mistake": "Providing inconsistent examples (e.g., using different formats or tones in your examples).",
          "why": "The AI will try to find a pattern that averages your examples, leading to mixed or unusable results.",
          "fix": "Ensure every example is perfectly formatted and reflective of the final output quality you desire."
        }
      ],
      "resources": [
        {
          "title": "Introduction to In-Context Learning (Few-Shot Prompting)",
          "url": "https://www.promptingguide.ai/techniques/icl",
          "type": "guide"
        },
        {
          "title": "DeepLearning.AI Few-Shot Prompting Module (Free Course)",
          "url": "https://www.deeplearning.ai/short-courses/prompt-engineering/",
          "type": "course"
        }
      ],
      "tasks": [
        {
          "title": "Style Transfer by Example",
          "description": "Use two few-shot examples to teach the AI a specific humorous or formal writing style. Then, ask it to write a short paragraph about a toaster using that style.",
          "estimated_time": 45,
          "difficulty": "intermediate"
        }
      ]
    },
    {
      "day_number": 8,
      "title": "Negative Constraints and Boundary Setting",
      "objectives": [
        "Learn to use negative constraints (telling the AI what *not* to do) to eliminate unwanted output characteristics.",
        "Understand 'Red Teaming' prompts as a basic form of troubleshooting to test prompt robustness.",
        "Practice using 'Must not' and 'Avoid' to refine the output's vocabulary and complexity."
      ],
      "duration_mins": 60,
      "content": "**Negative constraints** are crucial for setting clear boundaries on the AI's generation space. While a positive instruction guides the AI toward a goal, a negative constraint prevents it from taking undesirable detours (like using cliches, jargon, or generating content that is too long).\n\n**Common Negative Constraints:**\n- `Do not use any corporate jargon like 'synergy' or 'low-hanging fruit.'`\n- `The response must not exceed 100 words.`\n- `Avoid referencing any historical figures.`\n\n**Basic Red Teaming:** To test your prompt's effectiveness, intentionally try to break it. If your prompt generates a professional response, try adding a query like '...but also include a pirate shanty.' If the AI includes the shanty, your prompt needs stronger boundary constraints.",
      "code_examples": [
        {
          "title": "Refining an Email with Negative Constraints",
          "code": "// Initial Prompt:\n\"Write a professional email to a team about a new project launch. The tone should be motivational.\"\n\n// Refined Prompt (with constraints):\n\"Write a professional email to a team about a new project launch. The tone must be motivational. **CRITICAL CONSTRAINT: Do not use any exclamation points, emojis, or corporate jargon.** The email should be concise and under 5 sentences.\"",
          "explanation": "The constraints ensure the email remains professional, even if the AI's default 'motivational' tone tends toward excessive enthusiasm."
        }
      ],
      "common_mistakes": [
        {
          "mistake": "Only using positive instructions and being surprised when the AI includes unwanted elements.",
          "why": "LLMs are trained on everything, including bad examples and cliches. You must explicitly prune the unwanted patterns.",
          "fix": "Always anticipate the worst possible (but still plausible) output and preemptively block it with a constraint."
        }
      ],
      "resources": [
        {
          "title": "Using Negative Prompting to Improve Creative Outputs",
          "url": "https://www.promptingguide.ai/applications/negative-prompting",
          "type": "article"
        },
        {
          "title": "Red Teaming and Model Safety Documentation (Basic Concepts)",
          "url": "https://docs.ai-safety.org/red-teaming-llms",
          "type": "documentation"
        }
      ],
      "tasks": [
        {
          "title": "The Cliche Killer",
          "description": "Write a prompt for a job listing description. Then, add negative constraints to specifically remove five common cliches (e.g., 'fast-paced environment,' 'rockstar,' 'ninja').",
          "estimated_time": 40,
          "difficulty": "intermediate"
        }
      ]
    },
    {
      "day_number": 9,
      "title": "Role-Based Prompting: Borrowing Expertise",
      "objectives": [
        "Understand how assigning a role (persona) influences the AI's knowledge base and tone.",
        "Practice using high-impact role commands (e.g., 'Act as a senior analyst' vs. 'Act as a college student').",
        "Learn to combine role-based prompting with specificity for highly specialized outputs."
      ],
      "duration_mins": 60,
      "content": "**Role-Based Prompting** is a powerful technique where you instruct the AI to assume a specific persona or expertise before performing a task. This drastically alters the model's vocabulary, assumptions, and level of detail.\n\n**Examples of Roles:**\n- `Act as a 5th-grade science teacher.` (The output will use simpler language and analogies.)\n- `You are a cybersecurity expert with 20 years of experience.` (The output will be detailed, technical, and prioritize security.)\n- `You are a sardonic film critic.` (The tone will be cynical and judgmental.)\n\n**Placement is Key:** The role instruction should usually come first in the prompt to set the context for all subsequent instructions.",
      "code_examples": [
        {
          "title": "Role-Based Tone Shift",
          "code": "// Prompt A (No Role):\n\"Explain quantum physics.\"\n\n// Prompt B (Role-Based):\n\"Act as a stand-up comedian. Your task is to explain quantum physics in a way that is funny, engaging, and uses analogies related to breakfast cereal.\"",
          "explanation": "Prompt B uses the role to enforce a specific, creative tone and knowledge domain (comedy) that the general prompt (A) could never achieve."
        }
      ],
      "common_mistakes": [
        {
          "mistake": "Assigning a role that is too vague or not relevant to the task.",
          "why": "A non-specific role like 'Act as an expert' is often less effective than a specific one like 'Act as a data scientist.'",
          "fix": "Make the role highly specific and ensure it directly influences the expected outcome. If you need code, assign a software engineer role."
        }
      ],
      "resources": [
        {
          "title": "Impact of Persona and Role on LLM Output",
          "url": "https://arxiv.org/abs/2304.03058",
          "type": "research_paper"
        },
        {
          "title": "The Power of 'Act As a...': Advanced Role-Playing",
          "url": "https://www.promptingguide.ai/techniques/role-prompting",
          "type": "guide"
        }
      ],
      "tasks": [
        {
          "title": "Expert Comparison",
          "description": "Write the same instruction (e.g., 'summarize the history of space travel') twice. First, use the role 'Act as a historical documentarian.' Second, use the role 'Act as an opinionated political commentator.' Compare the differences in focus and language.",
          "estimated_time": 45,
          "difficulty": "intermediate"
        }
      ]
    },
    {
      "day_number": 10,
      "title": "Prompt Design Portfolio: Summarization and Product Descriptions",
      "objectives": [
        "Synthesize all Week 2 principles (ATFL, Few-Shot, Negative Constraints, Role-Based) into two reusable, high-quality prompts.",
        "Create a robust summarization prompt that can handle varied input texts.",
        "Develop a product description generation prompt that consistently produces compelling, market-ready copy.",
        "Begin building a 'prompt library' of effective, pre-tested instructions."
      ],
      "duration_mins": 90,
      "content": "This final day is dedicated to practical application and building your portfolio. We will create two core, reusable prompts that are highly demanded in professional settings: summarization and product description generation. A reusable prompt includes placeholders (e.g., `[TEXT_TO_SUMMARIZE]`) and all necessary constraints to work reliably across different inputs.\n\n**Prompt Library:** Start saving your best prompts. As a prompt engineer, your collection of successful prompts is a key asset. Organize them by task type (e.g., [Summarization], [Drafting], [Classification]).",
      "code_examples": [
        {
          "title": "Template: Professional Product Description",
          "code": "Role: You are a conversion-focused copywriter specializing in luxury goods. \n\nGoal: Generate a compelling product description.\n\nATFL:\n- Audience: Affluent consumers (35-55) who value craftsmanship.\n- Tone: Elegant, confident, and exclusive.\n- Format: Two paragraphs. Paragraph 1: Focus on the emotional benefit. Paragraph 2: Focus on the key features.\n- Length: Max 150 words total.\n\nConstraints: Must not use the word 'affordable,' 'cheap,' or 'budget.'\n\nProduct Information: [INSERT PRODUCT DETAILS HERE]",
          "explanation": "This is a full, professional-grade prompt that ensures the output is constrained to a specific market and tone."
        }
      ],
      "common_mistakes": [
        {
          "mistake": "Creating a good prompt but failing to document why it worked.",
          "why": "Without documentation, you can't troubleshoot or iterate efficiently when the task changes.",
          "fix": "Always save a note alongside your prompt explaining its purpose, target model, and the principles (like few-shot) it uses."
        }
      ],
      "resources": [
        {
          "title": "How to Build an Effective Prompt Library",
          "url": "https://www.prompt-engineer-resources.com/prompt-library-best-practices",
          "type": "guide"
        },
        {
          "title": "Synthesizing Prompt Engineering Principles (Case Study)",
          "url": "https://www.llm-usecases.com/business-application-examples",
          "type": "case_study"
        }
      ],
      "tasks": [
        {
          "title": "The Synthesis Prompt Project",
          "description": "Create two separate, fully constrained prompts: one for summarizing a news article for a 10-year-old, and one for writing a Twitter thread (5-10 tweets) promoting a fictional software tool. Both must use at least three of this week's principles.",
          "estimated_time": 60,
          "difficulty": "advanced_beginner"
        }
      ]
    }
  ]
}
,

// Week 2: Prompt Anatomy & Design Principles
// mastering the core components of professional prompt design and systematic frameworks

{
  week_number: 2,
  title: 'Prompt Anatomy & Design Principles',
  description: 'Transition from "talking" to AI to "engineering" outputs. Learn to deconstruct prompts into their functional DNA and apply professional frameworks like CLEAR to ensure high-quality, predictable results.',
  objectives: [
    'Deconstruct any prompt into the four core pillars: Instruction, Context, Input Data, and Output Indicator',
    'Apply the CLEAR framework to audit and improve prompt effectiveness',
    'Master Few-Shot prompting to guide models through pattern matching',
    'Implement negative constraints and structural delimiters for precise control',
    'Build a standardized personal prompt library for common professional tasks'
  ],
  lessons: [
    // ============================================
    // DAY 6: The Four Pillars of Prompt Anatomy
    // ============================================
    {
      day_number: 6,
      title: 'The DNA of a Prompt: The Four Core Pillars',
      objectives: [
        'Understand the functional role of Instruction, Context, Input Data, and Output Indicators',
        'Learn how to isolate variables within a prompt for better debugging',
        'Practice rebuilding "lazy" prompts into high-performance instructions'
      ],
      duration_mins: 60,
      content: `
# The DNA of a Prompt

A professional prompt is not a single sentence; it is a structured set of components. By deconstructing a prompt into four pillars, you gain the ability to "tune" specific parts of the AI's logic.



## Pillar 1: Instruction (The Task)
The specific action you want the model to take. Use strong verbs like "Summarize," "Calculate," or "Transcribe."

## Pillar 2: Context (The Background)
The "world-building" for the AI. This includes the persona (Who are you?), the audience (Who is this for?), and the goal (Why are we doing this?).

## Pillar 3: Input Data (The Raw Material)
The specific information the AI needs to process. This could be an email, a block of code, or a legal document.

## Pillar 4: Output Indicator (The Target)
The blueprint for the result. Do you want a JSON object? A 3-bullet list? A formal letter?

**Pro Tip:** Always separate your **Instructions** from your **Input Data** using clear markers (delimiters) so the AI doesn't get confused about what is an order and what is just data.
      `,
      code_examples: [
        {
          title: 'Rebuilding a "Lazy" Prompt',
          code: `// ❌ LAZY PROMPT:
"Write an email to Sarah about her service being down."

// ✅ ENGINEERED PROMPT (The Four Pillars):
/* 1. INSTRUCTION: Draft a formal apology and status update email.
2. CONTEXT: You are a Senior Customer Success Manager at NetCloud. Sarah is a VIP client.
3. INPUT DATA: Service was down for 2 hours due to a server migration error. It is now fixed.
4. OUTPUT INDICATOR: Format as a professional email with a clear subject line and a formal sign-off.
*/

"Instruction: Draft a formal apology email.
Context: You are a Customer Success Manager. The recipient, Sarah, is a VIP client.
Details: Service was down for 2 hours (server error); now resolved.
Format: Professional email structure with a concise subject line."`,
          explanation: 'By breaking the request into pillars, the AI produces a high-stakes business email rather than a generic, unusable draft.'
        }
      ],
      tasks: [
        {
          title: 'The Deconstruction Challenge',
          description: 'Take three generic prompts and identify which pillars are missing, then rebuild them.',
          instructions: `
1. Take the prompt: "Summarize this article." 
2. Identify which 3 pillars are missing.
3. Rebuild it into a professional prompt for a busy Executive.
          `,
          estimated_time: 45,
          difficulty: 'beginner'
        }
      ]
    },

    // ============================================
    // DAY 7: The CLEAR Framework
    // ============================================
    {
      day_number: 7,
      title: 'Framework Mastery: The CLEAR Method',
      objectives: [
        'Learn the CLEAR (Concise, Logical, Explicit, Adaptive, Refined) checklist',
        'Apply the framework to audit prompts for professional use',
        'Reduce "noise" in prompts to save tokens and improve focus'
      ],
      duration_mins: 60,
      content: `
# The CLEAR Framework

To move from amateur to professional, you need a systematic way to audit your prompts. Use the **CLEAR** method:

- **C - Concise:** Remove fluff. Every word must serve a purpose.
- **L - Logical:** Does the order of instructions make sense? (Context first, then Instructions).
- **E - Explicit:** Avoid "maybe" or "try to." Use "Must," "Always," and "Never."
- **A - Adaptive:** Does the prompt allow the AI to handle variations in input data?
- **R - Refined:** Has this prompt been tested and tweaked at least three times?



## The Logic of Order
Research shows that LLMs pay more attention to the **beginning** and the **end** of a prompt. This is called "Primacy and Recency bias." Place your most critical constraints at the very end to ensure they are followed.
      `,
      code_examples: [
        {
          title: 'Applying CLEAR to a Data Task',
          code: `// BEFORE CLEAR:
"I want you to look at this list of names and tell me which ones are from Europe and put them in a list please."

// AFTER CLEAR (Explicit & Logical):
"Identify the geographical origin of the following names. 
Constraint: Only include names with European origins. 
Output: A clean, alphabetized bulleted list. 
Input: [List of names]"`,
          explanation: 'The Refined version removes conversational filler ("I want you to," "please") and replaces it with explicit structural requirements.'
        }
      ],
      tasks: [
        {
          title: 'Prompt Audit',
          description: 'Find a prompt online (e.g., from a prompt gallery) and apply the CLEAR framework to make it 50% shorter and 2x more effective.',
          estimated_time: 60,
          difficulty: 'beginner'
        }
      ]
    },

    // ============================================
    // DAY 8: Few-Shot Prompting
    // ============================================
    {
      day_number: 8,
      title: 'Show, Don’t Just Tell: Few-Shot Prompting',
      objectives: [
        'Differentiate between Zero-Shot, One-Shot, and Few-Shot prompting',
        'Learn when to use examples versus when to use instructions',
        'Master the formatting of examples to prevent AI "drift"'
      ],
      duration_mins: 60,
      content: `
# Learning Through Examples

LLMs are world-class pattern matchers. Often, providing **3 examples** is more effective than writing **3 paragraphs** of instructions.

## Definitions:
- **Zero-Shot:** Giving a task with no examples. (Fast, but prone to errors).
- **One-Shot:** Giving exactly one example of the desired output.
- **Few-Shot:** Providing 3–5 examples to establish a complex pattern.

## When to use Few-Shot:
1. **Sentiment Analysis:** Showing what "Slightly Annoyed" looks like vs "Angry."
2. **Formatting:** Showing exactly how a JSON object or a table should look.
3. **Creative Voice:** Showing the specific rhythm of a brand's social media captions.
      `,
      code_examples: [
        {
          title: 'Few-Shot Sentiment Classification',
          code: `// The AI is taught a pattern:
"Review: 'The battery died in an hour.' -> Sentiment: Negative
Review: 'It works, but the color is off.' -> Sentiment: Neutral
Review: 'Best purchase of the year!' -> Sentiment: Positive
Review: 'The shipping was slow but the product is great.' -> Sentiment: "`,
          explanation: 'By providing the pattern, the AI will accurately predict "Positive/Mixed" for the final entry without needing complex instructions on how to weigh shipping vs product quality.'
        }
      ],
      tasks: [
        {
          title: 'The Pattern Builder',
          description: 'Create a Few-Shot prompt that teaches the AI to translate technical jargon into "Pirate Speak."',
          instructions: `
1. Provide 3 examples of Technical Sentence -> Pirate Translation.
2. Provide a 4th technical sentence for the AI to translate.
3. Observe if the AI maintains the technical meaning while adopting the persona.
          `,
          estimated_time: 45,
          difficulty: 'beginner'
        }
      ]
    },

    // ============================================
    // DAY 9: Negative Constraints & Delimiters
    // ============================================
    {
      day_number: 9,
      title: 'The Art of "No": Negative Constraints and Delimiters',
      objectives: [
        'Master Negative Constraints (What NOT to do)',
        'Use Delimiters (###, """, <tag>) to structure complex prompts',
        'Prevent "Prompt Injection" (where input data is mistaken for instructions)'
      ],
      duration_mins: 60,
      content: `
# Guardrails and Borders

## Negative Constraints
Beginners tell the AI what to do. Experts tell the AI what to **avoid**. 
Example: "Summarize this, but **do not** use the word 'innovation' and **do not** exceed two sentences."

## Delimiters
As prompts get longer, the AI can get "lost." Delimiters act as fences.
- Use \`###\` to separate sections.
- Use \`"""\` for large blocks of text.
- Use XML tags like \`<context>\` and \`<instructions>\` for maximum clarity (especially effective with Claude).


      `,
      code_examples: [
        {
          title: 'Using Delimiters for Data Extraction',
          code: `"<instructions>
Extract the main action items from the text provided in the data section.
Constraint: Do not include items that are already marked as 'Completed'.
</instructions>

<data>
[Paste 50 lines of messy meeting notes here]
</data>"`,
          explanation: 'The XML tags clearly separate the commands from the messy data, reducing the chance of the AI ignoring the constraints.'
        }
      ],
      tasks: [
        {
          title: 'Constraint Torture Test',
          description: 'Write a 100-word story about a cat, but you MUST NOT use the letter "e".',
          instructions: `
1. Create a prompt with this specific negative constraint.
2. Check the output. Did the AI fail?
3. Refine the prompt to be more "Explicit" about checking its own work.
          `,
          estimated_time: 45,
          difficulty: 'intermediate'
        }
      ]
    },

    // ============================================
    // DAY 10: Standardizing Your Vault
    // ============================================
    {
      day_number: 10,
      title: 'The Professional Vault: Personal Prompt Libraries',
      objectives: [
        'Learn to build reusable prompt templates',
        'Understand the importance of version control for prompts',
        'Create a "Prompt Vault" of 10 essential business templates'
      ],
      duration_mins: 60,
      content: `
# Professionalizing Your Workflow

A prompt engineer never writes the same prompt twice. Today, you will build your **Prompt Vault**.

## Elements of a Template
A template uses placeholders (like \`[INSERT_TOPIC_HERE]\`) so you can quickly swap data.

## The Essential 10:
Every professional should have a template for:
1. Email Summarization
2. Meeting Action Item Extraction
3. Formal-to-Casual Tone Shifting
4. Code Debugging
5. Creative Brainstorming (The "Creative Partner" persona)
6. Logical Fallacy Checking
7. Document Formatting (Markdown to HTML)
8. Translation (preserving nuance)
9. Role-play (The "Interview Coach")
10. The "CLEAR" Auditor (A prompt that audits other prompts)
      `,
      code_examples: [
        {
          title: 'The "Auditor" Template',
          code: `// A meta-prompt to help you work faster
"Act as a Prompt Engineering Expert. 
I am going to provide a prompt I wrote. 
Your Task: Audit my prompt using the CLEAR framework. 
Provide a score (1-10) for each letter and then give me a 'Refined' version of the prompt.

My Prompt: [INSERT PROMPT HERE]"`,
          explanation: 'This "Meta-Prompt" allows you to use the AI to improve your own engineering skills.'
        }
      ],
      tasks: [
        {
          title: 'Vault Construction',
          description: 'Create a Notion page, GitHub repo, or a simple Markdown file and document your first 5 high-performing templates using the Four Pillars learned on Day 6.',
          estimated_time: 90,
          difficulty: 'beginner'
        }
      ]
    }
  ]
},

// Week 3: Advanced Prompting Techniques & Logical Reasoning
// Transitioning from simple tasks to complex problem-solving and structured data

{
  week_number: 3,
  title: 'Advanced Techniques: Reasoning and Structure',
  description: 'Learn to unlock the higher-level reasoning capabilities of LLMs. This week covers Chain-of-Thought prompting, advanced delimiters, and the art of eliciting structured data (JSON/XML) for technical workflows.',
  objectives: [
    'Implement Chain-of-Thought (CoT) prompting to solve complex logic problems',
    'Master the "Self-Ask" and "Step-by-Step" techniques for higher accuracy',
    'Generate and validate structured data outputs like JSON, CSV, and XML',
    'Learn to use advanced delimiters and markdown for complex document processing',
    'Evaluate model outputs for logical consistency and "hallucination" markers'
  ],
  lessons: [
    // ============================================
    // DAY 11: Chain-of-Thought (CoT) Prompting
    // ============================================
    {
      day_number: 11,
      title: 'Chain-of-Thought: Teaching AI to Think Before Speaking',
      objectives: [
        'Understand why LLMs fail at multi-step logic without guidance',
        'Learn the "Let\'s think step by step" trigger and its impact',
        'Practice Zero-shot and Few-shot CoT'
      ],
      duration_mins: 60,
      content: `
# Chain-of-Thought (CoT) Prompting

LLMs are prediction engines. If a problem is complex, the most likely "next token" might be an incorrect answer if the model hasn't "calculated" the intermediate steps. **Chain-of-Thought** forces the model to generate its reasoning process before giving a final answer.



## Why it works
By asking the model to show its work, you allow it to use its own output as additional context for the final result. This significantly reduces errors in math, logic, and symbolic reasoning.

## The Magic Phrase
Simply adding the phrase **"Let's think step by step"** at the end of a prompt can often double the accuracy of a model on complex tasks.
      `,
      code_examples: [
        {
          title: 'CoT in Action (Logic Problem)',
          code: `// ❌ STANDARD PROMPT (High failure rate):
"If I have 3 apples, and I buy 2 more, then give 1 to a friend and buy a dozen more, how many do I have? Answer with just the number."

// ✅ CoT PROMPT (High accuracy):
"Question: If I have 3 apples, and I buy 2 more, then give 1 to a friend and buy a dozen more, how many do I have?
Reasoning: Let's break this down step by step.
1. Initial apples: 3
2. Buy 2: 3 + 2 = 5
3. Give 1 away: 5 - 1 = 4
4. Buy a dozen (12): 4 + 12 = 16
Answer: 16"`,
          explanation: 'Providing a "Reasoning" section ensures the AI processes the math sequentially rather than jumping to a guessed total.'
        }
      ],
      tasks: [
        {
          title: 'The Logic Solver',
          description: 'Design a CoT prompt to solve a complex scheduling conflict between three people with different time zones and availability.',
          estimated_time: 50,
          difficulty: 'intermediate'
        }
      ]
    },

    // ============================================
    // DAY 12: Structured Output (JSON & XML)
    // ============================================
    {
      day_number: 12,
      title: 'Structured Output: Preparing Data for Systems',
      objectives: [
        'Learn to elicit valid JSON and XML from the model',
        'Understand the importance of schema definitions in prompts',
        'Practice cleaning AI output for programmatic use'
      ],
      duration_mins: 60,
      content: `
# Eliciting Structured Data

Prompt engineering isn't just for writing essays; it's for generating data that other software can read.

## Why JSON?
JSON (JavaScript Object Notation) is the language of the web. By forcing an AI to output JSON, you can feed that data directly into a database or a frontend application.

## Techniques for Success
1. **Provide a Schema:** Show the AI exactly what keys and value types you expect.
2. **The "No Preamble" Constraint:** Explicitly tell the AI not to include "Here is the JSON you asked for..."
3. **Use Markdown Blocks:** Ask for the code inside \` \` \` json blocks for easy parsing.
      `,
      code_examples: [
        {
          title: 'Extracting Data into JSON',
          code: `// PROMPT:
"Extract the name, company, and sentiment from this email.
Output must be a valid JSON object. 
Do not include any text other than the JSON.

Example Schema:
{
  \\"name\\": string,
  \\"company\\": string,
  \\"sentiment\\": \\"Positive\\" | \\"Negative\\"
}

Email: 'Hi, I'm John from Tesla. I love the new update!' "`,
          explanation: 'By providing a schema and a negative constraint ("No other text"), the output becomes machine-readable.'
        }
      ],
      tasks: [
        {
          title: 'The Data Architect',
          description: 'Take a messy paragraph about 5 different products and create a prompt that extracts them into a valid JSON array of objects.',
          estimated_time: 60,
          difficulty: 'intermediate'
        }
      ]
    },

    // ============================================
    // DAY 13: Self-Consistency and Iterative Refinement
    // ============================================
    {
      day_number: 13,
      title: 'Self-Consistency: The Error-Correction Loop',
      objectives: [
        'Learn the "Self-Consistency" technique (multiple paths to one answer)',
        'Implement "Self-Correction" prompts to reduce hallucinations',
        'Practice auditing AI work using the AI itself'
      ],
      duration_mins: 60,
      content: `
# Reliability Through Iteration

LLMs sometimes make mistakes, but they are also very good at *finding* mistakes if prompted correctly.

## Self-Consistency
This involves asking the model to generate three different versions of a solution and then asking it to pick the most common or logical result among them.

## The "Critique" Loop
1. **Draft:** Ask for the initial answer.
2. **Review:** Ask the AI: "Find 3 potential errors or improvements in the response above."
3. **Refine:** Ask the AI: "Rewrite the response based on those critiques."
      `,
      code_examples: [
        {
          title: 'The Critique and Refine Pattern',
          code: `// STEP 1:
"Write a summary of quantum physics for a 10-year-old."

// STEP 2 (The Audit):
"Review the summary above. Are there any terms that are still too complex for a 10-year-old? Are there any inaccuracies? List them."

// STEP 3 (The Fix):
"Now rewrite the summary, fixing the issues identified in Step 2."`,
          explanation: 'This multi-turn approach results in a significantly higher quality final product than a single-turn prompt.'
        }
      ],
      tasks: [
        {
          title: 'The Fact-Checker',
          description: 'Create a prompt that asks the AI to write a short biography of a fictional person, then have it critique its own work for "clichés" and rewrite it.',
          estimated_time: 45,
          difficulty: 'intermediate'
        }
      ]
    },

    // ============================================
    // DAY 14: Delimiters and Markdown Structure
    // ============================================
    {
      day_number: 14,
      title: 'Advanced Formatting: Delimiters and Hierarchy',
      objectives: [
        'Master the use of Markdown for prompt organization',
        'Use nested delimiters for complex, multi-part inputs',
        'Improve "Prompt Injection" resistance'
      ],
      duration_mins: 60,
      content: `
# Organizing Complexity

As tasks grow, your prompts will contain instructions, context, examples, and multiple data files. Without hierarchy, the AI gets confused.

## Markdown as a Tool
Use \`#\`, \`##\`, and \`###\` not just for the output, but **inside** your prompt to tell the AI the importance of different sections.

## Nested Delimiters
If your input text contains quotes, use triple quotes (\`\"\"\"\`) or triple backticks (\` \` \` \`) to wrap the whole block. This prevents the AI from thinking a quote inside the text is the end of the input.
      `,
      code_examples: [
        {
          title: 'Complex Multi-Section Prompt',
          code: `"# ROLE
You are a Lead Editor.

## CONTEXT
We are preparing a newsletter for high-net-worth investors.

## DATA SECTION
Below is the raw transcript from the meeting:
'''
[Transcript text...]
'''

## TASK
1. Extract the top 3 market trends.
2. Format them as a Markdown table.
3. Write a 50-word summary of the outlook."`,
          explanation: 'Using Markdown headers and triple-backticks creates a clear "Visual Map" for the LLM to follow.'
        }
      ],
      tasks: [
        {
          title: 'The Document Handler',
          description: 'Organize a prompt that takes two separate articles (Input A and Input B) and compares them, using clear delimiters to keep them separate.',
          estimated_time: 50,
          difficulty: 'intermediate'
        }
      ]
    },

    // ============================================
    // DAY 15: Evaluation & Hallucination Auditing
    // ============================================
    {
      day_number: 15,
      title: 'Truth and Accuracy: Auditing Hallucinations',
      objectives: [
        'Define "Hallucination" and identify its triggers',
        'Learn the "Verify-then-Answer" technique',
        'Develop a rubric for evaluating prompt quality'
      ],
      duration_mins: 60,
      content: `
# The Truth Challenge

Hallucination occurs when the AI fills a gap in its knowledge with high-probability "fiction."

## Mitigation Strategies
1. **The "Exit Hatch":** Always give the AI a way out. "If you do not know the answer, say 'Information not found'."
2. **Source Grounding:** Force the AI to provide a quote from the provided text before answering.
3. **Chain of Verification (CoVe):** Ask the model to verify its own facts before finalizing the output.

## Evaluation Rubrics
To measure success, don't just say "It looks good." Use a rubric:
- **Accuracy:** (1-5)
- **Formatting:** (Did it follow the JSON/Table rules?)
- **Tone Adherence:** (Did it stay in persona?)
      `,
      code_examples: [
        {
          title: 'The Verify-Then-Answer Prompt',
          code: `// PROMPT:
"Task: Answer the question based ONLY on the text provided below. 

Step 1: Extract the exact sentence from the text that contains the answer.
Step 2: If no such sentence exists, state 'Information not found'.
Step 3: Provide the final answer based on that sentence.

Question: What is the company's Q3 revenue?
Text: [Paste Document Here]"`,
          explanation: 'By making the AI find the source sentence first, you dramatically lower the chance of it making up a number.'
        }
      ],
      tasks: [
        {
          title: 'The Hallucination Hunter',
          description: 'Intentionally give the AI a "trick question" about a non-existent historical event. Refine your prompt until the AI successfully identifies it as fake.',
          estimated_time: 60,
          difficulty: 'advanced'
        }
      ]
    }
  ]
},





 ]