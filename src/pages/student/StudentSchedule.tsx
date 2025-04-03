
import { useAuth } from "@/contexts/AuthContext";
import { getStudentSchedule } from "@/lib/mock-data";
import MainLayout from "@/components/layout/MainLayout";
import { useEffect, useState } from "react";
import { ScheduleEntry, WeeklySchedule } from "@/types";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, MapPin, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00"
];

const StudentSchedule = () => {
  const { currentUser } = useAuth();
  const [schedule, setSchedule] = useState<WeeklySchedule>({});
  const [activeView, setActiveView] = useState<"list" | "grid">("grid");
  
  useEffect(() => {
    // Fetch schedule data for the student's class
    if (currentUser?.class) {
      const classId = "1"; // Hardcoded for demo, would be dynamically determined
      const studentSchedule = getStudentSchedule(classId);
      setSchedule(studentSchedule);
    }
  }, [currentUser]);
  
  // Function to check if there's an event at a specific day and time
  const getEventAtTime = (day: string, time: string): ScheduleEntry | null => {
    if (!schedule[day]) return null;
    
    return schedule[day].find(event => 
      event.startTime <= time && event.endTime > time
    ) || null;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight dark:text-white">Emploi du temps</h1>
            <p className="text-muted-foreground dark:text-gray-400">
              Consultez votre emploi du temps hebdomadaire.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Badge 
              variant={activeView === "grid" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveView("grid")}
            >
              Grille
            </Badge>
            <Badge 
              variant={activeView === "list" ? "default" : "outline"} 
              className="cursor-pointer"
              onClick={() => setActiveView("list")}
            >
              Liste
            </Badge>
          </div>
        </div>
        
        {activeView === "grid" ? (
          <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-medium dark:text-white">
                Vue en grille - Semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20 dark:text-gray-300">Heures</TableHead>
                      {daysOfWeek.map(day => (
                        <TableHead key={day} className="dark:text-gray-300">{day}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timeSlots.map(time => (
                      <TableRow key={time}>
                        <TableCell className="font-medium dark:text-gray-300">{time}</TableCell>
                        {daysOfWeek.map(day => {
                          const event = getEventAtTime(day, time);
                          return (
                            <TableCell 
                              key={`${day}-${time}`} 
                              className={`${event ? 'bg-success-50 dark:bg-success-900/20' : ''} dark:text-gray-300`}
                            >
                              {event && (
                                <div className="p-1">
                                  <p className="font-medium text-sm">{event.courseName}</p>
                                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                    <MapPin className="h-3 w-3" />
                                    <span>{event.location}</span>
                                  </div>
                                </div>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {daysOfWeek.map(day => (
              <Card key={day} className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg font-medium dark:text-white">{day}</CardTitle>
                </CardHeader>
                <CardContent>
                  {schedule[day] && schedule[day].length > 0 ? (
                    <div className="space-y-3">
                      {schedule[day].map(event => (
                        <div 
                          key={event.id} 
                          className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                        >
                          <p className="font-medium text-lg dark:text-white">{event.courseName}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                              <Clock className="h-4 w-4" />
                              <span>{event.startTime} - {event.endTime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                              <User className="h-4 w-4" />
                              <span>{event.teacher}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">Aucun cours prévu ce jour.</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default StudentSchedule;
