
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { absences, justifications } from "@/lib/mock-data";
import { Plus, FileText, Upload, Check, X, Clock } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
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
  const [selectedAbsence, setSelectedAbsence] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  if (!currentUser) return null;
  
  // Filter absences for the current student that are not justified
  const unjustifiedAbsences = absences.filter(
    absence => absence.studentId === currentUser.id && !absence.justified
  );
  
  // Filter justifications for the current student
  const studentJustifications = justifications.filter(
    justification => justification.studentId === currentUser.id
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would upload the file and create the justification
    toast({
      title: "Réclamation soumise",
      description: "Votre justification a été envoyée avec succès.",
    });
    
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
        return <Check className="h-4 w-4 text-success-600" />;
      case "rejected":
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-orange-400" />;
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
        return "text-success-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-orange-400";
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Réclamations d'absences
          </h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-success-600 hover:bg-success-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle réclamation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Nouvelle réclamation</DialogTitle>
                  <DialogDescription>
                    Veuillez fournir les détails de votre réclamation pour justifier une absence.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="absence">Absence à justifier</Label>
                    <Select 
                      value={selectedAbsence || ""} 
                      onValueChange={setSelectedAbsence}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une absence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {unjustifiedAbsences.map(absence => (
                            <SelectItem key={absence.id} value={absence.id}>
                              {new Date(absence.date).toLocaleDateString()} - {absence.courseName}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reason">Motif</Label>
                    <Textarea 
                      id="reason" 
                      placeholder="Décrivez la raison de votre absence..." 
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="document">Document justificatif</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="document" 
                        type="file" 
                        className="flex-1" 
                        onChange={handleFileChange}
                      />
                      {file && (
                        <span className="text-sm text-success-600 font-medium">{file.name}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Accepte les fichiers .pdf, .jpg, .png (max 5MB)
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-success-600 hover:bg-success-700">Soumettre</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="pending">
          <TabsList className="w-full max-w-md">
            <TabsTrigger value="pending" className="flex-1">En attente</TabsTrigger>
            <TabsTrigger value="resolved" className="flex-1">Traitées</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="pt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {studentJustifications
                .filter(j => j.status === "pending")
                .map(justification => (
                  <Card key={justification.id} className="overflow-hidden border-0 shadow-sm">
                    <CardContent className="p-0">
                      <div className="bg-success-50 p-4 flex items-start space-x-4">
                        <div className="bg-white rounded-full p-2">
                          <FileText className="h-5 w-5 text-success-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {absences.find(a => a.id === justification.absenceId)?.courseName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(justification.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-700 line-clamp-2 mb-3">{justification.reason}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(justification.status)}
                            <span className={`text-xs font-medium ${getStatusColor(justification.status)}`}>
                              {getStatusText(justification.status)}
                            </span>
                          </div>
                          {justification.documentUrl && (
                            <Button variant="ghost" size="sm" className="text-xs">
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
                <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500">
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
                  <Card key={justification.id} className="overflow-hidden border-0 shadow-sm">
                    <CardContent className="p-0">
                      <div className={`p-4 flex items-start space-x-4 ${
                        justification.status === "approved" ? "bg-success-50" : "bg-red-50"
                      }`}>
                        <div className="bg-white rounded-full p-2">
                          <FileText className={`h-5 w-5 ${
                            justification.status === "approved" ? "text-success-600" : "text-red-600"
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {absences.find(a => a.id === justification.absenceId)?.courseName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(justification.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-700 line-clamp-2 mb-3">{justification.reason}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(justification.status)}
                            <span className={`text-xs font-medium ${getStatusColor(justification.status)}`}>
                              {getStatusText(justification.status)}
                            </span>
                          </div>
                          {justification.documentUrl && (
                            <Button variant="ghost" size="sm" className="text-xs">
                              <Upload className="h-3 w-3 mr-1" />
                              Document
                            </Button>
                          )}
                        </div>
                        {justification.supervisorComment && (
                          <div className="mt-3 p-2 bg-gray-50 rounded-md text-xs">
                            <p className="font-medium">Commentaire:</p>
                            <p className="text-gray-600">{justification.supervisorComment}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              
              {studentJustifications.filter(j => j.status !== "pending").length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500">
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
