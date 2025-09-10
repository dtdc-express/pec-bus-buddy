import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bus, Shield, User, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [role, setRole] = useState<string>("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!role || !identifier || !password) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== "admin@0704") {
      toast({
        title: "Invalid Password",
        description: "Please check your credentials",
        variant: "destructive",
      });
      return;
    }

    // Store user data in localStorage
    localStorage.setItem("user", JSON.stringify({ role, identifier }));
    localStorage.setItem("isAuthenticated", "true");

    // Navigate based on role
    switch (role) {
      case "student":
        navigate("/student-dashboard");
        break;
      case "driver":
        navigate("/driver-dashboard");
        break;
      case "admin":
        navigate("/admin-dashboard");
        break;
      default:
        toast({
          title: "Error",
          description: "Invalid role selected",
          variant: "destructive",
        });
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case "student":
        return <User className="h-5 w-5" />;
      case "driver":
        return <Bus className="h-5 w-5" />;
      case "admin":
        return <Shield className="h-5 w-5" />;
      default:
        return <LogIn className="h-5 w-5" />;
    }
  };

  const getPlaceholder = () => {
    switch (role) {
      case "student":
        return "Enter Roll Number";
      case "driver":
        return "Enter Driver ID";
      case "admin":
        return "Enter Email";
      default:
        return "Select role first";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
            <Bus className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">PEC-BUS</h1>
          <p className="text-muted-foreground">College Bus Tracking & Management System</p>
        </div>

        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Access your dashboard with your credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Student
                      </div>
                    </SelectItem>
                    <SelectItem value="driver">
                      <div className="flex items-center gap-2">
                        <Bus className="h-4 w-4" />
                        Driver
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Admin/Faculty
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="identifier">
                  {role === "student" ? "Roll Number" : role === "driver" ? "Driver ID" : "Email"}
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    {getRoleIcon()}
                  </div>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder={getPlaceholder()}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="pl-10"
                    disabled={!role}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full mt-6 h-11">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          For demo purposes, use password: <span className="font-mono">admin@0704</span>
        </p>
      </div>
    </div>
  );
};

export default Login;