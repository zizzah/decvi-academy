// scripts/test-ai-teacher.ts
// Run with: npx ts-node scripts/test-ai-teacher.ts

// Load environment variables FIRST
import dotenv from 'dotenv'
dotenv.config()

import Groq from 'groq-sdk'

async function testAITeacher() {
  console.log('🔍 AI Teacher Integration Health Check\n')

  // Test 1: Environment Variables
  console.log('1️⃣ Checking environment variables...')
  const groqApiKey = process.env.GROQ_API_KEY
  
  if (!groqApiKey) {
    console.error('❌ GROQ_API_KEY not found in environment')
    console.error('   Make sure your .env file exists and contains GROQ_API_KEY')
    return false
  }
  console.log('✅ GROQ_API_KEY is set')
  console.log(`   Key preview: ${groqApiKey.substring(0, 20)}...`)

  // Test 2: Groq Connection
  console.log('\n2️⃣ Testing Groq API connection...')
  try {
    const groq = new Groq({ apiKey: groqApiKey })
    
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Respond with "OK" if you can read this.'
        },
        {
          role: 'user',
          content: 'Can you hear me?'
        }
      ],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 10
    })

    const reply = response.choices[0]?.message?.content
    console.log('✅ Groq API connection successful')
    console.log(`   Response: "${reply}"`)
  } catch (error) {
    console.error('❌ Groq API connection failed')
    console.error('   Error:', error instanceof Error ? error.message : 'Unknown error')
    return false
  }

  // Test 3: VM2 (Code Execution)
  console.log('\n3️⃣ Testing code execution (VM2)...')
  try {
    const { VM } = require('vm2')
    
    let output = ''
    const vm = new VM({
      timeout: 1000,
      sandbox: {
        console: {
          log: (...args: any[]) => {
            output += args.join(' ')
          }
        }
      }
    })

    vm.run('console.log("Hello from VM2")')
    
    if (output.includes('Hello from VM2')) {
      console.log('✅ Code execution working')
      console.log(`   Output: "${output}"`)
    } else {
      console.error('❌ Code execution failed - unexpected output')
      return false
    }
  } catch (error) {
    console.error('❌ VM2 not installed or not working')
    console.error('   Run: npm install vm2')
    return false
  }

  // Test 4: Test AI with Educational Context
  console.log('\n4️⃣ Testing AI with educational context...')
  try {
    const groq = new Groq({ apiKey: groqApiKey })
    
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a programming teacher. The lesson is about JavaScript variables.
          
LESSON CONTENT:
Variables are containers for storing data. In JavaScript, we declare variables using 'let', 'const', or 'var'.

Example:
let age = 25;
const name = "John";

Answer the following question based on this lesson.`
        },
        {
          role: 'user',
          content: 'What is a variable?'
        }
      ],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 100,
      temperature: 0.7
    })

    const reply = response.choices[0]?.message?.content || ''
    
    if (reply.toLowerCase().includes('variable') || reply.toLowerCase().includes('container')) {
      console.log('✅ AI contextual response working')
      console.log(`   Response preview: "${reply.slice(0, 80)}..."`)
    } else {
      console.error('❌ AI response seems off-topic')
      console.error(`   Got: "${reply}"`)
      return false
    }
  } catch (error) {
    console.error('❌ Contextual AI test failed')
    console.error('   Error:', error instanceof Error ? error.message : 'Unknown error')
    return false
  }

  // Test 5: Test AI Grading
  console.log('\n5️⃣ Testing AI grading capability...')
  try {
    const groq = new Groq({ apiKey: groqApiKey })
    
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You grade student code. Respond ONLY with valid JSON.'
        },
        {
          role: 'user',
          content: `Grade this code for a task "Print Hello World":

CODE:
console.log("Hello World");

Respond with JSON: {"score": <0-100>, "status": "PASSED|FAILED", "feedback": "..."}`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 200,
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })

    const reply = response.choices[0]?.message?.content || ''
    const grading = JSON.parse(reply)
    
    if (grading.score !== undefined && grading.status && grading.feedback) {
      console.log('✅ AI grading working')
      console.log(`   Score: ${grading.score}`)
      console.log(`   Status: ${grading.status}`)
      console.log(`   Feedback: "${grading.feedback.slice(0, 60)}..."`)
    } else {
      console.error('❌ AI grading response incomplete')
      console.error(`   Got: ${reply}`)
      return false
    }
  } catch (error) {
    console.error('❌ AI grading test failed')
    console.error('   Error:', error instanceof Error ? error.message : 'Unknown error')
    return false
  }

  // All tests passed!
  console.log('\n' + '='.repeat(50))
  console.log('✅ ALL TESTS PASSED!')
  console.log('='.repeat(50))
  console.log('\n🎉 AI Teacher integration is healthy and ready to use!\n')
  
  return true
}

// Run the tests
testAITeacher()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('\n💥 Unexpected error during health check:')
    console.error(error)
    process.exit(1)
  })
  