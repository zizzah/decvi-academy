import { ArrowRight, BookOpen, Users, Award, TrendingUp, CheckCircle, Code, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export default function LandingPage() {
  const features = [
    {
      icon: <Code className="w-12 h-12 text-blue-600" />,
      title: "Industry-Ready Curriculum",
      description: "3-month intensive program covering web, mobile, and AI development"
    },
    {
      icon: <Users className="w-12 h-12 text-blue-600" />,
      title: "Expert Instructors",
      description: "Learn from seasoned professionals with real-world experience"
    },
    {
      icon: <Award className="w-12 h-12 text-blue-600" />,
      title: "Certificates & Portfolio",
      description: "Earn recognized certificates and build 10+ real projects"
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-blue-600" />,
      title: "Career Support",
      description: "AI-powered recommendations and job placement assistance"
    }
  ]

  const curriculum = [
    {
      month: "Month 1",
      title: "Foundation & Web Development",
      topics: ["HTML, CSS, JavaScript", "React & Next.js", "Git & GitHub", "Responsive Design"]
    },
    {
      month: "Month 2",
      title: "Advanced Development",
      topics: ["Backend with Node.js", "Databases & APIs", "Mobile Development", "Cloud Services"]
    },
    {
      month: "Month 3",
      title: "Specialization & Capstone",
      topics: ["AI/ML Basics", "Game Development", "Capstone Project", "Career Preparation"]
    }
  ]

  const stats = [
    { value: "95%", label: "Job Placement Rate" },
    { value: "500+", label: "Graduates" },
    { value: "4.9/5", label: "Student Rating" },
    { value: "100%", label: "Hands-on Projects" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">DC VI Tech Academy</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition">Features</a>
              <a href="#curriculum" className="text-gray-600 hover:text-blue-600 transition">Curriculum</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition">About</a>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/login">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700">Login</Button>
              </Link>
              <Link href="/auth/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Register <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                🎓 Dominion City Victoria Island, Lagos
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Transform Into an
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> Industry-Ready </span>
                Tech Professional
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Join our intensive 3-month program and master web development, mobile apps, AI/ML, and more. Build real projects, earn certificates, and launch your tech career.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6">
                  Start Your Journey <ArrowRight className="ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-8 py-6">
                  View Curriculum
                </Button>
              </div>
              <div className="flex items-center space-x-6 pt-4">
                {stats.slice(0, 2).map((stat, idx) => (
                  <div key={idx}>
                    <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/hero-banner.jpg" 
                  alt="Students learning"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <div className="font-semibold text-gray-900">100% Practical</div>
                    <div className="text-sm text-gray-600">Hands-on Projects</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose DC VI Tech Academy?</h2>
            <p className="text-xl text-gray-600">Everything you need to launch your tech career</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <Card key={idx} className="border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section id="curriculum" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">3-Month Curriculum</h2>
            <p className="text-xl text-gray-600">Structured learning path from beginner to professional</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {curriculum.map((item, idx) => (
              <Card key={idx} className="border-blue-100 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xl font-bold">
                    {idx + 1}
                  </div>
                  <div className="text-sm font-semibold text-blue-600">{item.month}</div>
                  <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                  <ul className="space-y-2">
                    {item.topics.map((topic, topicIdx) => (
                      <li key={topicIdx} className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">Ready to Start Your Tech Journey?</h2>
          <p className="text-xl text-blue-100">
            Join hundreds of students who have transformed their careers with DC VI Tech Academy
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
            Apply Now <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">DC VI Tech Academy</span>
          </div>
          <p className="text-gray-400">Dominion City Victoria Island, Lagos</p>
          <p className="text-gray-400">Transforming Learners into Industry-Ready Tech Professionals</p>
          <div className="pt-4 border-t border-gray-800">
            <p className="text-gray-500 text-sm">© 2025 DC VI Tech Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}