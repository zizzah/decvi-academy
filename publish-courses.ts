// publish-courses.ts - Run this to publish all courses
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function publishAllCourses() {
  try {
    console.log("--- Publishing All Courses ---\n");

    // Update all courses to published
    const result = await prisma.course.updateMany({
      data: {
        isPublished: true
      }
    });

    console.log(`✅ Successfully published ${result.count} courses\n`);

    // Verify the update
    const publishedCourses = await prisma.course.findMany({
      where: {
        isPublished: true
      },
      select: {
        title: true,
        slug: true,
        level: true
      }
    });

    console.log("📚 Published Courses:");
    publishedCourses.forEach((course, idx) => {
      console.log(`   ${idx + 1}. ${course.title} (${course.level})`);
    });

    console.log(`\n✨ All done! Your courses should now appear in /study/courses`);

  } catch (error) {
    console.error("Error publishing courses:", error);
  } finally {
    await prisma.$disconnect();
  }
}

publishAllCourses();