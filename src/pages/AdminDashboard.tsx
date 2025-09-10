import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Bus, 
  Route, 
  BarChart3, 
  Download, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle,
  Filter,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import AddItemDialog from "@/components/AddItemDialog";

interface Student {
  serialNo: string;
  name: string;
  rollNo: string;
  department: string;
  year: string;
  busNo: string;
  routeName: string;
  routeNumber: string;
}

interface Driver {
  driverId: string;
  name: string;
  contact: string;
  busNo: string;
  route: string;
  licenseNo: string;
}

interface BusData {
  busNo: string;
  capacity: number;
  routeName: string;
  routeNumber: string;
  driverAssigned: string;
  status: string;
}

interface BusLoadAnalysis {
  busNo: string;
  capacity: number;
  assignedStudents: number;
  status: "ok" | "overcrowded" | "underutilized";
}

const AdminDashboard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [buses, setBuses] = useState<BusData[]>([]);
  const [busLoadAnalysis, setBusLoadAnalysis] = useState<BusLoadAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStudents(),
        fetchDrivers(),
        fetchBuses()
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const [cseResponse, csbsResponse] = await Promise.all([
        fetch("https://sheetdb.io/api/v1/dnwg7wehqdtue"),
        fetch("https://sheetdb.io/api/v1/667d72shtkr7r")
      ]);

      const cseData = await cseResponse.json();
      const csbsData = await csbsResponse.json();

      const allStudents: Student[] = [...cseData, ...csbsData].map((student: any, index: number) => ({
        serialNo: student["Serial No"] || String(index + 1),
        name: student.Name || "N/A",
        rollNo: student["Roll No"] || "N/A",
        department: student.Department || "N/A",
        year: student.Year || "N/A",
        busNo: student["Bus No"] || "N/A",
        routeName: student["Route Name"] || "N/A",
        routeNumber: student["Route Number"] || "N/A"
      }));

      setStudents(allStudents);
      generateBusLoadAnalysis(allStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await fetch("https://sheetdb.io/api/v1/kkjjnms5jrxvg");
      const data = await response.json();
      
      const driversList: Driver[] = data.map((driver: any) => ({
        driverId: driver["Driver ID"] || "N/A",
        name: driver.Name || "N/A",
        contact: driver.Contact || "N/A",
        busNo: driver["Bus No"] || "N/A",
        route: driver.Route || "N/A",
        licenseNo: driver["License No"] || "N/A"
      }));

      setDrivers(driversList);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  const fetchBuses = async () => {
    try {
      const response = await fetch("https://sheetdb.io/api/v1/kg3nesuu85sc9");
      const data = await response.json();
      
      const busList: BusData[] = data.map((bus: any) => ({
        busNo: bus["Bus No"] || "N/A",
        capacity: parseInt(bus.Capacity) || 0,
        routeName: bus["Route Name"] || "N/A",
        routeNumber: bus["Route Number"] || "N/A",
        driverAssigned: bus["Driver Assigned"] || "N/A",
        status: bus.Status || "N/A"
      }));

      setBuses(busList);
    } catch (error) {
      console.error("Error fetching buses:", error);
    }
  };

  const generateBusLoadAnalysis = (studentData: Student[]) => {
    // Count students per bus
    const busStudentCount: { [key: string]: number } = {};
    studentData.forEach(student => {
      if (student.busNo && student.busNo !== "N/A") {
        busStudentCount[student.busNo] = (busStudentCount[student.busNo] || 0) + 1;
      }
    });

    // Get bus capacities (assuming 50 for now, will update when buses data loads)
    const analysis: BusLoadAnalysis[] = Object.entries(busStudentCount).map(([busNo, studentCount]) => {
      const capacity = 50; // Default capacity
      let status: "ok" | "overcrowded" | "underutilized" = "ok";
      
      if (studentCount > capacity * 0.9) {
        status = "overcrowded";
      } else if (studentCount < capacity * 0.3) {
        status = "underutilized";
      }

      return {
        busNo,
        capacity,
        assignedStudents: studentCount,
        status
      };
    });

    setBusLoadAnalysis(analysis);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || student.department === departmentFilter;
    const matchesYear = yearFilter === "all" || student.year === yearFilter;
    
    return matchesSearch && matchesDepartment && matchesYear;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ok":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "overcrowded":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "underutilized":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ok":
        return <Badge className="bg-success-bg text-success">✅ OK</Badge>;
      case "overcrowded":
        return <Badge className="bg-destructive-bg text-destructive">❌ Overcrowded</Badge>;
      case "underutilized":
        return <Badge className="bg-warning-bg text-warning">⚠ Underutilized</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    const csvContent = [
      Object.keys(data[0]).join(","),
      ...data.map(row => Object.values(row).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `${filename} has been downloaded.`,
    });
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Complete bus management and analytics system
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-xs text-muted-foreground">
                Across all departments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
              <Bus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{drivers.length}</div>
              <p className="text-xs text-muted-foreground">
                Registered drivers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Buses</CardTitle>
              <Route className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{buses.length}</div>
              <p className="text-xs text-muted-foreground">
                Fleet capacity
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Load Issues</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {busLoadAnalysis.filter(b => b.status === "overcrowded").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Overcrowded buses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="drivers">Drivers</TabsTrigger>
            <TabsTrigger value="buses">Buses</TabsTrigger>
            <TabsTrigger value="analysis">Load Analysis</TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Student Management</CardTitle>
                  <div className="flex gap-2">
                    <AddItemDialog type="student" onAdd={(data) => setStudents([...students, data])} />
                    <Button onClick={() => exportToCSV(filteredStudents, "students_data")}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or roll number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="CSE">CSE</SelectItem>
                      <SelectItem value="CSBS">CSBS</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Students Table */}
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b bg-muted/30">
                        <tr>
                          <th className="p-3 text-left font-medium">Name</th>
                          <th className="p-3 text-left font-medium">Roll No</th>
                          <th className="p-3 text-left font-medium">Department</th>
                          <th className="p-3 text-left font-medium">Year</th>
                          <th className="p-3 text-left font-medium">Bus No</th>
                          <th className="p-3 text-left font-medium">Route</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((student, index) => (
                          <tr key={index} className="border-b hover:bg-muted/20">
                            <td className="p-3 font-medium">{student.name}</td>
                            <td className="p-3 font-mono text-sm">{student.rollNo}</td>
                            <td className="p-3">
                              <Badge variant="outline">{student.department}</Badge>
                            </td>
                            <td className="p-3">{student.year}</td>
                            <td className="p-3 font-semibold text-primary">{student.busNo}</td>
                            <td className="p-3">{student.routeName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Drivers Tab */}
          <TabsContent value="drivers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Driver Management</CardTitle>
                  <div className="flex gap-2">
                    <AddItemDialog type="driver" onAdd={(data) => setDrivers([...drivers, data])} />
                    <Button onClick={() => exportToCSV(drivers, "drivers_data")}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b bg-muted/30">
                        <tr>
                          <th className="p-3 text-left font-medium">Driver ID</th>
                          <th className="p-3 text-left font-medium">Name</th>
                          <th className="p-3 text-left font-medium">Contact</th>
                          <th className="p-3 text-left font-medium">Bus No</th>
                          <th className="p-3 text-left font-medium">Route</th>
                          <th className="p-3 text-left font-medium">License</th>
                        </tr>
                      </thead>
                      <tbody>
                        {drivers.map((driver, index) => (
                          <tr key={index} className="border-b hover:bg-muted/20">
                            <td className="p-3 font-mono text-sm">{driver.driverId}</td>
                            <td className="p-3 font-medium">{driver.name}</td>
                            <td className="p-3">{driver.contact}</td>
                            <td className="p-3 font-semibold text-primary">{driver.busNo}</td>
                            <td className="p-3">{driver.route}</td>
                            <td className="p-3 font-mono text-sm">{driver.licenseNo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Buses Tab */}
          <TabsContent value="buses" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Bus Management</CardTitle>
                  <div className="flex gap-2">
                    <AddItemDialog type="bus" onAdd={(data) => setBuses([...buses, data])} />
                    <Button onClick={() => exportToCSV(buses, "buses_data")}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b bg-muted/30">
                        <tr>
                          <th className="p-3 text-left font-medium">Bus No</th>
                          <th className="p-3 text-left font-medium">Capacity</th>
                          <th className="p-3 text-left font-medium">Route</th>
                          <th className="p-3 text-left font-medium">Driver</th>
                          <th className="p-3 text-left font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {buses.map((bus, index) => (
                          <tr key={index} className="border-b hover:bg-muted/20">
                            <td className="p-3 font-semibold text-primary">{bus.busNo}</td>
                            <td className="p-3">{bus.capacity} passengers</td>
                            <td className="p-3">{bus.routeName}</td>
                            <td className="p-3">{bus.driverAssigned}</td>
                            <td className="p-3">
                              <Badge variant="outline">{bus.status}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Load Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Bus Load Analysis</CardTitle>
                  <Button onClick={() => exportToCSV(busLoadAnalysis, "bus_load_analysis")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Analysis
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b bg-muted/30">
                        <tr>
                          <th className="p-3 text-left font-medium">Bus No</th>
                          <th className="p-3 text-left font-medium">Capacity</th>
                          <th className="p-3 text-left font-medium">Assigned Students</th>
                          <th className="p-3 text-left font-medium">Utilization</th>
                          <th className="p-3 text-left font-medium">Status</th>
                          <th className="p-3 text-left font-medium">Recommendation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {busLoadAnalysis.map((bus, index) => {
                          const utilization = Math.round((bus.assignedStudents / bus.capacity) * 100);
                          const getRecommendation = () => {
                            if (bus.status === "overcrowded") return "Extra bus required";
                            if (bus.status === "underutilized") return "Bus can be reduced";
                            return "Optimal capacity";
                          };

                          return (
                            <tr key={index} className="border-b hover:bg-muted/20">
                              <td className="p-3 font-semibold text-primary">{bus.busNo}</td>
                              <td className="p-3">{bus.capacity}</td>
                              <td className="p-3 font-semibold">{bus.assignedStudents}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 bg-muted rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${
                                        utilization > 90 ? 'bg-destructive' : 
                                        utilization < 30 ? 'bg-warning' : 'bg-success'
                                      }`}
                                      style={{ width: `${Math.min(utilization, 100)}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium">{utilization}%</span>
                                </div>
                              </td>
                              <td className="p-3">
                                {getStatusBadge(bus.status)}
                              </td>
                              <td className="p-3 text-sm text-muted-foreground">
                                {getRecommendation()}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;