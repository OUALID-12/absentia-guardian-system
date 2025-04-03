import { Absence, ClassData, Course, Justification, ScheduleEntry, User, WeeklySchedule } from "@/types";

// Mock Users
export const users: User[] = [
  {
    id: "1",
    email: "student@example.com",
    firstName: "Ahmed",
    lastName: "Benali",
    role: "student",
    avatar: "/placeholder.svg",
    class: "Informatique 3A"
  },
  {
    id: "2",
    email: "supervisor@example.com",
    firstName: "Marie",
    lastName: "Dubois",
    role: "supervisor",
    avatar: "/placeholder.svg"
  },
  {
    id: "3",
    email: "student2@example.com",
    firstName: "Sarah",
    lastName: "Mansour",
    role: "student",
    avatar: "/placeholder.svg",
    class: "Informatique 3A"
  }
];

// Mock Classes
export const classes: ClassData[] = [
  { id: "1", name: "Informatique 3A", department: "Informatique" },
  { id: "2", name: "Mathématiques 2A", department: "Mathématiques" },
  { id: "3", name: "Chimie 1A", department: "Sciences" }
];

// Mock Courses
export const courses: Course[] = [
  {
    id: "1",
    name: "Programmation Web",
    classId: "1",
    className: "Informatique 3A",
    schedule: "Lundi 9:00 - 12:00"
  },
  {
    id: "2",
    name: "Base de Données",
    classId: "1",
    className: "Informatique 3A",
    schedule: "Mardi 14:00 - 17:00"
  },
  {
    id: "3",
    name: "Intelligence Artificielle",
    classId: "1",
    className: "Informatique 3A",
    schedule: "Jeudi 9:00 - 12:00"
  },
  {
    id: "4",
    name: "Algorithmes Avancés",
    classId: "1",
    className: "Informatique 3A",
    schedule: "Mercredi 8:00 - 11:00"
  },
  {
    id: "5",
    name: "Réseau",
    classId: "1",
    className: "Informatique 3A",
    schedule: "Vendredi 13:00 - 16:00"
  },
  {
    id: "6",
    name: "Calcul Différentiel",
    classId: "2",
    className: "Mathématiques 2A",
    schedule: "Lundi 8:00 - 10:00"
  },
  {
    id: "7",
    name: "Algèbre Linéaire",
    classId: "2",
    className: "Mathématiques 2A",
    schedule: "Mercredi 14:00 - 17:00"
  }
];

// Mock Absences
export const absences: Absence[] = [
  {
    id: "1",
    studentId: "1",
    date: "2023-10-15",
    courseId: "1",
    courseName: "Programmation Web",
    justified: true,
    justificationId: "1"
  },
  {
    id: "2",
    studentId: "1",
    date: "2023-10-20",
    courseId: "2",
    courseName: "Base de Données",
    justified: false
  },
  {
    id: "3",
    studentId: "3",
    date: "2023-10-22",
    courseId: "3",
    courseName: "Intelligence Artificielle",
    justified: false
  },
  {
    id: "4",
    studentId: "1",
    date: "2023-11-05",
    courseId: "1",
    courseName: "Programmation Web",
    justified: false
  }
];

// Mock Justifications
export const justifications: Justification[] = [
  {
    id: "1",
    absenceId: "1",
    studentId: "1",
    date: "2023-10-16",
    reason: "Certificat médical",
    documentUrl: "/placeholder.svg",
    status: "approved",
    supervisorId: "2",
    supervisorComment: "Certificat validé"
  }
];

// Mock Schedule Entries
export const scheduleEntries: ScheduleEntry[] = [
  {
    id: "1",
    day: "Lundi",
    startTime: "09:00",
    endTime: "12:00",
    courseId: "1",
    courseName: "Programmation Web",
    className: "Informatique 3A",
    location: "Salle 101",
    teacher: "Dr. Hamid Alami"
  },
  {
    id: "2",
    day: "Mardi",
    startTime: "14:00",
    endTime: "17:00",
    courseId: "2",
    courseName: "Base de Données",
    className: "Informatique 3A",
    location: "Salle 203",
    teacher: "Prof. Nadia Tazi"
  },
  {
    id: "3",
    day: "Mercredi",
    startTime: "08:00",
    endTime: "11:00",
    courseId: "4",
    courseName: "Algorithmes Avancés",
    className: "Informatique 3A",
    location: "Salle 102",
    teacher: "Dr. Omar Benmoussa"
  },
  {
    id: "4",
    day: "Jeudi",
    startTime: "09:00",
    endTime: "12:00",
    courseId: "3",
    courseName: "Intelligence Artificielle",
    className: "Informatique 3A",
    location: "Salle 305",
    teacher: "Prof. Laila Hassan"
  },
  {
    id: "5",
    day: "Vendredi",
    startTime: "13:00",
    endTime: "16:00",
    courseId: "5",
    courseName: "Réseau",
    className: "Informatique 3A",
    location: "Salle 204",
    teacher: "Dr. Karim Idrissi"
  },
  {
    id: "6",
    day: "Lundi",
    startTime: "08:00",
    endTime: "10:00",
    courseId: "6",
    courseName: "Calcul Différentiel",
    className: "Mathématiques 2A",
    location: "Salle 401",
    teacher: "Prof. Sarah Bennani"
  },
  {
    id: "7",
    day: "Mercredi",
    startTime: "14:00",
    endTime: "17:00",
    courseId: "7",
    courseName: "Algèbre Linéaire",
    className: "Mathématiques 2A",
    location: "Salle 403",
    teacher: "Dr. Mohammed El Khatib"
  }
];

// Format schedule entries into weekly schedule
export const getStudentSchedule = (classId: string): WeeklySchedule => {
  const classSchedule = scheduleEntries.filter(entry => {
    const course = courses.find(c => c.id === entry.courseId);
    return course?.classId === classId;
  });
  
  // Group by day
  return classSchedule.reduce((acc: WeeklySchedule, entry) => {
    if (!acc[entry.day]) {
      acc[entry.day] = [];
    }
    
    acc[entry.day].push(entry);
    // Sort by start time
    acc[entry.day].sort((a, b) => a.startTime.localeCompare(b.startTime));
    
    return acc;
  }, {} as WeeklySchedule);
};

// Helper functions to simulate API calls
export const getMockData = () => {
  return {
    users,
    classes,
    courses,
    absences,
    justifications,
    scheduleEntries
  };
};

export const getAbsenceStatsByMonth = (studentId?: string) => {
  // Mock data for charts
  return [
    { name: "Jan", justified: 2, unjustified: 1 },
    { name: "Feb", justified: 1, unjustified: 0 },
    { name: "Mar", justified: 3, unjustified: 2 },
    { name: "Apr", justified: 0, unjustified: 1 },
    { name: "May", justified: 1, unjustified: 0 },
    { name: "Jun", justified: 0, unjustified: 0 }
  ];
};

export const getClassAbsenceStats = () => {
  return [
    { className: "Informatique 3A", total: 24, justified: 18, unjustified: 6 },
    { className: "Mathématiques 2A", total: 18, justified: 14, unjustified: 4 },
    { className: "Chimie 1A", total: 12, justified: 10, unjustified: 2 }
  ];
};
