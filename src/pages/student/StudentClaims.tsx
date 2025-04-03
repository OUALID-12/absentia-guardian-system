
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { absences, justifications } from "@/lib/mock-data";
import { Plus, FileText, Upload, Check, X, Clock } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StudentClaims = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedAbsence, setSelectedAbsence] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [localJustifications, setLocalJustifications] = useState([...justifications]);
  
  if (!currentUser) return null;
  
  // Filter absences for the current student that are not justified
  const unjustifiedAbsences = absences.filter(
    absence => absence.studentId === currentUser.id && !absence.justified
  );
  
  // Filter justifications for the current student
  const studentJustifications = localJustifications.filter(
    justification => justification.studentId === currentUser.id
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAbsence || !reason) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }
    
    // Create a new justification
    const newJustification = {
      id: `just-${Date.now()}`,
      absenceId: selectedAbsence,
      studentId: currentUser.id,
      date: new Date().toISOString(),
      reason,
      documentUrl: file ? URL.createObjectURL(file) : undefined,
      status: "pending" as const,
    };
    
    // Update local state with the new justification
    setLocalJustifications(prev => [...prev, newJustification]);
    
    toast({
      title: "Réclamation soumise",
      description: "Votre justification a été envoyée avec succès.",
    });
    
    // Automatically switch to the pending tab to show the new claim
    setActiveTab("pending");
    
    // Reset form state
    setOpen(false);
    setSelectedAbsence(null);
    setReason("");
    setFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <Check className="h-4 w-4 text-success-600 dark:text-success-500" />;
      case "rejected":
        return <X className="h-4 w-4 text-red-600 dark:text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-orange-400 dark:text-orange-300" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approuvée";
      case "rejected":
        return "Rejetée";
      default:
        return "En attente";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-success-600 dark:text-success-500";
      case "rejected":
        return "text-red-600 dark:text-red-500";
      default:
        return "text-orange-400 dark:text-orange-300";
    }
  };

  const viewDocument = (documentUrl?: string) => {
    if (!documentUrl) return;
    window.open(documentUrl, '_blank');
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Réclamations d'absences
          </h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-success-600 hover:bg-success-700 dark:bg-success-600 dark:hover:bg-success-500">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle réclamation
              </Button>
            </DialogTrigger>
            <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle className="dark:text-gray-100">Nouvelle réclamation</DialogTitle>
                  <DialogDescription className="dark:text-gray-300">
                    Veuillez fournir les détails de votre réclamation pour justifier une absence.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="absence" className="dark:text-gray-200">Absence à justifier</Label>
                    <Select 
                      value={selectedAbsence || ""} 
                      onValueChange={setSelectedAbsence}
                      required
                    >
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                        <SelectValue placeholder="Sélectionnez une absence" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                        <SelectGroup>
                          {unjustifiedAbsences.map(absence => (
                            <SelectItem key={absence.id} value={absence.id} className="dark:text-gray-100 dark:hover:bg-gray-700">
                              {new Date(absence.date).toLocaleDateString()} - {absence.courseName}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reason" className="dark:text-gray-200">Motif</Label>
                    <Textarea 
                      id="reason" 
                      placeholder="Décrivez la raison de votre absence..." 
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                      required
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="document" className="dark:text-gray-200">Document justificatif</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="document" 
                        type="file" 
                        className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" 
                        onChange={handleFileChange}
                      />
                      {file && (
                        <span className="text-sm text-success-600 dark:text-success-400 font-medium">{file.name}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Accepte les fichiers .pdf, .jpg, .png (max 5MB)
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)} className="dark:border-gray-600 dark:bg-gray-700">
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-success-600 hover:bg-success-700 dark:bg-success-600 dark:hover:bg-success-500">Soumettre</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full max-w-md dark:bg-gray-800">
            <TabsTrigger value="pending" className="flex-1 dark:data-[state=active]:bg-gray-700">En attente</TabsTrigger>
            <TabsTrigger value="resolved" className="flex-1 dark:data-[state=active]:bg-gray-700">Traitées</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="pt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {studentJustifications
                .filter(j => j.status === "pending")
                .map(justification => (
                  <Card key={justification.id} className="overflow-hidden border-0 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-0">
                      <div className="bg-success-50 dark:bg-success-900/20 p-4 flex items-start space-x-4">
                        <div className="bg-white dark:bg-gray-800 rounded-full p-2">
                          <FileText className="h-5 w-5 text-success-600 dark:text-success-500" />
                        </div>
                        <div>
                          <h3 className="font-medium dark:text-gray-100">
                            {absences.find(a => a.id === justification.absenceId)?.courseName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(justification.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">{justification.reason}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(justification.status)}
                            <span className={`text-xs font-medium ${getStatusColor(justification.status)}`}>
                              {getStatusText(justification.status)}
                            </span>
                          </div>
                          {justification.documentUrl && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs"
                              onClick={() => viewDocument(justification.documentUrl)}
                            >
                              <Upload className="h-3 w-3 mr-1" />
                              Document
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              
              {studentJustifications.filter(j => j.status === "pending").length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
                  <FileText className="h-12 w-12 mb-2 opacity-20" />
                  <h3 className="font-medium">Aucune réclamation en attente</h3>
                  <p className="text-sm">Cliquez sur "Nouvelle réclamation" pour en créer une.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="resolved" className="pt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {studentJustifications
                .filter(j => j.status !== "pending")
                .map(justification => (
                  <Card key={justification.id} className="overflow-hidden border-0 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-0">
                      <div className={`p-4 flex items-start space-x-4 ${
                        justification.status === "approved" 
                          ? "bg-success-50 dark:bg-success-900/20" 
                          : "bg-red-50 dark:bg-red-900/20"
                      }`}>
                        <div className="bg-white dark:bg-gray-800 rounded-full p-2">
                          <FileText className={`h-5 w-5 ${
                            justification.status === "approved" 
                              ? "text-success-600 dark:text-success-500" 
                              : "text-red-600 dark:text-red-500"
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-medium dark:text-gray-100">
                            {absences.find(a => a.id === justification.absenceId)?.courseName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(justification.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">{justification.reason}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(justification.status)}
                            <span className={`text-xs font-medium ${getStatusColor(justification.status)}`}>
                              {getStatusText(justification.status)}
                            </span>
                          </div>
                          {justification.documentUrl && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs"
                              onClick={() => viewDocument(justification.documentUrl)}
                            >
                              <Upload className="h-3 w-3 mr-1" />
                              Document
                            </Button>
                          )}
                        </div>
                        {justification.supervisorComment && (
                          <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-md text-xs">
                            <p className="font-medium dark:text-gray-200">Commentaire:</p>
                            <p className="text-gray-600 dark:text-gray-400">{justification.supervisorComment}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              
              {studentJustifications.filter(j => j.status !== "pending").length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
                  <FileText className="h-12 w-12 mb-2 opacity-20" />
                  <h3 className="font-medium">Aucune réclamation traitée</h3>
                  <p className="text-sm">Vos réclamations traitées apparaîtront ici.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default StudentClaims;
