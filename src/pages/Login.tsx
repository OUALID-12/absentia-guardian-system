
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
  role: z.enum(["student", "supervisor"] as const)
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeRole, setActiveRole] = useState<UserRole>("student");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: activeRole
    }
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const success = await login(values.email, values.password, values.role);
      if (success) {
        navigate(values.role === "student" ? "/student/dashboard" : "/supervisor/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveRole(value as UserRole);
    form.setValue("role", value as UserRole);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold logo-text mb-1">Absentia</h1>
          <p className="text-gray-600 dark:text-gray-300">Système Intelligent de Suivi des Absences</p>
        </div>
        
        <Card className="border-0 shadow-lg card-shadow overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="success-gradient text-white">
            <CardTitle className="text-center">Connexion</CardTitle>
            <CardDescription className="text-white/80 text-center">
              Accédez à votre compte pour gérer vos absences
            </CardDescription>
          </CardHeader>
          <Tabs 
            value={activeRole} 
            onValueChange={handleTabChange} 
            className="w-full"
          >
            <div className="px-6 mt-4">
              <TabsList className="grid w-full grid-cols-2 dark:bg-gray-700">
                <TabsTrigger 
                  value="student"
                  className="dark:data-[state=active]:bg-success-600 dark:data-[state=active]:text-white"
                >
                  Étudiant
                </TabsTrigger>
                <TabsTrigger 
                  value="supervisor"
                  className="dark:data-[state=active]:bg-success-600 dark:data-[state=active]:text-white"
                >
                  Surveillant
                </TabsTrigger>
              </TabsList>
            </div>
            
            <CardContent className="p-6">
              <TabsContent value="student">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-200">Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="votre@email.com" 
                              {...field} 
                              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                            />
                          </FormControl>
                          <FormMessage className="dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-200">Mot de passe</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="******" 
                              {...field} 
                              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                            />
                          </FormControl>
                          <FormMessage className="dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                    <input type="hidden" {...form.register("role")} />
                    <Button 
                      type="submit" 
                      className="w-full bg-success-600 hover:bg-success-700 dark:bg-success-600 dark:hover:bg-success-500 dark:text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Connexion en cours..." : "Se connecter"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="supervisor">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-200">Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="surveillant@email.com" 
                              {...field} 
                              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                            />
                          </FormControl>
                          <FormMessage className="dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-200">Mot de passe</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="******" 
                              {...field} 
                              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                            />
                          </FormControl>
                          <FormMessage className="dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                    <input type="hidden" {...form.register("role")} />
                    <Button 
                      type="submit" 
                      className="w-full bg-success-600 hover:bg-success-700 dark:bg-success-600 dark:hover:bg-success-500 dark:text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Connexion en cours..." : "Se connecter"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </CardContent>
          </Tabs>
          
          <CardFooter className="bg-gray-50 dark:bg-gray-700 flex justify-center p-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="text-center">
              <p>Pour les démos: Utilisez</p>
              <p>Étudiant: student@example.com</p>
              <p>Surveillant: supervisor@example.com</p>
              <p>(Tout mot de passe fonctionne)</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
