
import { useState, FormEvent } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CircleUserRound, Mail, Phone, School, Shield } from "lucide-react";

const SupervisorProfile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.email || "",
    phone: "06 12 34 56 78", // Mock data
    department: "Sciences", // Mock data
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  if (!currentUser) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, you'd call an API here
      // For this mock, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (typeof updateUserProfile === 'function') {
        updateUserProfile({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        });
      }
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getInitials = () => {
    return `${formData.firstName?.[0] || ""}${formData.lastName?.[0] || ""}`;
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Profil</h1>
        
        <Tabs defaultValue="personal">
          <TabsList className="mb-4">
            <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Profile Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Votre profil</CardTitle>
                  <CardDescription>Informations générales de votre compte.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center pt-4">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={currentUser.avatar} alt={`${formData.firstName} ${formData.lastName}`} />
                    <AvatarFallback className="bg-success-100 text-success-700 text-xl dark:bg-success-900 dark:text-success-300">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-medium">{formData.firstName} {formData.lastName}</h3>
                  <p className="text-sm text-muted-foreground">Superviseur</p>
                  
                  <div className="w-full mt-6 space-y-3">
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">{formData.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">{formData.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <School className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Département de {formData.department}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Shield className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Compte actif</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Edit Profile Form */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Modifier le profil</CardTitle>
                  <CardDescription>Mettez à jour vos informations personnelles.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="Prénom"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Nom"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Adresse e-mail</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="adresse@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="Numéro de téléphone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="department">Département</Label>
                      <Input
                        id="department"
                        name="department"
                        placeholder="Département"
                        value={formData.department}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité du compte</CardTitle>
                <CardDescription>Gérez les paramètres de sécurité de votre compte.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Changer le mot de passe</h3>
                  <p className="text-sm text-muted-foreground">
                    Mettez à jour votre mot de passe pour sécuriser votre compte.
                  </p>
                  <Button variant="outline" className="mt-2">
                    <CircleUserRound className="w-4 h-4 mr-2" />
                    Modifier le mot de passe
                  </Button>
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <h3 className="text-lg font-medium">Authentification à deux facteurs</h3>
                  <p className="text-sm text-muted-foreground">
                    Activez l'authentification à deux facteurs pour renforcer la sécurité de votre compte.
                  </p>
                  <Button variant="outline" className="mt-2">
                    <Shield className="w-4 h-4 mr-2" />
                    Configurer l'A2F
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SupervisorProfile;
