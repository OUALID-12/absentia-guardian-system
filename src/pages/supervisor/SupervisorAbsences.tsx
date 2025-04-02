
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { absences, users, classes, justifications } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Check, X, Mail, Search, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const SupervisorAbsences = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedAbsence, setSelectedAbsence] = useState<any | null>(null);
  
  if (!currentUser) return null;
  
  // Sort and filter absences
  const filteredAbsences = absences.filter(absence => {
    // Apply class filter
    if (selectedClass) {
      const student = users.find(u => u.id === absence.studentId);
      if (student?.class !== selectedClass) return false;
    }
    
    // Apply status filter
    if (filter === "justified" && !absence.justified) return false;
    if (filter === "unjustified" && absence.justified) return false;
    
    // Apply search term
    if (searchTerm) {
      const student = users.find(u => u.id === absence.studentId);
      const studentName = `${student?.firstName} ${student?.lastName}`.toLowerCase();
      const courseName = absence.courseName.toLowerCase();
      
      return (
        studentName.includes(searchTerm.toLowerCase()) ||
        courseName.includes(searchTerm.toLowerCase())
      );
    }
    
    return true;
  });
  
  const sortedAbsences = [...filteredAbsences].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Check if absence has a justification request
  const hasJustificationRequest = (absenceId: string) => {
    return justifications.some(j => j.absenceId === absenceId);
  };
  
  // Get justification status for an absence
  const getJustificationStatus = (absenceId: string) => {
    const justification = justifications.find(j => j.absenceId === absenceId);
    return justification?.status || null;
  };
  
  // Handle send email notification
  const handleSendNotification = (absence: any) => {
    const student = users.find(u => u.id === absence.studentId);
    
    toast({
      title: "Notification envoyée",
      description: `Un email a été envoyé aux parents de ${student?.firstName} ${student?.lastName}.`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Suivi des absences
          </h1>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                className="pl-10 w-full md:w-auto" 
                placeholder="Rechercher..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="justified">Justifiées</SelectItem>
                  <SelectItem value="unjustified">Non justifiées</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Select 
              value={selectedClass || ""} 
              onValueChange={value => setSelectedClass(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrer par classe" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Toutes les classes</SelectItem>
                  {classes.map(c => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Étudiant</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Cours</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAbsences.length > 0 ? (
                  sortedAbsences.map((absence) => {
                    const student = users.find(u => u.id === absence.studentId);
                    const absenceDate = new Date(absence.date);
                    const currentDate = new Date();
                    
                    // Calculate days since absence
                    const daysSince = Math.floor((currentDate.getTime() - absenceDate.getTime()) / (1000 * 3600 * 24));
                    
                    // Check if within 48 hours justification period
                    const isWithin48h = daysSince <= 2;
                    const hasRequest = hasJustificationRequest(absence.id);
                    const justificationStatus = getJustificationStatus(absence.id);

                    return (
                      <TableRow key={absence.id}>
                        <TableCell className="font-medium">
                          {student?.firstName} {student?.lastName}
                        </TableCell>
                        <TableCell>{student?.class}</TableCell>
                        <TableCell>{absence.courseName}</TableCell>
                        <TableCell>{absenceDate.toLocaleDateString()}</TableCell>
                        <TableCell>
                          {absence.justified ? (
                            <div className="flex items-center">
                              <Check className="h-4 w-4 mr-1 text-success-600" />
                              <span className="text-success-600">Justifiée</span>
                            </div>
                          ) : hasRequest ? (
                            <div className="flex items-center">
                              {justificationStatus === "pending" ? (
                                <span className="text-amber-500">Réclamation en attente</span>
                              ) : (
                                <span className={justificationStatus === "approved" ? "text-success-600" : "text-red-600"}>
                                  Réclamation {justificationStatus === "approved" ? "approuvée" : "rejetée"}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <X className="h-4 w-4 mr-1 text-red-600" />
                              <span className="text-red-600">
                                Non justifiée {isWithin48h ? `(${daysSince}/2j)` : ""}
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {hasRequest && justificationStatus === "pending" && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="text-amber-600 border-amber-600 hover:bg-amber-50"
                                    onClick={() => setSelectedAbsence(absence)}
                                  >
                                    <FileText className="h-4 w-4 mr-1" />
                                    Voir réclamation
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Réclamation pour absence</DialogTitle>
                                    <DialogDescription>
                                      Examen de la justification soumise par l'étudiant
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="grid gap-4 py-4">
                                    <div className="grid gap-1">
                                      <Label>Étudiant</Label>
                                      <p className="text-sm font-medium">
                                        {student?.firstName} {student?.lastName}
                                      </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="grid gap-1">
                                        <Label>Date d'absence</Label>
                                        <p className="text-sm">{absenceDate.toLocaleDateString()}</p>
                                      </div>
                                      <div className="grid gap-1">
                                        <Label>Cours</Label>
                                        <p className="text-sm">{absence.courseName}</p>
                                      </div>
                                    </div>
                                    <div className="grid gap-1">
                                      <Label>Motif</Label>
                                      <p className="text-sm p-3 bg-gray-50 rounded">
                                        {justifications.find(j => j.absenceId === absence.id)?.reason}
                                      </p>
                                    </div>
                                    <div className="grid gap-1">
                                      <Label>Document</Label>
                                      <Button variant="outline" size="sm" className="w-fit">
                                        <FileText className="h-4 w-4 mr-1" />
                                        Voir le document
                                      </Button>
                                    </div>
                                    <div className="grid gap-1">
                                      <Label htmlFor="comment">Commentaire</Label>
                                      <Input id="comment" placeholder="Ajouter un commentaire (optionnel)" />
                                    </div>
                                  </div>
                                  
                                  <DialogFooter className="gap-2 sm:gap-0">
                                    <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                                      Rejeter
                                    </Button>
                                    <Button className="bg-success-600 hover:bg-success-700">
                                      Approuver
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                            
                            {!absence.justified && !isWithin48h && !hasRequest && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => handleSendNotification(absence)}
                              >
                                <Mail className="h-4 w-4 mr-1" />
                                Notifier
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                      Aucune absence trouvée
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

export default SupervisorAbsences;
