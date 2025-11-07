import { z } from "zod"

// Reusable regex patterns
const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const isoDatetimeRegex =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})?$/

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const urlRegex =
  /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/i

// ✅ Student Registration Schema
export const studentRegistrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z
    .string()
    .regex(emailRegex, { message: "Invalid email address" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  educationLevel: z.string().optional(),
  techInterests: z.array(z.string()).default([]),
  priorExperience: z
    .enum(["Beginner", "Intermediate", "Advanced"])
    .default("Beginner"),
})

// ✅ Login Schema
export const loginSchema = z.object({
  email: z.string().regex(emailRegex, { message: "Invalid email address" }),
  password: z.string().min(1, "Password is required"),
})

// ✅ Project Submission Schema
export const projectSubmissionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  githubUrl: z
    .string()
    .regex(urlRegex, { message: "Invalid GitHub URL" })
    .optional(),
  liveUrl: z.string().regex(urlRegex, { message: "Invalid URL" }).optional(),
  videoUrl: z
    .string()
    .regex(urlRegex, { message: "Invalid video URL" })
    .optional(),
  technologies: z.array(z.string()).min(1, "At least one technology required"),
  monthNumber: z.number().min(1).max(3),
})

// ✅ Attendance Schema
export const attendanceSchema = z.object({
  studentId: z
    .string()
    .regex(uuidRegex, { message: "Invalid studentId UUID" }),
  classId: z.string().regex(uuidRegex, { message: "Invalid classId UUID" }),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
  method: z.enum(["QR_CODE", "ZOOM_AUTO", "MANUAL"]),
  checkInTime: z
    .string()
    .regex(isoDatetimeRegex, { message: "Invalid datetime format" })
    .optional(),
  lateMinutes: z.number().min(0).default(0),
})

// ✅ Assignment Schema
export const assignmentSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  type: z.enum([
    "QUIZ",
    "CODING_CHALLENGE",
    "PRACTICAL_EXAM",
    "PEER_REVIEW",
    "ESSAY",
    "VIDEO_SUBMISSION",
  ]),
  monthNumber: z.number().min(1).max(3),
  weekNumber: z.number().min(1).max(4),
  topic: z.string(),
  instructions: z.string(),
  maxScore: z.number().min(1).default(100),
  passingScore: z.number().min(1).default(70),
  dueDate: z
    .string()
    .regex(isoDatetimeRegex, { message: "Invalid datetime format" }),
})
