export interface Threat {
  id: string;
  tactic: string;
  technique: string;
  description: string;
  mitreId: string;
  severity: "Low" | "Medium" | "High" | "Critical";
}

export const mockThreats: Threat[] = [
  {
    id: "T1190",
    tactic: "Initial Access",
    technique: "Exploit Public-Facing Application",
    description: "Adversaries may attempt to take advantage of a weakness in an Internet-facing computer or program using software, data, or commands in order to cause unintended behavior",
    mitreId: "T1190",
    severity: "High",
  },
  {
    id: "T1078",
    tactic: "Defense Evasion",
    technique: "Valid Accounts",
    description: "Adversaries may obtain and abuse credentials of existing accounts as a means of gaining Initial Access, Persistence, Privilege Escalation, or Defense Evasion",
    mitreId: "T1078",
    severity: "Critical",
  },
  {
    id: "T1486",
    tactic: "Impact",
    technique: "Data Encrypted for Impact",
    description: "Adversaries may encrypt data on target systems or on large numbers of systems in a network to interrupt availability to system and network resources",
    mitreId: "T1486",
    severity: "Critical",
  },
  {
    id: "T1566",
    tactic: "Initial Access",
    technique: "Phishing",
    description: "Adversaries may send phishing messages to gain access to victim systems. All forms of phishing are electronically delivered social engineering",
    mitreId: "T1566",
    severity: "High",
  },
  {
    id: "T1071",
    tactic: "Command and Control",
    technique: "Application Layer Protocol",
    description: "Adversaries may communicate using OSI application layer protocols to avoid detection/network filtering by blending in with existing traffic",
    mitreId: "T1071",
    severity: "Medium",
  },
  {
    id: "T1003",
    tactic: "Credential Access",
    technique: "OS Credential Dumping",
    description: "Adversaries may attempt to dump credentials to obtain account login and credential material",
    mitreId: "T1003",
    severity: "High",
  },
  {
    id: "T1059",
    tactic: "Execution",
    technique: "Command and Scripting Interpreter",
    description: "Adversaries may abuse command and script interpreters to execute commands, scripts, or binaries",
    mitreId: "T1059",
    severity: "Medium",
  },
  {
    id: "T1068",
    tactic: "Privilege Escalation",
    technique: "Exploitation for Privilege Escalation",
    description: "Adversaries may exploit software vulnerabilities in an attempt to elevate privileges",
    mitreId: "T1068",
    severity: "High",
  },
];
