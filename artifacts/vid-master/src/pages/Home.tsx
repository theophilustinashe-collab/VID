import { useState } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin, useRegister, useGetMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Signpost, Car, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Home() {
  const [_, setLocation] = useLocation();
  const { data: user } = useGetMe();
  const login = useLogin();
  const register = useRegister();
  const { toast } = useToast();

  if (user) {
    setLocation("/dashboard");
    return null;
  }

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onLoginSubmit = (data: z.infer<typeof loginSchema>) => {
    login.mutate(
      { data },
      {
        onSuccess: (res) => {
          localStorage.setItem("vid_token", res.token);
          window.location.href = "/dashboard";
        },
        onError: (err) => {
          toast({
            title: "Login Failed",
            description: err.message || "Invalid credentials",
            variant: "destructive",
          });
        },
      }
    );
  };

  const onRegisterSubmit = (data: z.infer<typeof registerSchema>) => {
    register.mutate(
      { data },
      {
        onSuccess: (res) => {
          localStorage.setItem("vid_token", res.token);
          window.location.href = "/dashboard";
        },
        onError: (err) => {
          toast({
            title: "Registration Failed",
            description: err.message || "Could not create account",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Left branding panel */}
      <div className="bg-sidebar flex-1 p-8 lg:p-16 flex flex-col justify-between text-sidebar-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground p-3 rounded-lg">
              <Signpost className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">VID Master</h1>
              <p className="text-sm font-semibold tracking-widest text-sidebar-primary uppercase">Zimbabwe</p>
            </div>
          </div>

          <div className="space-y-8 max-w-lg mt-12">
            <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight text-white">
              Pass your provisional test with confidence.
            </h2>
            <p className="text-lg text-sidebar-foreground/80">
              The most comprehensive, accurate, and up-to-date learner's licence preparation platform for Zimbabwe.
            </p>

            <div className="space-y-6 pt-8">
              <div className="flex items-start gap-4">
                <div className="bg-sidebar-accent p-2 rounded-md shrink-0">
                  <ShieldCheck className="w-5 h-5 text-sidebar-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Government Aligned</h3>
                  <p className="text-sm text-sidebar-foreground/70">Questions meticulously matched to the official VID curriculum.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-sidebar-accent p-2 rounded-md shrink-0">
                  <Car className="w-5 h-5 text-sidebar-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Simulated Testing</h3>
                  <p className="text-sm text-sidebar-foreground/70">Practice under real exam conditions with our 8-minute timed tests.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-sidebar-foreground/50 mt-16 font-medium">
          © {new Date().getFullYear()} VID Master Zimbabwe. Not officially affiliated with the Vehicle Inspection Department.
        </div>
      </div>

      {/* Right Auth Panel */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-muted/20">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="space-y-1 text-center pb-6">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="learner@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel>Password</FormLabel>
                          </div>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full mt-6" disabled={login.isPending}>
                      {login.isPending ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="learner@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full mt-6" disabled={register.isPending}>
                      {register.isPending ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
