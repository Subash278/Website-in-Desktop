import { ChevronRight, Shield, AlertTriangle, Bug, CheckCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockControls } from "@/data/mockControls";
import { mockThreats } from "@/data/mockThreats";
import { mockVulnerabilities } from "@/data/mockVulnerabilities";
import { Progress } from "@/components/ui/progress";

export default function ComplianceDashboard() {
  // Calculate statistics
  const totalControls = mockControls.length;
  const implementedControls = mockControls.filter((c) => c.implemented).length;
  const compliancePercentage = Math.round((implementedControls / totalControls) * 100);

  const totalThreats = mockThreats.length;
  const criticalThreats = mockThreats.filter((t) => t.severity === "Critical").length;

  const totalVulns = mockVulnerabilities.length;
  const openVulns = mockVulnerabilities.filter((v) => v.status === "Open").length;
  const criticalVulns = mockVulnerabilities.filter(
    (v) => v.severity === "Critical" && v.status === "Open"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Dashboard</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Compliance Dashboard</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          📊 Compliance Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Overview of security posture and compliance status
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Controls
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{implementedControls}/{totalControls}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Controls implemented
            </p>
            <Progress value={compliancePercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Vulnerabilities
            </CardTitle>
            <Bug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{openVulns}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {criticalVulns} critical severity
            </p>
            <Badge variant="destructive" className="mt-2">Needs Attention</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Threats Mapped
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalThreats}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {criticalThreats} critical threats
            </p>
            <Badge variant="outline" className="mt-2">Monitored</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Compliance Status
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{compliancePercentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Overall compliance
            </p>
            <Badge 
              className={compliancePercentage >= 80 ? "bg-green-500 mt-2" : "bg-yellow-500 mt-2"}
            >
              {compliancePercentage >= 80 ? "Good" : "Needs Improvement"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Framework Compliance */}
      <Card>
        <CardHeader>
          <CardTitle>Framework Compliance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">NIST CSF</span>
              <span className="text-sm text-muted-foreground">
                {mockControls.filter((c) => c.framework === "NIST CSF" && c.implemented).length}/
                {mockControls.filter((c) => c.framework === "NIST CSF").length}
              </span>
            </div>
            <Progress
              value={
                (mockControls.filter((c) => c.framework === "NIST CSF" && c.implemented).length /
                  mockControls.filter((c) => c.framework === "NIST CSF").length) *
                100
              }
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">CIS Controls</span>
              <span className="text-sm text-muted-foreground">
                {mockControls.filter((c) => c.framework === "CIS Controls" && c.implemented).length}/
                {mockControls.filter((c) => c.framework === "CIS Controls").length}
              </span>
            </div>
            <Progress
              value={
                (mockControls.filter((c) => c.framework === "CIS Controls" && c.implemented).length /
                  mockControls.filter((c) => c.framework === "CIS Controls").length) *
                100
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Critical Vulnerabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockVulnerabilities
                .filter((v) => v.severity === "Critical" && v.status === "Open")
                .slice(0, 3)
                .map((vuln) => (
                  <div
                    key={vuln.id}
                    className="flex items-start justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-mono text-sm font-semibold">{vuln.cveId}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {vuln.affectedProduct}
                      </p>
                    </div>
                    <Badge variant="destructive">Critical</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Implementation Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Identify", "Protect", "Detect"].map((category) => {
                const total = mockControls.filter((c) => c.category === category).length;
                const implemented = mockControls.filter(
                  (c) => c.category === category && c.implemented
                ).length;
                const percentage = total > 0 ? Math.round((implemented / total) * 100) : 0;

                return (
                  <div key={category} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{category}</span>
                      <span className="text-muted-foreground">
                        {implemented}/{total}
                      </span>
                    </div>
                    <Progress value={percentage} />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
