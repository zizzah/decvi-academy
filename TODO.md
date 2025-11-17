# TODO: Implement Project and Assignment Functions

## Steps to Complete:
- [ ] Create Student Projects Page (`/dashboard/projects`) - List all projects, submit new projects, view status with progress tracking
- [ ] Create Instructor Projects Page (`/instructor/projects`) - View all student projects, review pending submissions with feedback forms
- [x] Create Assignment API Endpoints - Full CRUD operations for assignments management
  - [x] `/api/assignments/route.ts` (GET, POST)
  - [x] `/api/assignments/[id]/route.ts` (GET, PUT, DELETE)
  - [x] `/api/assignments/[id]/submit/route.ts` (POST)
  - [x] `/api/instructor/assignments/route.ts` (GET)
- [ ] Create Student Assignments Page (`/dashboard/assignments`) - View available assignments, submit completed work
- [ ] Create Instructor Assignments Page (`/instructor/assignments`) - Create new assignments, view submissions, grade work
- [ ] Update Navigation - Make sidebar links functional in both dashboards
  - [ ] Update student dashboard sidebar links
  - [ ] Update instructor dashboard sidebar links
- [ ] Create Form Components
  - [ ] ProjectSubmissionForm component
  - [ ] ProjectReviewForm component
  - [ ] AssignmentCreationForm component
  - [ ] AssignmentSubmissionForm component
- [ ] Test all CRUD operations and form submissions
- [ ] Verify role-based access control
- [ ] Add proper error handling and loading states
- [ ] Ensure responsive design across devices
