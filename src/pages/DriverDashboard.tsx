import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bus, MapPin, Clock, Play, Square, AlertTriangle, Route, Phone, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";

interface DriverInfo {
  name: string;
  driverId: string;
  contact: string;
  busNo: string;
  route: string;
  licenseNo: string;
}

interface BusInfo {
  busNo: string;
  capacity: string;
  routeName: string;
  routeNumber: string;
  status: string;
}

interface RouteInfo {
  routeNumber: string;
  routeName: string;
  stops: string;
  distance: string;
  avgTime: string;
}

const DriverDashboard = () => {
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null);
  const [busInfo, setBusInfo] = useState<BusInfo | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [tripStatus, setTripStatus] = useState<"idle" | "running" | "completed">("idle");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const driverId = user.identifier;
    
    if (driverId) {
      fetchDriverData(driverId);
    }
  }, []);

  const fetchDriverData = async (driverId: string) => {
    try {
      setLoading(true);
      
      // Fetch driver data
      const driverResponse = await fetch("https://sheetdb.io/api/v1/kkjjnms5jrxvg");
      const driverData = await driverResponse.json();
      const driver = driverData.find((d: any) => d["Driver ID"] === driverId);

      if (!driver) {
        toast({
          title: "Driver Not Found",
          description: "Your driver ID is not registered in the system.",
          variant: "destructive",
        });
        return;
      }

      const driverInfo: DriverInfo = {
        name: driver.Name || "N/A",
        driverId: driver["Driver ID"] || "N/A",
        contact: driver.Contact || "N/A",
        busNo: driver["Bus No"] || "N/A",
        route: driver.Route || "N/A",
        licenseNo: driver["License No"] || "N/A"
      };

      setDriverInfo(driverInfo);

      // Fetch bus data
      if (driverInfo.busNo) {
        await fetchBusData(driverInfo.busNo);
      }

      // Fetch route data
      if (driverInfo.route) {
        await fetchRouteData(driverInfo.route);
      }

    } catch (error) {
      console.error("Error fetching driver data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch driver data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBusData = async (busNo: string) => {
    try {
      const response = await fetch("https://sheetdb.io/api/v1/kg3nesuu85sc9");
      const data = await response.json();
      const bus = data.find((b: any) => b["Bus No"] === busNo);
      
      if (bus) {
        setBusInfo({
          busNo: bus["Bus No"] || "N/A",
          capacity: bus.Capacity || "N/A",
          routeName: bus["Route Name"] || "N/A",
          routeNumber: bus["Route Number"] || "N/A",
          status: bus.Status || "N/A"
        });
      }
    } catch (error) {
      console.error("Error fetching bus data:", error);
    }
  };

  const fetchRouteData = async (routeNumber: string) => {
    try {
      const response = await fetch("https://sheetdb.io/api/v1/8qa6al4l8k3m5");
      const data = await response.json();
      const route = data.find((r: any) => r["Route Number"] === routeNumber);
      
      if (route) {
        setRouteInfo({
          routeNumber: route["Route Number"] || "N/A",
          routeName: route["Route Name"] || "N/A",
          stops: route.Stops || "N/A",
          distance: route.Distance || "N/A",
          avgTime: route["Avg Time"] || "N/A"
        });
      }
    } catch (error) {
      console.error("Error fetching route data:", error);
    }
  };

  const handleStartTrip = () => {
    setTripStatus("running");
    toast({
      title: "Trip Started",
      description: "Your trip has been logged. Drive safely!",
    });
  };

  const handleEndTrip = () => {
    setTripStatus("completed");
    toast({
      title: "Trip Completed",
      description: "Trip completed successfully. Thank you for your service!",
    });
  };

  const handleEmergencyAlert = () => {
    toast({
      title: "Emergency Alert Sent",
      description: "Emergency alert has been sent to administrators.",
      variant: "destructive",
    });
  };

  const getStatusColor = () => {
    switch (tripStatus) {
      case "running":
        return "success";
      case "completed":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="driver">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="driver">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Driver Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {driverInfo?.name || "Driver"}
            </p>
          </div>
          <Badge variant={getStatusColor() as any} className="px-3 py-1">
            <Bus className="h-4 w-4 mr-1" />
            {tripStatus.charAt(0).toUpperCase() + tripStatus.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Driver Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bus className="h-5 w-5 text-primary" />
                Driver Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{driverInfo?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Driver ID</p>
                <p className="font-mono text-sm">{driverInfo?.driverId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">License No</p>
                <p className="font-mono text-sm">{driverInfo?.licenseNo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-medium">{driverInfo?.contact}</p>
              </div>
            </CardContent>
          </Card>

          {/* Bus Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bus className="h-5 w-5 text-primary" />
                Assigned Bus
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {busInfo ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Bus Number</p>
                    <p className="text-2xl font-bold text-primary">{busInfo.busNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <p className="font-medium">{busInfo.capacity} passengers</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant="outline">{busInfo.status}</Badge>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">Bus information not available</p>
              )}
            </CardContent>
          </Card>

          {/* Trip Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                Trip Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {tripStatus === "idle" && (
                  <Button onClick={handleStartTrip} className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Start Trip
                  </Button>
                )}
                
                {tripStatus === "running" && (
                  <Button onClick={handleEndTrip} variant="secondary" className="w-full">
                    <Square className="h-4 w-4 mr-2" />
                    End Trip
                  </Button>
                )}

                {tripStatus === "completed" && (
                  <Button onClick={() => setTripStatus("idle")} variant="outline" className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Start New Trip
                  </Button>
                )}

                <Button 
                  onClick={handleEmergencyAlert} 
                  variant="destructive" 
                  className="w-full"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Emergency Alert
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Route Information */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5 text-primary" />
                Route Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {routeInfo ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Route Stops</p>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm">{routeInfo.stops}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Distance</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <p className="font-semibold">{routeInfo.distance}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Average Time</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <p className="font-semibold">{routeInfo.avgTime}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Route information not available</p>
              )}
            </CardContent>
          </Card>

          {/* Live Location */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Live Location Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">GPS tracking will be integrated here</p>
                <Button variant="outline" disabled>
                  <MapPin className="h-4 w-4 mr-2" />
                  Enable Location Sharing
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DriverDashboard;