export interface Control {
  id: string;
  name: string;
  description: string;
  framework: string;
  category: string;
  implemented: boolean;
}

export const mockControls: Control[] = [
  {
    id: "NIST-CSF-ID.AM-1",
    name: "Physical devices and systems inventory",
    description: "Physical devices and systems within the organization are inventoried",
    framework: "NIST CSF",
    category: "Identify",
    implemented: true,
  },
  {
    id: "NIST-CSF-PR.AC-1",
    name: "Identity and credentials management",
    description: "Identities and credentials are issued, managed, verified, revoked, and audited for authorized devices, users and processes",
    framework: "NIST CSF",
    category: "Protect",
    implemented: true,
  },
  {
    id: "CIS-1.1",
    name: "Establish and Maintain Detailed Enterprise Asset Inventory",
    description: "Establish and maintain an accurate, detailed, and up-to-date inventory of all enterprise assets",
    framework: "CIS Controls",
    category: "Asset Management",
    implemented: false,
  },
  {
    id: "CIS-4.1",
    name: "Establish and Maintain a Secure Configuration Process",
    description: "Establish and maintain a secure configuration process for enterprise assets",
    framework: "CIS Controls",
    category: "Secure Configuration",
    implemented: true,
  },
  {
    id: "NIST-CSF-DE.CM-1",
    name: "Network monitoring",
    description: "The network is monitored to detect potential cybersecurity events",
    framework: "NIST CSF",
    category: "Detect",
    implemented: true,
  },
  {
    id: "CIS-6.2",
    name: "Establish and Maintain a Software Inventory",
    description: "Establish and maintain a detailed inventory of all licensed software installed on enterprise assets",
    framework: "CIS Controls",
    category: "Asset Management",
    implemented: false,
  },
  {
    id: "NIST-CSF-RS.RP-1",
    name: "Response plan execution",
    description: "Response plan is executed during or after an incident",
    framework: "NIST CSF",
    category: "Respond",
    implemented: true,
  },
  {
    id: "CIS-13.1",
    name: "Centralize Security Event Alerting",
    description: "Centralize security event alerting across enterprise assets",
    framework: "CIS Controls",
    category: "Network Monitoring",
    implemented: false,
  },
];
