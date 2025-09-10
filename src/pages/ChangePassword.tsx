import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const updatePasswordInSheet = async (role: string, identifier: string, newPassword: string) => {
    try {
      let apiUrl = "";
      
      // Determine which sheet to update based on role
      switch (role) {
        case "admin":
          apiUrl = "https://sheetdb.io/api/v1/0f6urid3bwu34";
          break;
        case "student":
          // Get user data to determine department
          const userData = JSON.parse(localStorage.getItem("user") || "{}");
          // For now, default to CSE - this should be determined by the student's department
          apiUrl = "https://sheetdb.io/api/v1/dnwg7wehqdtue";
          break;
        case "driver":
          apiUrl = "https://sheetdb.io/api/v1/kkjjnms5jrxvg";
          break;
        default:
          throw new Error("Invalid role");
      }

      // Update the password in Google Sheets
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            "changed_password": newPassword
          },
          // Update condition based on role
          condition: role === "student" ? { "rollNo": identifier } : 
                    role === "driver" ? { "driverId": identifier } :
                    { "email": identifier }
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update password in database");
      }

      return true;
    } catch (error) {
      console.error("Error updating password:", error);
      return false;
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const { role, identifier } = user;

      // Update password in Google Sheets
      const updateSuccess = await updatePasswordInSheet(role, identifier, newPassword);
      
      if (!updateSuccess) {
        throw new Error("Failed to update password in database");
      }

      // Store the new password locally
      localStorage.setItem("userPassword", newPassword);
      localStorage.setItem("passwordChanged", "true");

      toast({
        title: "Success",
        description: "Password changed successfully",
      });

      // Navigate to appropriate dashboard
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
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
            <Lock className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Change Password</h1>
          <p className="text-muted-foreground">Set up your new secure password</p>
        </div>

        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl">Set New Password</CardTitle>
            <CardDescription>
              Your account security is important. Please create a strong password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full mt-6 h-11" disabled={isLoading}>
                <Lock className="h-4 w-4 mr-2" />
                {isLoading ? "Updating..." : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Make sure to remember your new password for future logins.
        </p>
      </div>
    </div>
  );
};

export default ChangePassword;