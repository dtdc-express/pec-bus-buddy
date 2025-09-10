import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bus, Clock, Route, User, Phone, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import MapComponent from "@/components/MapComponent";

interface StudentData {
  name: string;
  rollNo: string;
  department: string;
  year: string;
  busNo: string;
  routeName: string;
  routeNumber: string;
}

interface DriverData {
  name: string;
  contact: string;
  licenseNo: string;
}

interface RouteData {
  stops: string;
  distance: string;
  avgTime: string;
}

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const rollNumber = user.identifier;
    
    if (rollNumber) {
      fetchStudentData(rollNumber);
    }
  }, []);

  const fetchStudentData = async (rollNo: string) => {
    try {
      setLoading(true);
      
      // Fetch from CSE department first
      let studentFound = false;
      let studentInfo = null;
      
      try {
        const cseResponse = await fetch("https://sheetdb.io/api/v1/dnwg7wehqdtue");
        const cseData = await cseResponse.json();
        studentInfo = cseData.find((student: any) => student["Roll No"] === rollNo);
        if (studentInfo) studentFound = true;
      } catch (error) {
        console.log("CSE data not found, trying CSBS...");
      }
      
      // If not found in CSE, try CSBS
      if (!studentFound) {
        try {
          const csbsResponse = await fetch("https://sheetdb.io/api/v1/667d72shtkr7r");
          const csbsData = await csbsResponse.json();
          studentInfo = csbsData.find((student: any) => student["Roll No"] === rollNo);
          if (studentInfo) studentFound = true;
        } catch (error) {
          console.log("CSBS data not found");
        }
      }

      if (!studentFound || !studentInfo) {
        toast({
          title: "Student Not Found",
          description: "Your roll number is not registered in the system.",
          variant: "destructive",
        });
        return;
      }

      const student: StudentData = {
        name: studentInfo.Name || "N/A",
        rollNo: studentInfo["Roll No"] || "N/A",
        department: studentInfo.Department || "N/A",
        year: studentInfo.Year || "N/A",
        busNo: studentInfo["Bus No"] || "N/A",
        routeName: studentInfo["Route Name"] || "N/A",
        routeNumber: studentInfo["Route Number"] || "N/A"
      };

      setStudentData(student);

      // Fetch driver data
      if (student.busNo) {
        await fetchDriverData(student.busNo);
      }

      // Fetch route data
      if (student.routeNumber) {
        await fetchRouteData(student.routeNumber);
      }

    } catch (error) {
      console.error("Error fetching student data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch student data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDriverData = async (busNo: string) => {
    try {
      const response = await fetch("https://sheetdb.io/api/v1/kkjjnms5jrxvg");
      const data = await response.json();
      const driver = data.find((d: any) => d["Bus No"] === busNo);
      
      if (driver) {
        setDriverData({
          name: driver.Name || "N/A",
          contact: driver.Contact || "N/A",
          licenseNo: driver["License No"] || "N/A"
        });
      }
    } catch (error) {
      console.error("Error fetching driver data:", error);
    }
  };

  const fetchRouteData = async (routeNumber: string) => {
    try {
      const response = await fetch("https://sheetdb.io/api/v1/8qa6al4l8k3m5");
      const data = await response.json();
      const route = data.find((r: any) => r["Route Number"] === routeNumber);
      
      if (route) {
        setRouteData({
          stops: route.Stops || "N/A",
          distance: route.Distance || "N/A",
          avgTime: route["Avg Time"] || "N/A"
        });
      }
    } catch (error) {
      console.error("Error fetching route data:", error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {studentData?.name || "Student"}
            </p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            <User className="h-4 w-4 mr-1" />
            {studentData?.rollNo}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{studentData?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{studentData?.department}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Year</p>
                <p className="font-medium">{studentData?.year}</p>
              </div>
            </CardContent>
          </Card>

          {/* Bus Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bus className="h-5 w-5 text-primary" />
                Bus Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Bus Number</p>
                <p className="text-2xl font-bold text-primary">{studentData?.busNo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Route</p>
                <p className="font-medium">{studentData?.routeName}</p>
              </div>
              <Badge variant="secondary" className="w-fit">
                Route #{studentData?.routeNumber}
              </Badge>
            </CardContent>
          </Card>

          {/* Driver Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Driver Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {driverData ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Driver Name</p>
                    <p className="font-medium">{driverData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="font-medium">{driverData.contact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">License</p>
                    <p className="text-sm font-mono">{driverData.licenseNo}</p>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">Driver information not available</p>
              )}
            </CardContent>
          </Card>

          {/* Route Information */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5 text-primary" />
                Route Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {routeData ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Bus Stops</p>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm">{routeData.stops}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Distance</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <p className="font-semibold">{routeData.distance}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Average Time</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <p className="font-semibold">{routeData.avgTime}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Route information not available</p>
              )}
            </CardContent>
          </Card>

          {/* Live Tracking */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Live Bus Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MapComponent 
                className="w-full h-96 rounded-lg"
                center={{ lat: 30.7749, lng: 76.7194 }}
                zoom={13}
                markers={[
                  {
                    position: { lat: 30.7749, lng: 76.7194 },
                    title: "PEC Main Gate",
                    info: "<div class='p-2'><h3 class='font-bold'>PEC Main Gate</h3><p>Destination Point</p></div>"
                  }
                ]}
              />
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Real-time bus location tracking for Bus #{studentData?.busNo}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;