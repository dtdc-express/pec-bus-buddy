import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus, Users, Shield, ArrowRight, BarChart3, MapPin, Clock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Student Management",
      description: "Track student assignments, bus routes, and real-time location updates for safe commuting."
    },
    {
      icon: <Bus className="h-8 w-8 text-primary" />,
      title: "Driver Dashboard",
      description: "Complete trip management, emergency alerts, and route optimization for drivers."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "Load Analysis", 
      description: "Data-driven insights to prevent overcrowding and optimize bus allocation on special days."
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: "Live Tracking",
      description: "Real-time GPS tracking and route monitoring for enhanced safety and efficiency."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <Bus className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">PEC-BUS</h1>
              <p className="text-xs text-muted-foreground">Smart College Transport</p>
            </div>
          </div>
          
          <Button onClick={() => navigate("/login")} className="gap-2">
            <Shield className="h-4 w-4" />
            Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Bus className="h-10 w-10 text-primary" />
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            PEC-BUS Management System
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Smart college bus tracking and management solution that eliminates overcrowding through 
            data-driven insights and real-time monitoring.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button size="lg" onClick={() => navigate("/login")} className="gap-2">
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <BarChart3 className="h-5 w-5" />
              View Analytics
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="border-destructive/20 bg-destructive-bg">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-destructive">
                The Saturday Problem
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">
                On special days like Saturdays, only final-year students attend college, but buses are 
                reduced without analyzing actual student numbers per route, leading to dangerous overcrowding.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-destructive mb-2">72</div>
                  <div className="text-sm text-muted-foreground">Students in 50-capacity bus</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-warning mb-2">12</div>
                  <div className="text-sm text-muted-foreground">Students in underutilized bus</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success mb-2">45</div>
                  <div className="text-sm text-muted-foreground">Students in optimal bus</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Smart Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive solution with role-based dashboards and intelligent analytics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your College Transport?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join the smart transportation revolution. Make data-driven decisions and ensure 
              safe, comfortable travel for all students.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate("/login")}
              className="gap-2"
            >
              <Shield className="h-5 w-5" />
              Access Dashboard
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded bg-primary">
                <Bus className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <div className="font-semibold">PEC-BUS</div>
                <div className="text-xs text-muted-foreground">Smart College Transport System</div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2024 PEC-BUS. Making college transport smarter and safer.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
