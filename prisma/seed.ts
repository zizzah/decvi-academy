// prisma/seed.ts

import { PrismaClient, UserRole, EnrollmentStatus, ClassType, DeliveryMode, AttendanceStatus, AttendanceMethod, AssignmentType, ProjectStatus, SkillLevel, CertificateStatus, RecommendationType, RecommendationPriority, FeedbackType, ActivityType, ResourceType, NotificationType, LiveClassStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Seeds the database with initial data.
 * Creates an admin user, an instructor user, a cohort, a student user, a class, an attendance record, an assignment, and a project.
 * The data is hardcoded and should be replaced with actual data in a production environment.
 * @returns {Promise<void>} - Resolves when the seeding is complete.
 */
async function main() {
  console.log('🌱 Starting database seed...');

  // Create Admin
  const adminPasswordHash = await bcrypt.hash('AdminPass123!', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@decviacademy.com' },
    update: {},
    create: {
      email: 'admin@decviacademy.com',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      isVerified: true,
    },
  });

  // Create Instructor
  const instructorPasswordHash = await bcrypt.hash('InstructorPass123!', 10);
  const instructorUser = await prisma.user.upsert({
    where: { email: 'instructor@decviacademy.com' },
    update: {},
    create: {
      email: 'instructor@decviacademy.com',
      passwordHash: instructorPasswordHash,
      role: UserRole.INSTRUCTOR,
      isVerified: true,
      instructor: {
        create: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '+2348012345678',
          bio: 'Experienced full-stack instructor at Decvi Academy',
          expertise: ['React', 'Node.js', 'TypeScript'],
          yearsOfExp: 5,
        },
      },
    },
    include: { instructor: true },
  });

  if (!instructorUser.instructor) throw new Error('Instructor relation not created');

  // Create Cohort
  const cohort = await prisma.cohort.upsert({
    // use a stable unique id for upsert so CohortWhereUniqueInput is satisfied
    where: { id: 'cohort-1-web-dev' },
    update: {},
    create: {
      id: 'cohort-1-web-dev',
      name: 'Cohort 1 – Web Dev',
      description: 'First cohort for full-stack web dev program',
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    },
  });

  // Create Student
  const studentPasswordHash = await bcrypt.hash('StudentPass123!', 10);
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@decviacademy.com' },
    update: {},
    create: {
      email: 'student@decviacademy.com',
      passwordHash: studentPasswordHash,
      role: UserRole.STUDENT,
      isVerified: true,
      student: {
        create: {
          firstName: 'Jane',
          lastName: 'Smith',
          phone: '+2348012349000',
          country: 'Nigeria',
          techInterests: ['Frontend', 'UI/UX'],
          enrollmentStatus: EnrollmentStatus.ACTIVE,
          cohortId: cohort.id,
          termsAccepted: true,
        },
      },
    },
    include: { student: true },
  });

  if (!studentUser.student) throw new Error('Student relation not created');

  // Create Class
  const cls = await prisma.class.upsert({
    where: { id: 'class-intro-react-wk1' },
    update: {},
    create: {
      id: 'class-intro-react-wk1',
      cohortId: cohort.id,
      instructorId: instructorUser.instructor.id,
      title: 'Intro to React – Week 1',
      classType: ClassType.LECTURE,
      deliveryMode: DeliveryMode.ZOOM,
      topic: 'React Basics: Components & Props',
      monthNumber: 1,
      weekNumber: 1,
      scheduledAt: new Date(new Date().setDate(new Date().getDate() + 1)),
      duration: 90,
      zoomLink: 'https://zoom.us/react-wk1',
    },
  });

  // Create Attendance
  await prisma.attendance.create({
    data: {
      studentId: studentUser.student.id,
      classId: cls.id,
      status: AttendanceStatus.PRESENT,
      method: AttendanceMethod.QR_CODE,
      checkInTime: new Date(),
      participationScore: 8,
    },
  });

  // Create Assignment
  const assignment = await prisma.assignment.create({
    data: {
      title: 'Week 1 React Challenge',
      description: 'Build a simple React To-Do App',
      type: AssignmentType.CODING_CHALLENGE,
      monthNumber: 1,
      weekNumber: 1,
      topic: 'React Components & State',
      instructions: 'Use functional components and useState hook.',
      resourceUrls: ['https://react.dev/docs/getting-started'],
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    },
  });

  // Create Project
  await prisma.project.create({
    data: {
      studentId: studentUser.student.id,
      title: 'Personal Portfolio Website',
      description: 'A portfolio site built with React, Tailwind and deployed on Vercel.',
      monthNumber: 1,
      technologies: ['React', 'TailwindCSS', 'Vercel'],
      status: ProjectStatus.IN_PROGRESS,
      githubUrl: 'https://github.com/jane-smith/portfolio',
    },
  });

  // Create Live Class (currently active)
  const liveClass = await prisma.liveClass.create({
    data: {
      title: 'Live React Workshop',
      description: 'Interactive live session on React components and hooks',
      cohortId: cohort.id,
      instructorId: instructorUser.instructor.id,
      scheduledAt: new Date(), // Now
      startedAt: new Date(),
      duration: 120,
      meetingLink: 'https://zoom.us/live-react-workshop',
      meetingId: '123456789',
      status: LiveClassStatus.LIVE,
      maxStudents: 30,
      chatEnabled: true,
      isRecorded: true,
    },
  });

  // Enroll student in live class
  await prisma.liveClassEnrollment.create({
    data: {
      liveClassId: liveClass.id,
      studentId: studentUser.student.id,
      attended: false,
      enrolledAt: new Date(),
    },
  });

  console.log('✅ Seeding completed.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
