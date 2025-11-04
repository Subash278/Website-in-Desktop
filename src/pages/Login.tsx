import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication - in production, this would call an API
    if (username && password) {
      // Store user role in localStorage (mock)
      const role = username.includes("super") ? "super-admin" : 
                   username.includes("admin") ? "admin" : "user";
      localStorage.setItem("userRole", role);
      localStorage.setItem("username", username);
      
      toast.success("Login successful!");
      navigate("/dashboard");
    } else {
      toast.error("Please enter username and password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md p-8">
        <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
          {/* Logo and Company Name */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">SecureIT Framework</h1>
            <p className="text-sm text-muted-foreground mt-1">Network & Security Compliance</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>Test users: super-admin / admin / user</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
