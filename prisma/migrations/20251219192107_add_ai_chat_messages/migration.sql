-- CreateTable
CREATE TABLE "AIChatMessage" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIChatMessage_lessonId_studentId_timestamp_idx" ON "AIChatMessage"("lessonId", "studentId", "timestamp");

-- AddForeignKey
ALTER TABLE "AIChatMessage" ADD CONSTRAINT "AIChatMessage_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "course_lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIChatMessage" ADD CONSTRAINT "AIChatMessage_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
