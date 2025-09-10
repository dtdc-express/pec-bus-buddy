import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddItemDialogProps {
  type: "student" | "driver" | "bus";
  onAdd: (data: any) => void;
  trigger?: React.ReactNode;
}

const AddItemDialog = ({ type, onAdd, trigger }: AddItemDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields based on type
      const requiredFields = getRequiredFields();
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Validation Error",
          description: `Please fill in: ${missingFields.join(", ")}`,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Submit to Google Sheets
      const apiUrl = getApiUrl();
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add item");
      }

      toast({
        title: "Success",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} added successfully!`,
      });

      onAdd(formData);
      setFormData({});
      setOpen(false);
    } catch (error) {
      console.error("Error adding item:", error);
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  const getApiUrl = () => {
    switch (type) {
      case "student":
        return "https://sheetdb.io/api/v1/dnwg7wehqdtue"; // CSE department by default
      case "driver":
        return "https://sheetdb.io/api/v1/kkjjnms5jrxvg";
      case "bus":
        return "https://sheetdb.io/api/v1/kg3nesuu85sc9";
      default:
        return "";
    }
  };

  const getRequiredFields = () => {
    switch (type) {
      case "student":
        return ["name", "rollNo", "department", "year", "busNo", "routeName", "routeNumber"];
      case "driver":
        return ["name", "driverId", "contact", "busNo", "route", "licenseNo"];
      case "bus":
        return ["busNo", "capacity", "routeName", "routeNumber", "status"];
      default:
        return [];
    }
  };

  const renderForm = () => {
    switch (type) {
      case "student":
        return (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Student Name"
                />
              </div>
              <div>
                <Label htmlFor="rollNo">Roll Number</Label>
                <Input
                  id="rollNo"
                  value={formData.rollNo || ""}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  placeholder="Roll Number"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department || ""}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSE">Computer Science</SelectItem>
                    <SelectItem value="CSBS">CS & Business Systems</SelectItem>
                    <SelectItem value="ECE">Electronics & Communication</SelectItem>
                    <SelectItem value="ME">Mechanical Engineering</SelectItem>
                    <SelectItem value="CE">Civil Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Select
                  value={formData.year || ""}
                  onValueChange={(value) => setFormData({ ...formData, year: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Year">1st Year</SelectItem>
                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                    <SelectItem value="4th Year">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="busNo">Bus Number</Label>
                <Input
                  id="busNo"
                  value={formData.busNo || ""}
                  onChange={(e) => setFormData({ ...formData, busNo: e.target.value })}
                  placeholder="Bus No."
                />
              </div>
              <div>
                <Label htmlFor="routeName">Route Name</Label>
                <Input
                  id="routeName"
                  value={formData.routeName || ""}
                  onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                  placeholder="Route Name"
                />
              </div>
              <div>
                <Label htmlFor="routeNumber">Route Number</Label>
                <Input
                  id="routeNumber"
                  value={formData.routeNumber || ""}
                  onChange={(e) => setFormData({ ...formData, routeNumber: e.target.value })}
                  placeholder="Route No."
                />
              </div>
            </div>
          </div>
        );

      case "driver":
        return (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Driver Name"
                />
              </div>
              <div>
                <Label htmlFor="driverId">Driver ID</Label>
                <Input
                  id="driverId"
                  value={formData.driverId || ""}
                  onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                  placeholder="Driver ID"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  value={formData.contact || ""}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="Phone Number"
                />
              </div>
              <div>
                <Label htmlFor="licenseNo">License Number</Label>
                <Input
                  id="licenseNo"
                  value={formData.licenseNo || ""}
                  onChange={(e) => setFormData({ ...formData, licenseNo: e.target.value })}
                  placeholder="License No."
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="busNo">Assigned Bus</Label>
                <Input
                  id="busNo"
                  value={formData.busNo || ""}
                  onChange={(e) => setFormData({ ...formData, busNo: e.target.value })}
                  placeholder="Bus Number"
                />
              </div>
              <div>
                <Label htmlFor="route">Route</Label>
                <Input
                  id="route"
                  value={formData.route || ""}
                  onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                  placeholder="Route Name"
                />
              </div>
            </div>
          </div>
        );

      case "bus":
        return (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="busNo">Bus Number</Label>
                <Input
                  id="busNo"
                  value={formData.busNo || ""}
                  onChange={(e) => setFormData({ ...formData, busNo: e.target.value })}
                  placeholder="Bus Number"
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity || ""}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  placeholder="Passenger Capacity"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="routeName">Route Name</Label>
                <Input
                  id="routeName"
                  value={formData.routeName || ""}
                  onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                  placeholder="Route Name"
                />
              </div>
              <div>
                <Label htmlFor="routeNumber">Route Number</Label>
                <Input
                  id="routeNumber"
                  value={formData.routeNumber || ""}
                  onChange={(e) => setFormData({ ...formData, routeNumber: e.target.value })}
                  placeholder="Route Number"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="driverAssigned">Driver Assigned</Label>
                <Input
                  id="driverAssigned"
                  value={formData.driverAssigned || ""}
                  onChange={(e) => setFormData({ ...formData, driverAssigned: e.target.value })}
                  placeholder="Driver Name/ID"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || ""}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New {type.charAt(0).toUpperCase() + type.slice(1)}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderForm()}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add " + type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;