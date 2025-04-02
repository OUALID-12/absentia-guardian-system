
export type UserRole = "student" | "supervisor";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  class?: string; // For students
}

export interface Absence {
  id: string;
  studentId: string;
  date: string;
  courseId: string;
  courseName: string;
  justified: boolean;
  justificationId?: string;
}

export interface Justification {
  id: string;
  absenceId: string;
  studentId: string;
  date: string;
  reason: string;
  documentUrl?: string;
  status: "pending" | "approved" | "rejected";
  supervisorId?: string;
  supervisorComment?: string;
}

export interface Course {
  id: string;
  name: string;
  classId: string;
  className: string;
  schedule: string;
}

export interface ClassData {
  id: string;
  name: string;
  department: string;
}
