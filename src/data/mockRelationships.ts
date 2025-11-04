export interface Relationship {
  source: string;
  target: string;
  type: "mitigates" | "exploits" | "affects" | "protects";
}

export const mockRelationships: Relationship[] = [
  // Controls mitigate Threats
  { source: "NIST-CSF-PR.AC-1", target: "T1078", type: "mitigates" },
  { source: "NIST-CSF-DE.CM-1", target: "T1071", type: "mitigates" },
  { source: "CIS-4.1", target: "T1190", type: "mitigates" },
  { source: "NIST-CSF-RS.RP-1", target: "T1486", type: "mitigates" },
  { source: "CIS-13.1", target: "T1059", type: "mitigates" },
  
  // Threats exploit Vulnerabilities
  { source: "T1190", target: "CVE-2024-1234", type: "exploits" },
  { source: "T1078", target: "CVE-2024-1357", type: "exploits" },
  { source: "T1068", target: "CVE-2024-2468", type: "exploits" },
  { source: "T1566", target: "CVE-2023-9876", type: "exploits" },
  
  // Vulnerabilities affect Assets
  { source: "CVE-2024-1234", target: "SRV-001", type: "affects" },
  { source: "CVE-2024-5678", target: "DB-001", type: "affects" },
  { source: "CVE-2024-2468", target: "SRV-001", type: "affects" },
  { source: "CVE-2024-1357", target: "NET-002", type: "affects" },
  
  // Controls protect Assets
  { source: "NIST-CSF-PR.AC-1", target: "SRV-001", type: "protects" },
  { source: "CIS-4.1", target: "DB-001", type: "protects" },
  { source: "NIST-CSF-DE.CM-1", target: "NET-001", type: "protects" },
];
