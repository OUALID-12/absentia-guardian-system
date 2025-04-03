
import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Justification } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface JustificationActionsProps {
  justification: Justification;
  onStatusUpdate: (justificationId: string, newStatus: "approved" | "rejected", comment?: string) => void;
}

const JustificationActions = ({ justification, onStatusUpdate }: JustificationActionsProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [showCommentField, setShowCommentField] = useState(false);

  const handleAction = async (status: "approved" | "rejected") => {
    if (!showCommentField) {
      setShowCommentField(true);
      return;
    }

    setIsLoading(true);
    try {
      await onStatusUpdate(justification.id, status, comment);
      toast({
        title: status === "approved" ? "Absence justifiée" : "Réclamation rejetée",
        description: status === "approved" 
          ? "La réclamation a été approuvée avec succès."
          : "La réclamation a été rejetée avec succès.",
      });
      setShowCommentField(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement de la réclamation.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (justification.status !== "pending") {
    return (
      <span className={justification.status === "approved" ? "text-success-600 dark:text-success-400" : "text-red-600 dark:text-red-400"}>
        {justification.status === "approved" ? "Approuvée" : "Rejetée"}
      </span>
    );
  }

  return (
    <div className="flex flex-col space-y-3">
      {showCommentField && (
        <div className="space-y-2">
          <Label htmlFor="comment">Commentaire (optionnel)</Label>
          <Textarea 
            id="comment"
            placeholder="Ajouter un commentaire..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-24"
          />
        </div>
      )}
      
      <div className="flex space-x-2">
        <Button 
          variant="success" 
          size="sm"
          disabled={isLoading}
          onClick={() => handleAction("approved")}
          className="flex-1"
        >
          <Check className="w-4 h-4 mr-1" />
          {showCommentField ? "Confirmer" : "Justifier"}
        </Button>
        
        {showCommentField ? (
          <Button 
            variant="outline" 
            size="sm"
            disabled={isLoading}
            onClick={() => setShowCommentField(false)}
          >
            Annuler
          </Button>
        ) : (
          <Button 
            variant="danger" 
            size="sm"
            disabled={isLoading}
            onClick={() => handleAction("rejected")}
          >
            <X className="w-4 h-4 mr-1" />
            Rejeter
          </Button>
        )}
      </div>
    </div>
  );
};

export default JustificationActions;
