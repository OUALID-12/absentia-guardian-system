
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { absences, users, classes, justifications } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Check, X, MessageSquare, Search, FileText } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import JustificationActions from "@/components/absences/JustificationActions";
import { Justification } from "@/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const SupervisorAbsences = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedAbsence, setSelectedAbsence] = useState<any | null>(null);
  const [localJustifications, setLocalJustifications] = useState([...justifications]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [smsMessage, setSmsMessage] = useState("");
  const [smsPopoverOpen, setSmsPopoverOpen] = useState(false);
  
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
    return localJustifications.some(j => j.absenceId === absenceId);
  };
  
  // Get justification for an absence
  const getJustification = (absenceId: string) => {
    return localJustifications.find(j => j.absenceId === absenceId);
  };
  
  // Get justification status for an absence
  const getJustificationStatus = (absenceId: string) => {
    const justification = localJustifications.find(j => j.absenceId === absenceId);
    return justification?.status || null;
  };
  
  // Handle send SMS notification
  const handleSendNotification = (absence: any) => {
    const student = users.find(u => u.id === absence.studentId);
    setSmsMessage(`Bonjour, votre enfant ${student?.firstName} ${student?.lastName} a été absent le ${new Date(absence.date).toLocaleDateString()} au cours de ${absence.courseName}.`);
    setSelectedAbsence(absence);
    setSmsPopoverOpen(true);
  };

  // Handle sending the SMS
  const handleSendSms = () => {
    if (!selectedAbsence) return;
    
    const student = users.find(u => u.id === selectedAbsence.studentId);
    
    toast({
      title: "SMS envoyé",
      description: `Un SMS a été envoyé aux parents de ${student?.firstName} ${student?.lastName}.`,
    });
    
    setSmsPopoverOpen(false);
    setSmsMessage("");
  };

  // Handle justification status update
  const handleJustificationStatusUpdate = async (
    justificationId: string,
    newStatus: "approved" | "rejected",
    comment?: string
  ) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Update local justifications state
    const updatedJustifications = localJustifications.map(justification => {
      if (justification.id === justificationId) {
        const updatedJustification = {
          ...justification,
          status: newStatus,
          supervisorComment: comment || justification.supervisorComment,
          supervisorId: currentUser.id,
        };
        return updatedJustification;
      }
      return justification;
    });

    // Also update absences justified status if approved
    const justification = localJustifications.find(j => j.id === justificationId);
    if (justification && newStatus === "approved") {
      // In a real app, you'd update the database here
      // For this mock, we're just updating the local state
      const absenceIndex = absences.findIndex(a => a.id === justification.absenceId);
      if (absenceIndex >= 0) {
        absences[absenceIndex] = {
          ...absences[absenceIndex],
          justified: true,
          justificationId,
        };
      }
    }

    setLocalJustifications(updatedJustifications);
    setDialogOpen(false);
    setCommentInput("");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Suivi des absences
          </h1>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
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
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="dark:border-gray-700">
                  <TableHead className="dark:text-gray-300">Étudiant</TableHead>
                  <TableHead className="dark:text-gray-300">Classe</TableHead>
                  <TableHead className="dark:text-gray-300">Cours</TableHead>
                  <TableHead className="dark:text-gray-300">Date</TableHead>
                  <TableHead className="dark:text-gray-300">Statut</TableHead>
                  <TableHead className="text-right dark:text-gray-300">Actions</TableHead>
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
                    const justification = getJustification(absence.id);
                    const justificationStatus = getJustificationStatus(absence.id);

                    return (
                      <TableRow key={absence.id} className="dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <TableCell className="font-medium dark:text-gray-200">
                          {student?.firstName} {student?.lastName}
                        </TableCell>
                        <TableCell className="dark:text-gray-300">{student?.class}</TableCell>
                        <TableCell className="dark:text-gray-300">{absence.courseName}</TableCell>
                        <TableCell className="dark:text-gray-300">{absenceDate.toLocaleDateString()}</TableCell>
                        <TableCell>
                          {absence.justified ? (
                            <div className="flex items-center">
                              <Check className="h-4 w-4 mr-1 text-success-600 dark:text-success-400" />
                              <span className="text-success-600 dark:text-success-400">Justifiée</span>
                            </div>
                          ) : hasRequest ? (
                            <div className="flex items-center">
                              {justificationStatus === "pending" ? (
                                <span className="text-amber-500 dark:text-amber-400">Réclamation en attente</span>
                              ) : (
                                <span className={justificationStatus === "approved" ? "text-success-600 dark:text-success-400" : "text-red-600 dark:text-red-400"}>
                                  Réclamation {justificationStatus === "approved" ? "approuvée" : "rejetée"}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <X className="h-4 w-4 mr-1 text-red-600 dark:text-red-400" />
                              <span className="text-red-600 dark:text-red-400">
                                Non justifiée {isWithin48h ? `(${daysSince}/2j)` : ""}
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {hasRequest && justification && (
                              <>
                                <Dialog open={dialogOpen && selectedAbsence?.id === absence.id} onOpenChange={(open) => {
                                  if (open) {
                                    setSelectedAbsence(absence);
                                  }
                                  setDialogOpen(open);
                                }}>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="text-amber-600 dark:text-amber-400 border-amber-600 dark:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                                    >
                                      <FileText className="h-4 w-4 mr-1" />
                                      Voir réclamation
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
                                    <DialogHeader>
                                      <DialogTitle className="dark:text-gray-200">Réclamation pour absence</DialogTitle>
                                      <DialogDescription className="dark:text-gray-400">
                                        Examen de la justification soumise par l'étudiant
                                      </DialogDescription>
                                    </DialogHeader>
                                    
                                    <div className="grid gap-4 py-4">
                                      <div className="grid gap-1">
                                        <Label className="dark:text-gray-300">Étudiant</Label>
                                        <p className="text-sm font-medium dark:text-gray-200">
                                          {student?.firstName} {student?.lastName}
                                        </p>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-1">
                                          <Label className="dark:text-gray-300">Date d'absence</Label>
                                          <p className="text-sm dark:text-gray-300">{absenceDate.toLocaleDateString()}</p>
                                        </div>
                                        <div className="grid gap-1">
                                          <Label className="dark:text-gray-300">Cours</Label>
                                          <p className="text-sm dark:text-gray-300">{absence.courseName}</p>
                                        </div>
                                      </div>
                                      <div className="grid gap-1">
                                        <Label className="dark:text-gray-300">Motif</Label>
                                        <p className="text-sm p-3 bg-gray-50 dark:bg-gray-700 rounded dark:text-gray-300">
                                          {justification?.reason}
                                        </p>
                                      </div>
                                      <div className="grid gap-1">
                                        <Label className="dark:text-gray-300">Document</Label>
                                        <Button variant="outline" size="sm" className="w-fit dark:border-gray-600 dark:text-gray-300">
                                          <FileText className="h-4 w-4 mr-1" />
                                          Voir le document
                                        </Button>
                                      </div>
                                      <div className="grid gap-1">
                                        <Label htmlFor="comment" className="dark:text-gray-300">Commentaire</Label>
                                        <Input 
                                          id="comment" 
                                          placeholder="Ajouter un commentaire (optionnel)" 
                                          value={commentInput}
                                          onChange={(e) => setCommentInput(e.target.value)}
                                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder:text-gray-500"
                                        />
                                      </div>
                                    </div>
                                    
                                    <div className="flex justify-end gap-2">
                                      {justification?.status === "pending" && (
                                        <>
                                          <Button 
                                            variant="danger" 
                                            onClick={() => justification && handleJustificationStatusUpdate(justification.id, "rejected", commentInput)}
                                          >
                                            <X className="h-4 w-4 mr-1" />
                                            Rejeter
                                          </Button>
                                          <Button 
                                            variant="success"
                                            onClick={() => justification && handleJustificationStatusUpdate(justification.id, "approved", commentInput)}
                                          >
                                            <Check className="h-4 w-4 mr-1" />
                                            Approuver
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                
                                {justification.status === "pending" && (
                                  <div className="flex space-x-2">
                                    <Button 
                                      variant="success" 
                                      size="sm"
                                      onClick={() => handleJustificationStatusUpdate(justification.id, "approved")}
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Approuver
                                    </Button>
                                    <Button 
                                      variant="danger" 
                                      size="sm"
                                      onClick={() => handleJustificationStatusUpdate(justification.id, "rejected")}
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Rejeter
                                    </Button>
                                  </div>
                                )}
                              </>
                            )}
                            
                            {!absence.justified && !isWithin48h && !hasRequest && (
                              <Popover open={smsPopoverOpen && selectedAbsence?.id === absence.id} onOpenChange={(open) => {
                                if (!open) {
                                  setSmsPopoverOpen(false);
                                }
                              }}>
                                <PopoverTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                    onClick={() => handleSendNotification(absence)}
                                  >
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    Notifier par SMS
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-4 dark:bg-gray-800 dark:border-gray-700">
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-medium mb-1 dark:text-gray-200">Envoyer un SMS aux parents</h4>
                                      <p className="text-sm text-gray-600 dark:text-gray-400">Ce message sera envoyé aux parents concernant l'absence non justifiée.</p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="sms-message" className="dark:text-gray-300">Message</Label>
                                      <Textarea 
                                        id="sms-message"
                                        value={smsMessage}
                                        onChange={(e) => setSmsMessage(e.target.value)}
                                        className="min-h-24 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                      />
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                      <Button variant="outline" size="sm" onClick={() => setSmsPopoverOpen(false)} className="dark:border-gray-600 dark:text-gray-300">
                                        Annuler
                                      </Button>
                                      <Button size="sm" onClick={handleSendSms}>
                                        Envoyer
                                      </Button>
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-gray-500 dark:text-gray-400">
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
