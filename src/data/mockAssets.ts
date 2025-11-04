export interface Asset {
  id: string;
  name: string;
  type: "Server" | "Database" | "Cloud Resource" | "Network Device" | "Endpoint";
  location: string;
  owner: string;
  criticality: "Low" | "Medium" | "High" | "Critical";
  status: "Active" | "Inactive" | "Maintenance";
}

export const mockAssets: Asset[] = [
  {
    id: "SRV-001",
    name: "Production Web Server",
    type: "Server",
    location: "Data Center A - Rack 12",
    owner: "IT Operations",
    criticality: "Critical",
    status: "Active",
  },
  {
    id: "DB-001",
    name: "Customer Database",
    type: "Database",
    location: "Cloud - AWS US-East-1",
    owner: "Database Team",
    criticality: "Critical",
    status: "Active",
  },
  {
    id: "CLD-001",
    name: "S3 Backup Storage",
    type: "Cloud Resource",
    location: "AWS US-West-2",
    owner: "DevOps",
    criticality: "High",
    status: "Active",
  },
  {
    id: "NET-001",
    name: "Core Router",
    type: "Network Device",
    location: "Data Center A - Network Room",
    owner: "Network Team",
    criticality: "Critical",
    status: "Active",
  },
  {
    id: "EP-001",
    name: "Employee Workstations",
    type: "Endpoint",
    location: "Office Floor 3",
    owner: "IT Support",
    criticality: "Medium",
    status: "Active",
  },
  {
    id: "SRV-002",
    name: "Development Server",
    type: "Server",
    location: "Data Center B - Rack 5",
    owner: "Development Team",
    criticality: "Medium",
    status: "Active",
  },
  {
    id: "DB-002",
    name: "Analytics Database",
    type: "Database",
    location: "Cloud - Azure East US",
    owner: "Data Analytics",
    criticality: "High",
    status: "Active",
  },
  {
    id: "NET-002",
    name: "Firewall Appliance",
    type: "Network Device",
    location: "Data Center A - DMZ",
    owner: "Security Team",
    criticality: "Critical",
    status: "Active",
  },
];
