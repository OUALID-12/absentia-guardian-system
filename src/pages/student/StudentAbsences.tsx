
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { absences } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Check, X, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const StudentAbsences = () => {
  const { currentUser } = useAuth();
  
  if (!currentUser) return null;
  
  // Filter absences for the current student
  const studentAbsences = absences.filter(absence => absence.studentId === currentUser.id);
  
  // Sort by date (newest first)
  const sortedAbsences = [...studentAbsences].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Historique des absences
          </h1>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Cours</TableHead>
                  <TableHead className="hidden md:table-cell">Horaire</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAbsences.length > 0 ? (
                  sortedAbsences.map((absence) => (
                    <TableRow key={absence.id}>
                      <TableCell>{new Date(absence.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{absence.courseName}</TableCell>
                      <TableCell className="hidden md:table-cell">9h00 - 12h00</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {absence.justified ? (
                            <>
                              <Check className="h-4 w-4 mr-1 text-success-600" />
                              <span className="text-success-600">Justifiée</span>
                            </>
                          ) : (
                            <>
                              <X className="h-4 w-4 mr-1 text-red-600" />
                              <span className="text-red-600">Non justifiée</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {!absence.justified ? (
                          <Link to="/student/claims">
                            <Button variant="outline" size="sm" className="text-success-600 border-success-600 hover:bg-success-50">
                              <FileText className="h-4 w-4 mr-1" />
                              Justifier
                            </Button>
                          </Link>
                        ) : (
                          <Button variant="ghost" size="sm" disabled>
                            Justifiée
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      Aucune absence enregistrée
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentAbsences;
