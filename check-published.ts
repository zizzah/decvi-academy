// check-published.ts - Run this to see the isPublished status
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPublishedStatus() {
  try {
    console.log("--- Checking Course Published Status ---\n");

    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        isPublished: true,
        createdAt: true
      }
    });

    console.log(`Total courses in database: ${courses.length}\n`);

    courses.forEach(course => {
      console.log(`Course: ${course.title}`);
      console.log(`  Slug: ${course.slug}`);
      console.log(`  Published: ${course.isPublished}`);
      console.log(`  Created: ${course.createdAt}`);
      console.log('');
    });

    // Count published vs unpublished
    const published = courses.filter(c => c.isPublished === true).length;
    const unpublished = courses.filter(c => c.isPublished === false || c.isPublished === null).length;

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Published: ${published}`);
    console.log(`   ❌ Unpublished: ${unpublished}`);

    if (unpublished > 0) {
      console.log(`\n💡 Fix: Update courses to published status:`);
      console.log(`   Run: npx ts-node publish-courses.ts`);
    }

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPublishedStatus();