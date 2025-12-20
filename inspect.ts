import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function inspectSeededData() {
  try {
    console.log("--- Fetching Seeded Course Data ---\n");

    const courses = await prisma.course.findMany({
      include: {
        weeks: {
          orderBy: { weekNumber: 'asc' },
          include: {
            lessons: {
              orderBy: { dayNumber: 'asc' },
              include: {
                tasks: true, // Includes hands-on tasks for each lesson
              }
            },
            assignment: true, // Includes the weekly mini-project/assignment
          }
        }
      }
    });

    if (courses.length === 0) {
      console.log("No courses found. Ensure you have run your seed script.");
      return;
    }

    // Displaying the structure
    courses.forEach(course => {
      console.log(`COURSE: ${course.title} (${course.level})`);
      console.log(`Description: ${course.description.substring(0, 100)}...`);
      console.log(`Duration: ${course.durationWeeks} Weeks\n`);

      course.weeks.forEach(week => {
        console.log(`  [Week ${week.weekNumber}]: ${week.title}`);
        
        week.lessons.forEach(lesson => {
          console.log(`    - Day ${lesson.dayNumber}: ${lesson.title} (${lesson.durationMins} mins)`);
          if (lesson.tasks.length > 0) {
            lesson.tasks.forEach(task => {
              console.log(`        Task: ${task.title} [Diff: ${task.difficulty}]`);
            });
          }
        });

        if (week.assignment) {
          console.log(`    > Weekly Assignment: ${week.assignment.title}`);
        }
        console.log(""); // Spacer
      });
    });

  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

inspectSeededData();