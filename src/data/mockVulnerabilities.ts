export interface Vulnerability {
  id: string;
  cveId: string;
  description: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  cvssScore: number;
  affectedProduct: string;
  status: "Open" | "Mitigated" | "Patched";
}

export const mockVulnerabilities: Vulnerability[] = [
  {
    id: "1",
    cveId: "CVE-2024-1234",
    description: "Remote code execution vulnerability in web server application due to improper input validation",
    severity: "Critical",
    cvssScore: 9.8,
    affectedProduct: "Apache HTTP Server 2.4.x",
    status: "Open",
  },
  {
    id: "2",
    cveId: "CVE-2024-5678",
    description: "SQL injection vulnerability in database management interface allows unauthorized data access",
    severity: "High",
    cvssScore: 8.1,
    affectedProduct: "MySQL 8.0.x",
    status: "Mitigated",
  },
  {
    id: "3",
    cveId: "CVE-2023-9876",
    description: "Cross-site scripting (XSS) vulnerability in web application framework",
    severity: "Medium",
    cvssScore: 6.5,
    affectedProduct: "React 17.x",
    status: "Patched",
  },
  {
    id: "4",
    cveId: "CVE-2024-2468",
    description: "Privilege escalation vulnerability in operating system kernel",
    severity: "Critical",
    cvssScore: 9.3,
    affectedProduct: "Windows Server 2019",
    status: "Open",
  },
  {
    id: "5",
    cveId: "CVE-2024-1357",
    description: "Authentication bypass vulnerability in VPN software",
    severity: "High",
    cvssScore: 7.8,
    affectedProduct: "Cisco AnyConnect 4.x",
    status: "Mitigated",
  },
  {
    id: "6",
    cveId: "CVE-2023-7890",
    description: "Buffer overflow vulnerability in network driver",
    severity: "Medium",
    cvssScore: 5.9,
    affectedProduct: "Linux Kernel 5.x",
    status: "Patched",
  },
  {
    id: "7",
    cveId: "CVE-2024-3690",
    description: "Denial of service vulnerability in DNS server",
    severity: "High",
    cvssScore: 7.5,
    affectedProduct: "BIND 9.x",
    status: "Open",
  },
  {
    id: "8",
    cveId: "CVE-2024-1470",
    description: "Information disclosure vulnerability in cloud storage service",
    severity: "Low",
    cvssScore: 4.3,
    affectedProduct: "AWS S3 SDK",
    status: "Patched",
  },
];
