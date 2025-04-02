
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { absences } from "@/lib/mock-data";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getAbsenceStatsByMonth } from "@/lib/mock-data";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  
  if (!currentUser) return null;
  
  // Filter absences for the current student
  const studentAbsences = absences.filter(absence => absence.studentId === currentUser.id);
  
  // Get statistics
  const totalAbsences = studentAbsences.length;
  const justifiedAbsences = studentAbsences.filter(a => a.justified).length;
  const unjustifiedAbsences = totalAbsences - justifiedAbsences;
  
  // Recent absences (last 3)
  const recentAbsences = [...studentAbsences]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  // Chart data
  const chartData = getAbsenceStatsByMonth(currentUser.id);

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Tableau de bord - {currentUser.firstName} {currentUser.lastName}
        </h1>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Absences Totales</CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success-700">{totalAbsences}</div>
              <p className="text-xs text-gray-500 mt-1">Pendant cette année</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Absences Justifiées</CardTitle>
              <Clock className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success-700">{justifiedAbsences}</div>
              <p className="text-xs text-gray-500 mt-1">{(justifiedAbsences / totalAbsences * 100).toFixed(1)}% du total</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Absences Non Justifiées</CardTitle>
              <AlertCircle className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success-700">{unjustifiedAbsences}</div>
              <p className="text-xs text-gray-500 mt-1">{(unjustifiedAbsences / totalAbsences * 100).toFixed(1)}% du total</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-0 shadow-sm md:col-span-2">
            <CardHeader>
              <CardTitle>Évolution des absences</CardTitle>
              <CardDescription>Sur les 6 derniers mois</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="justified" name="Justifiées" fill="#10B981" />
                  <Bar dataKey="unjustified" name="Non Justifiées" fill="#F87171" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Absences récentes</CardTitle>
              <CardDescription>Dernières absences enregistrées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAbsences.length > 0 ? (
                  recentAbsences.map(absence => (
                    <div key={absence.id} className="flex items-start space-x-3">
                      <span className={`flex h-2 w-2 mt-1 rounded-full ${absence.justified ? 'bg-success-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="text-sm font-medium">{absence.courseName}</p>
                        <p className="text-xs text-gray-500">{new Date(absence.date).toLocaleDateString()}</p>
                        <p className="text-xs font-medium mt-1">
                          <span className={absence.justified ? 'text-success-600' : 'text-red-600'}>
                            {absence.justified ? 'Justifiée' : 'Non justifiée'}
                          </span>
                          {!absence.justified && (
                            <Link to="/student/claims" className="ml-2 text-success-600 hover:underline">
                              Justifier
                            </Link>
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Aucune absence récente</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;
