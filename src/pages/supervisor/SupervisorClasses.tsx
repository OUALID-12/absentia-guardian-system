
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { absences, users, classes } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";

const SupervisorClasses = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  
  if (!currentUser) return null;
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Gestion des classes
          </h1>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              className="pl-10 w-full md:w-64" 
              placeholder="Rechercher une classe..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue={classes[0]?.id}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            {classes.map(cls => (
              <TabsTrigger key={cls.id} value={cls.id}>{cls.name}</TabsTrigger>
            ))}
          </TabsList>
          
          {classes.map(cls => {
            // Filter students for this class
            const classStudents = users.filter(
              user => user.role === "student" && user.class === cls.name
            );
            
            // Count absences for this class
            const classAbsences = absences.filter(absence => {
              const student = users.find(u => u.id === absence.studentId);
              return student?.class === cls.name;
            });
            
            // Count justified and unjustified absences
            const justifiedAbsences = classAbsences.filter(a => a.justified).length;
            const unjustifiedAbsences = classAbsences.length - justifiedAbsences;
            
            // Group absences by student
            const absencesByStudent = classStudents.map(student => {
              const studentAbsences = absences.filter(a => a.studentId === student.id);
              return {
                student,
                absenceCount: studentAbsences.length,
                justifiedCount: studentAbsences.filter(a => a.justified).length,
                unjustifiedCount: studentAbsences.filter(a => !a.justified).length
              };
            }).sort((a, b) => b.unjustifiedCount - a.unjustifiedCount);
            
            return (
              <TabsContent key={cls.id} value={cls.id} className="pt-6">
                <div className="grid gap-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Étudiants</CardTitle>
                        <Users className="h-4 w-4 text-gray-400" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-success-700">{classStudents.length}</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Absences</CardTitle>
                        <Users className="h-4 w-4 text-gray-400" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-success-700">{classAbsences.length}</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Non justifiées</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-gray-400" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-success-700">{unjustifiedAbsences}</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>Étudiants de la classe</CardTitle>
                      <CardDescription>Classés par nombre d'absences non justifiées</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b text-left">
                              <th className="pb-2 font-medium text-gray-500">Étudiant</th>
                              <th className="pb-2 font-medium text-gray-500">Absences totales</th>
                              <th className="pb-2 font-medium text-gray-500">Justifiées</th>
                              <th className="pb-2 font-medium text-gray-500">Non justifiées</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {absencesByStudent.map(({ student, absenceCount, justifiedCount, unjustifiedCount }) => (
                              <tr key={student.id} className="hover:bg-gray-50">
                                <td className="py-3">
                                  <div className="flex items-center">
                                    <span className="font-medium">{student.firstName} {student.lastName}</span>
                                  </div>
                                </td>
                                <td className="py-3 font-medium">{absenceCount}</td>
                                <td className="py-3">
                                  <span className="text-success-600 font-medium">{justifiedCount}</span>
                                </td>
                                <td className="py-3">
                                  <span className={`font-medium ${unjustifiedCount > 0 ? "text-red-600" : "text-gray-500"}`}>
                                    {unjustifiedCount}
                                  </span>
                                </td>
                              </tr>
                            ))}
                            
                            {absencesByStudent.length === 0 && (
                              <tr>
                                <td colSpan={4} className="py-6 text-center text-gray-500">
                                  Aucun étudiant dans cette classe
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SupervisorClasses;
