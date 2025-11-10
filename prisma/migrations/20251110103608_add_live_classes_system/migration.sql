-- CreateEnum
CREATE TYPE "LiveClassStatus" AS ENUM ('SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "live_classes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "cohortId" TEXT,
    "instructorId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "duration" INTEGER NOT NULL,
    "meetingLink" TEXT,
    "meetingId" TEXT,
    "meetingPassword" TEXT,
    "status" "LiveClassStatus" NOT NULL DEFAULT 'SCHEDULED',
    "maxStudents" INTEGER,
    "recordingUrl" TEXT,
    "chatEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isRecorded" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "live_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "live_class_enrollments" (
    "id" TEXT NOT NULL,
    "liveClassId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "attended" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" TIMESTAMP(3),
    "leftAt" TIMESTAMP(3),
    "durationMins" INTEGER,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "live_class_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "live_classes_instructorId_idx" ON "live_classes"("instructorId");

-- CreateIndex
CREATE INDEX "live_classes_cohortId_idx" ON "live_classes"("cohortId");

-- CreateIndex
CREATE INDEX "live_classes_scheduledAt_idx" ON "live_classes"("scheduledAt");

-- CreateIndex
CREATE INDEX "live_classes_status_idx" ON "live_classes"("status");

-- CreateIndex
CREATE INDEX "live_class_enrollments_studentId_idx" ON "live_class_enrollments"("studentId");

-- CreateIndex
CREATE INDEX "live_class_enrollments_liveClassId_attended_idx" ON "live_class_enrollments"("liveClassId", "attended");

-- CreateIndex
CREATE UNIQUE INDEX "live_class_enrollments_liveClassId_studentId_key" ON "live_class_enrollments"("liveClassId", "studentId");

-- AddForeignKey
ALTER TABLE "live_classes" ADD CONSTRAINT "live_classes_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "instructors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "live_classes" ADD CONSTRAINT "live_classes_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "cohorts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "live_class_enrollments" ADD CONSTRAINT "live_class_enrollments_liveClassId_fkey" FOREIGN KEY ("liveClassId") REFERENCES "live_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "live_class_enrollments" ADD CONSTRAINT "live_class_enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
