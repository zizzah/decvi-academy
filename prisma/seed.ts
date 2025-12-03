import { PrismaClient, UserRole, EnrollmentStatus, ClassType, DeliveryMode, AttendanceStatus, AttendanceMethod, ProjectStatus, AssignmentType, SkillLevel, AchievementType, CertificateStatus, RecommendationType, RecommendationPriority, FeedbackType, ActivityType, ResourceType, NotificationType, MessageType, ConversationType, LiveClassStatus, CourseLevel, LessonType, TaskDifficulty, SubmissionStatus } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.$transaction([
    prisma.taskSubmission.deleteMany(),
    prisma.assignmentSubmission.deleteMany(),
    prisma.projectSubmission.deleteMany(),
    prisma.studentLessonProgress.deleteMany(),
    prisma.studentCourseProgress.deleteMany(),
    prisma.courseEnrollment.deleteMany(),
    prisma.lessonTask.deleteMany(),
    prisma.courseLesson.deleteMany(),
    prisma.courseAssignment.deleteMany(),
    prisma.courseProject.deleteMany(),
    prisma.courseWeek.deleteMany(),
    prisma.course.deleteMany(),
    prisma.messageReadReceipt.deleteMany(),
    prisma.messageReaction.deleteMany(),
    prisma.message.deleteMany(),
    prisma.conversationParticipant.deleteMany(),
    prisma.conversation.deleteMany(),
    prisma.onlineStatus.deleteMany(),
    prisma.liveClassEnrollment.deleteMany(),
    prisma.liveClass.deleteMany(),
    prisma.activity.deleteMany(),
    prisma.feedback.deleteMany(),
    prisma.recommendation.deleteMany(),
    prisma.certificate.deleteMany(),
    prisma.achievement.deleteMany(),
    prisma.progress.deleteMany(),
    prisma.skillProficiency.deleteMany(),
    prisma.assessmentResult.deleteMany(),
    prisma.assignment.deleteMany(),
    prisma.project.deleteMany(),
    prisma.attendanceQRCode.deleteMany(),
    prisma.attendance.deleteMany(),
    prisma.class.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.student.deleteMany(),
    prisma.instructor.deleteMany(),
    prisma.admin.deleteMany(),
    prisma.cohort.deleteMany(),
    prisma.resource.deleteMany(),
    prisma.user.deleteMany(),
  ])

  const hashedPassword = await bcrypt.hash('Password123!', 10)

  // Create Admin User
  console.log('👤 Creating admin user...')
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@decvi.com',
      passwordHash: hashedPassword,
      role: UserRole.ADMIN,
      isVerified: true,
      admin: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
          phone: '+2348012345678',
          permissions: ['MANAGE_USERS', 'MANAGE_COURSES', 'VIEW_ANALYTICS'],
        },
      },
    },
  })

  // Create Instructors
  console.log('👨‍🏫 Creating instructors...')
  const instructorUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.doe@decvi.com',
        passwordHash: hashedPassword,
        role: UserRole.INSTRUCTOR,
        isVerified: true,
        instructor: {
          create: {
            firstName: 'John',
            lastName: 'Doe',
            phone: '+2348023456789',
            bio: 'Full-stack developer with 10+ years of experience in web development and teaching.',
            expertise: ['JavaScript', 'React', 'Node.js', 'Python', 'Database Design'],
            yearsOfExp: 10,
            linkedinUrl: 'https://linkedin.com/in/johndoe',
            githubUrl: 'https://github.com/johndoe',
          },
        },
      },
      include: {
        instructor: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane.smith@decvi.com',
        passwordHash: hashedPassword,
        role: UserRole.INSTRUCTOR,
        isVerified: true,
        instructor: {
          create: {
            firstName: 'Jane',
            lastName: 'Smith',
            phone: '+2348034567890',
            bio: 'UI/UX designer and frontend specialist passionate about creating beautiful user experiences.',
            expertise: ['UI/UX Design', 'React', 'TypeScript', 'CSS', 'Figma'],
            yearsOfExp: 8,
            linkedinUrl: 'https://linkedin.com/in/janesmith',
            githubUrl: 'https://github.com/janesmith',
          },
        },
      },
      include: {
        instructor: true,
      },
    }),
  ])

  // Create Cohort
  console.log('👥 Creating cohort...')
  const cohort = await prisma.cohort.create({
    data: {
      name: 'Cohort 2024-Q1',
      description: 'Full-stack development bootcamp - Q1 2024',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-07-15'),
      maxStudents: 30,
      isActive: true,
    },
  })

  // Create Students
  console.log('👨‍🎓 Creating students...')
  const students = []
  for (let i = 0; i < 5; i++) {
    const student = await prisma.user.create({
      data: {
        email: `student${i + 1}@example.com`,
        passwordHash: hashedPassword,
        role: UserRole.STUDENT,
        isVerified: true,
        student: {
          create: {
            firstName: `Student`,
            lastName: `${i + 1}`,
            phone: `+23480${String(45678901 + i).slice(0, 8)}`,
            dateOfBirth: new Date(2000 + i, i % 12, (i + 1) * 3),
            gender: i % 2 === 0 ? 'Male' : 'Female',
            address: `${i + 1} Tech Street`,
            city: 'Lagos',
            state: 'Lagos',
            country: 'Nigeria',
            educationLevel: 'Bachelor',
            institution: 'University of Lagos',
            fieldOfStudy: 'Computer Science',
            techInterests: ['Web Development', 'Mobile Apps', 'Cloud Computing'],
            enrollmentStatus: EnrollmentStatus.ACTIVE,
            cohortId: cohort.id,
            termsAccepted: true,
            termsAcceptedAt: new Date(),
            totalPoints: Math.floor(Math.random() * 1000),
            currentStreak: Math.floor(Math.random() * 30),
            longestStreak: Math.floor(Math.random() * 50),
            lastActivityDate: new Date(),
          },
        },
      },
      include: {
        student: true,
      },
    })
    students.push(student)
  }

  // Create Classes
  console.log('📚 Creating classes...')
  const classes = await Promise.all([
    prisma.class.create({
      data: {
        cohortId: cohort.id,
        instructorId: instructorUsers[0]!.instructor!.id,
        title: 'Introduction to Web Development',
        description: 'Learn the basics of HTML, CSS, and JavaScript',
        classType: ClassType.LECTURE,
        deliveryMode: DeliveryMode.ZOOM,
        topic: 'Web Fundamentals',
        monthNumber: 1,
        weekNumber: 1,
        scheduledAt: new Date('2024-01-20T10:00:00'),
        duration: 120,
        zoomLink: 'https://zoom.us/j/123456789',
      },
    }),
    prisma.class.create({
      data: {
        cohortId: cohort.id,
        instructorId: instructorUsers[1]!.instructor!.id,
        title: 'React Fundamentals',
        description: 'Introduction to React and component-based architecture',
        classType: ClassType.WORKSHOP,
        deliveryMode: DeliveryMode.ZOOM,
        topic: 'React',
        monthNumber: 2,
        weekNumber: 5,
        scheduledAt: new Date('2024-02-15T14:00:00'),
        duration: 180,
        zoomLink: 'https://zoom.us/j/987654321',
      },
    }),
  ])

  // Create Attendance
  console.log('✅ Creating attendance records...')
  for (const student of students.slice(0, 3)) {
    await prisma.attendance.create({
      data: {
        studentId: student!.student!.id,
        classId: classes[0].id,
        status: AttendanceStatus.PRESENT,
        method: AttendanceMethod.QR_CODE,
        checkInTime: new Date('2024-01-20T10:05:00'),
        participationScore: Math.floor(Math.random() * 5) + 6,
      },
    })
  }

  // Create Assignments
  console.log('📝 Creating assignments...')
  const assignment = await prisma.assignment.create({
    data: {
      title: 'Build a Portfolio Website',
      description: 'Create a personal portfolio website using HTML, CSS, and JavaScript',
      type: AssignmentType.CODING_CHALLENGE,
      monthNumber: 1,
      weekNumber: 2,
      topic: 'Web Development',
      instructions: 'Create a responsive portfolio website with at least 3 pages: Home, About, and Projects.',
      resourceUrls: ['https://developer.mozilla.org/en-US/docs/Web/HTML'],
      maxScore: 100,
      passingScore: 70,
      dueDate: new Date('2024-02-01T23:59:59'),
      allowLate: true,
      latePenalty: 10,
    },
  })

  // Create Projects
  console.log('💻 Creating projects...')
  for (const student of students.slice(0, 2)) {
    await prisma.project.create({
      data: {
        studentId: student.student!.id,
        title: 'E-commerce Platform',
        description: 'A full-stack e-commerce application with shopping cart and payment integration',
        monthNumber: 3,
        githubUrl: `https://github.com/student${student.id}/ecommerce`,
        liveUrl: `https://ecommerce-${student.id}.vercel.app`,
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
        status: ProjectStatus.SUBMITTED,
        submittedAt: new Date(),
        overallScore: 85,
        codeQuality: 8,
        functionality: 9,
        design: 8,
        documentation: 7,
        innovation: 9,
      },
    })
  }

  // Create Resources
  console.log('📖 Creating resources...')
  await Promise.all([
    prisma.resource.create({
      data: {
        title: 'MDN Web Docs',
        description: 'Comprehensive web development documentation',
        type: ResourceType.DOCUMENTATION,
        url: 'https://developer.mozilla.org',
        monthNumber: 1,
        weekNumber: 1,
        topic: 'Web Development',
        tags: ['HTML', 'CSS', 'JavaScript'],
        isOfficial: true,
      },
    }),
    prisma.resource.create({
      data: {
        title: 'React Official Tutorial',
        description: 'Learn React from the official documentation',
        type: ResourceType.TUTORIAL,
        url: 'https://react.dev/learn',
        monthNumber: 2,
        topic: 'React',
        tags: ['React', 'Frontend', 'JavaScript'],
        isOfficial: true,
      },
    }),
  ])

  // Create Courses
  console.log('🎓 Creating curriculum courses...')
  const course = await prisma.course.create({
    data: {
      slug: 'full-stack-web-development',
      title: 'Full Stack Web Development',
      description: 'Master modern web development from frontend to backend',
      durationWeeks: 24,
      level: CourseLevel.INTERMEDIATE,
      isPublished: true,
      tags: ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
      weeks: {
        create: [
          {
            weekNumber: 1,
            title: 'HTML & CSS Fundamentals',
            description: 'Learn the building blocks of web development',
            objectives: {
              objectives: [
                'Understand HTML structure and semantics',
                'Master CSS styling and layout',
                'Create responsive designs',
              ],
            },
            order: 1,
            lessons: {
              create: [
                {
                  dayNumber: 1,
                  title: 'Introduction to HTML',
                  type: LessonType.VIDEO,
                  objectives: {
                    objectives: ['Learn HTML basics', 'Understand document structure'],
                  },
                  content: '# Introduction to HTML\n\nHTML is the foundation of web development...',
                  videoUrl: 'https://youtube.com/watch?v=example',
                  durationMins: 45,
                  order: 1,
                  tasks: {
                    create: [
                      {
                        title: 'Create Your First HTML Page',
                        description: 'Build a simple HTML page with various elements',
                        instructions: 'Create an HTML file with header, paragraph, list, and image elements.',
                        starterCode: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <!-- Your code here -->\n</body>\n</html>',
                        difficulty: TaskDifficulty.EASY,
                        estimatedTime: 30,
                        order: 1,
                        hints: {
                          hints: [
                            'Start with a heading tag',
                            'Use <p> for paragraphs',
                            'Lists can be <ul> or <ol>',
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  dayNumber: 2,
                  title: 'CSS Styling Basics',
                  type: LessonType.INTERACTIVE,
                  objectives: {
                    objectives: ['Learn CSS syntax', 'Apply styles to HTML elements'],
                  },
                  content: '# CSS Styling\n\nCSS allows you to style your HTML elements...',
                  durationMins: 50,
                  order: 2,
                },
              ],
            },
            assignment: {
              create: {
                title: 'Build a Landing Page',
                description: 'Create a responsive landing page using HTML and CSS',
                requirements: {
                  requirements: [
                    'Responsive design',
                    'Navigation menu',
                    'Hero section',
                    'Feature section',
                    'Footer',
                  ],
                },
                estimatedTime: 240,
                successCriteria: {
                  criteria: ['Mobile responsive', 'Clean code', 'Semantic HTML'],
                },
                maxScore: 100,
                dueDate: new Date('2024-02-08T23:59:59'),
              },
            },
          },
        ],
      },
      projects: {
        create: [
          {
            title: 'Portfolio Website',
            description: 'Build a professional portfolio website',
            milestones: {
              milestones: ['Design mockup', 'HTML structure', 'CSS styling', 'Deploy'],
            },
            requirements: {
              requirements: ['Responsive', 'Multiple pages', 'Contact form'],
            },
            rubric: {
              criteria: [
                { name: 'Design', points: 30 },
                { name: 'Functionality', points: 40 },
                { name: 'Code Quality', points: 30 },
              ],
            },
            estimatedTime: 480,
            order: 1,
            isFinal: false,
          },
        ],
      },
    },
  })

  // Enroll students in course
  console.log('📝 Enrolling students in courses...')
  for (const student of students.slice(0, 3)) {
    await prisma.courseEnrollment.create({
      data: {
        studentId: student!.student!.id,
        courseId: course.id,
        currentWeekNumber: 1,
        progressPercent: Math.random() * 50,
      },
    })
  }

  // Create Live Classes
  console.log('🎥 Creating live classes...')
  const liveClass = await prisma.liveClass.create({
    data: {
      title: 'React Hooks Deep Dive',
      description: 'Advanced concepts in React Hooks',
      cohortId: cohort.id,
      instructorId: instructorUsers[0]!.instructor!.id,
      scheduledAt: new Date('2024-03-01T15:00:00'),
      duration: 90,
      meetingLink: 'https://zoom.us/j/555666777',
      meetingId: '555666777',
      status: LiveClassStatus.SCHEDULED,
      maxStudents: 30,
      chatEnabled: true,
      isRecorded: true,
    },
  })

  // Enroll students in live class
  for (const student of students) {
    await prisma.liveClassEnrollment.create({
      data: {
        liveClassId: liveClass.id,
        studentId: student!.student!.id,
      },
    })
  }

  // Create Conversations
  console.log('💬 Creating conversations...')
  const conversation = await prisma.conversation.create({
    data: {
      name: 'Cohort General Chat',
      type: ConversationType.COHORT_CHANNEL,
      cohortId: cohort.id,
      createdBy: adminUser.id,
      participants: {
        create: students.map((student) => ({
          userId: student.id,
          role: 'MEMBER',
        })),
      },
    },
  })

  // Create Messages
  console.log('💬 Creating messages...')
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: students[0].id,
      content: 'Hey everyone! Excited to start this journey together! 🚀',
      type: MessageType.TEXT,
    },
  })

  // Create Notifications
  console.log('🔔 Creating notifications...')
  for (const student of students.slice(0, 2)) {
    await prisma.notification.create({
      data: {
        userId: student.id,
        type: NotificationType.CLASS_REMINDER,
        title: 'Upcoming Class',
        message: 'Your class "React Fundamentals" starts in 1 hour',
        actionUrl: '/classes/upcoming',
      },
    })
  }

  // Create Achievements
  console.log('🏆 Creating achievements...')
  await prisma.achievement.create({
    data: {
      studentId: students[0].student!.id,
      type: AchievementType.MILESTONE,
      name: 'First Project Submitted',
      description: 'Congratulations on submitting your first project!',
      criteria: 'Submit any project',
      points: 50,
    },
  })

  // Create Skill Proficiencies
  console.log('📊 Creating skill proficiencies...')
  const skills = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js']
  for (const student of students.slice(0, 2)) {
    for (const skill of skills) {
      await prisma.skillProficiency.create({
        data: {
          studentId: student!.student!.id,
          skillName: skill,
          category: 'Frontend',
          proficiencyScore: Math.floor(Math.random() * 100),
          level: SkillLevel.INTERMEDIATE,
          lastAssessedAt: new Date(),
        },
      })
    }
  }

  console.log('✅ Seed completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`- 1 Admin user created (admin@decvi.com)`)
  console.log(`- ${instructorUsers.length} Instructors created`)
  console.log(`- ${students.length} Students created`)
  console.log(`- 1 Cohort created`)
  console.log(`- ${classes.length} Classes created`)
  console.log(`- 1 Course with curriculum created`)
  console.log(`- 1 Live class created`)
  console.log(`- 1 Conversation with messages created`)
  console.log('\n🔑 Login credentials:')
  console.log('Admin: admin@decvi.com / Password123!')
  console.log('Instructor: john.doe@decvi.com / Password123!')
  console.log('Student: student1@example.com / Password123!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })