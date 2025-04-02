
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { absences, users, classes } from "@/lib/mock-data";
import { UserCheck, Clock, AlertTriangle, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { getClassAbsenceStats } from "@/lib/mock-data";

const SupervisorDashboard = () => {
  const { currentUser } = useAuth();
  
  if (!currentUser) return null;
  
  // Stats
  const totalStudents = users.filter(user => user.role === "student").length;
  const totalAbsences = absences.length;
  const justifiedAbsences = absences.filter(a => a.justified).length;
  const justificationRate = (justifiedAbsences / totalAbsences * 100).toFixed(1);
  const unjustifiedAbsences = totalAbsences - justifiedAbsences;
  
  // Chart data
  const classAbsenceStats = getClassAbsenceStats();
  
  // Pie chart data
  const pieData = [
    { name: "Justifiées", value: justifiedAbsences, color: "#10B981" },
    { name: "Non justifiées", value: totalAbsences - justifiedAbsences, color: "#F87171" }
  ];
  
  // Recent unjustified absences
  const recentUnjustifiedAbsences = absences
    .filter(absence => !absence.justified)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Tableau de bord - Superviseur
        </h1>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-0 shadow-md relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1 bg-success-500"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Absences</CardTitle>
              <Clock className="h-5 w-5 text-success-600" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-success-700">{totalAbsences}</div>
              <p className="text-xs text-gray-500 mt-1">Ce semestre</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1 bg-success-500"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Absences Justifiées</CardTitle>
              <UserCheck className="h-5 w-5 text-success-600" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-success-700">{justifiedAbsences}</div>
              <p className="text-xs text-gray-500 mt-1">{justificationRate}% du total</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1 bg-red-500"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">À suivre</CardTitle>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-500">
                {unjustifiedAbsences}
              </div>
              <p className="text-xs text-gray-500 mt-1">Absences non justifiées</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-md h-full">
              <CardHeader>
                <CardTitle>Absences par classe</CardTitle>
                <CardDescription>Répartition des absences par classe</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classAbsenceStats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="className" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="justified" 
                      name="Justifiées" 
                      fill="#10B981" 
                      radius={[4, 4, 0, 0]} 
                      barSize={30}
                    />
                    <Bar 
                      dataKey="unjustified" 
                      name="Non Justifiées" 
                      fill="#F87171" 
                      radius={[4, 4, 0, 0]} 
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Répartition des absences</CardTitle>
              <CardDescription>Justifiées vs Non justifiées</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} absences`, name]}
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Dernières absences non justifiées</CardTitle>
            <CardDescription>Absences nécessitant un suivi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-gray-500">Étudiant</th>
                    <th className="pb-3 font-medium text-gray-500">Classe</th>
                    <th className="pb-3 font-medium text-gray-500">Cours</th>
                    <th className="pb-3 font-medium text-gray-500">Date</th>
                    <th className="pb-3 font-medium text-gray-500">Délai</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentUnjustifiedAbsences.map(absence => {
                    const student = users.find(u => u.id === absence.studentId);
                    const absenceDate = new Date(absence.date);
                    const currentDate = new Date();
                    
                    // Calculate days since absence
                    const daysSince = Math.floor((currentDate.getTime() - absenceDate.getTime()) / (1000 * 3600 * 24));
                    
                    // Check if within 48 hours
                    const isWithin48h = daysSince <= 2;
                    const statusColor = isWithin48h ? "text-amber-500" : "text-red-500";
                    const statusText = isWithin48h ? `${daysSince}/2 jours` : "Délai expiré";
                    
                    return (
                      <tr key={absence.id} className="hover:bg-gray-50">
                        <td className="py-3">
                          <div className="flex items-center">
                            <span className="font-medium">{student?.firstName} {student?.lastName}</span>
                          </div>
                        </td>
                        <td className="py-3">{student?.class}</td>
                        <td className="py-3">{absence.courseName}</td>
                        <td className="py-3">{absenceDate.toLocaleDateString()}</td>
                        <td className="py-3">
                          <span className={`font-medium ${statusColor}`}>
                            {statusText}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SupervisorDashboard;
