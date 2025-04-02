
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { User, Mail, Lock, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const StudentProfile = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would update the user info
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été mises à jour avec succès.",
    });
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, you would update the password
    toast({
      title: "Mot de passe mis à jour",
      description: "Votre mot de passe a été mis à jour avec succès.",
    });
    
    setFormData({
      ...formData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Profil
        </h1>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-0 shadow-sm md:col-span-1">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={currentUser?.avatar} alt={currentUser?.firstName} />
                  <AvatarFallback className="bg-success-100 text-success-700 text-2xl">
                    {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 rounded-full bg-success-500 text-white p-1.5 shadow-sm">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              
              <h2 className="mt-4 text-xl font-semibold">
                {currentUser?.firstName} {currentUser?.lastName}
              </h2>
              <p className="text-gray-500">{currentUser?.email}</p>
              
              <div className="w-full mt-6 pt-6 border-t">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-3 text-gray-500" />
                    <span>Étudiant</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-gray-500" />
                    <span>{currentUser?.email}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="md:col-span-2">
            <Tabs defaultValue="info">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Informations personnelles</TabsTrigger>
                <TabsTrigger value="password">Mot de passe</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="pt-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Modifier vos informations</CardTitle>
                  </CardHeader>
                  <form onSubmit={handleInfoSubmit}>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Prénom</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            placeholder="Votre prénom"
                            value={formData.firstName}
                            onChange={handleInfoChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Nom</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            placeholder="Votre nom"
                            value={formData.lastName}
                            onChange={handleInfoChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="votre@email.com"
                          value={formData.email}
                          onChange={handleInfoChange}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="bg-success-600 hover:bg-success-700">
                        Enregistrer
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              <TabsContent value="password" className="pt-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Changer votre mot de passe</CardTitle>
                  </CardHeader>
                  <form onSubmit={handlePasswordSubmit}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          placeholder="••••••"
                          value={formData.currentPassword}
                          onChange={handleInfoChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          placeholder="••••••"
                          value={formData.newPassword}
                          onChange={handleInfoChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="••••••"
                          value={formData.confirmPassword}
                          onChange={handleInfoChange}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <p className="text-sm text-gray-500 flex items-center">
                        <Lock className="h-4 w-4 mr-1" />
                        Utilisez au moins 8 caractères
                      </p>
                      <Button type="submit" className="bg-success-600 hover:bg-success-700">
                        Mettre à jour
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentProfile;
