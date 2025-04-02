
import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Justification } from "@/types";

interface JustificationActionsProps {
  justification: Justification;
  onStatusUpdate: (justificationId: string, newStatus: "approved" | "rejected", comment?: string) => void;
}

const JustificationActions = ({ justification, onStatusUpdate }: JustificationActionsProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState("");

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await onStatusUpdate(justification.id, "approved", comment);
      toast({
        title: "Absence justifiée",
        description: "La réclamation a été approuvée avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'approbation de la réclamation.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await onStatusUpdate(justification.id, "rejected", comment);
      toast({
        title: "Réclamation rejetée",
        description: "La réclamation a été rejetée avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du rejet de la réclamation.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (justification.status !== "pending") {
    return (
      <span className={justification.status === "approved" ? "text-success-600" : "text-red-600"}>
        {justification.status === "approved" ? "Approuvée" : "Rejetée"}
      </span>
    );
  }

  return (
    <div className="flex space-x-2">
      <Button 
        variant="success" 
        size="sm"
        disabled={isLoading}
        onClick={handleApprove}
      >
        <Check className="w-4 h-4 mr-1" />
        Justifier
      </Button>
      <Button 
        variant="danger" 
        size="sm"
        disabled={isLoading}
        onClick={handleReject}
      >
        <X className="w-4 h-4 mr-1" />
        Rejeter
      </Button>
    </div>
  );
};

export default JustificationActions;
