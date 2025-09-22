import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, AlertTriangle, CheckCircle, Clock, Eye } from "lucide-react";

interface Student {
  id: string;
  lastCheckIn: string;
  riskStatus: "low" | "medium" | "high";
  engagementScore: number;
  lastActivity: string;
}

export function StudentTable() {
  const mockStudents: Student[] = [
    {
      id: "STU-2024-001",
      lastCheckIn: "2 hours ago",
      riskStatus: "medium",
      engagementScore: 72,
      lastActivity: "Wellness Check-in"
    },
    {
      id: "STU-2024-002",
      lastCheckIn: "1 day ago",
      riskStatus: "low",
      engagementScore: 89,
      lastActivity: "Resource Access"
    },
    {
      id: "STU-2024-003",
      lastCheckIn: "4 hours ago",
      riskStatus: "high",
      engagementScore: 34,
      lastActivity: "Crisis Alert"
    },
    {
      id: "STU-2024-004",
      lastCheckIn: "6 hours ago",
      riskStatus: "low",
      engagementScore: 91,
      lastActivity: "Chat Session"
    },
    {
      id: "STU-2024-005",
      lastCheckIn: "3 days ago",
      riskStatus: "medium",
      engagementScore: 58,
      lastActivity: "Peer Mentor Request"
    }
  ];

  const getRiskStatusConfig = (status: string) => {
    switch (status) {
      case "high":
        return {
          variant: "destructive" as const,
          icon: <AlertTriangle className="h-3 w-3" />,
          label: "High Risk"
        };
      case "medium":
        return {
          variant: "secondary" as const,
          icon: <Clock className="h-3 w-3" />,
          label: "Medium Risk"
        };
      case "low":
        return {
          variant: "outline" as const,
          icon: <CheckCircle className="h-3 w-3" />,
          label: "Low Risk"
        };
      default:
        return {
          variant: "outline" as const,
          icon: <Clock className="h-3 w-3" />,
          label: "Unknown"
        };
    }
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return "text-wellness";
    if (score >= 60) return "text-yellow-600";
    return "text-crisis";
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Student Wellness Overview
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Anonymous monitoring of student engagement and risk assessment
        </p>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-wellness-light rounded-lg">
            <CheckCircle className="h-5 w-5 mx-auto mb-1 text-wellness" />
            <div className="text-lg font-bold text-wellness">
              {mockStudents.filter(s => s.riskStatus === "low").length}
            </div>
            <div className="text-xs text-muted-foreground">Low Risk</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <Clock className="h-5 w-5 mx-auto mb-1 text-yellow-600" />
            <div className="text-lg font-bold text-yellow-600">
              {mockStudents.filter(s => s.riskStatus === "medium").length}
            </div>
            <div className="text-xs text-muted-foreground">Medium Risk</div>
          </div>
          <div className="text-center p-3 bg-crisis-light rounded-lg">
            <AlertTriangle className="h-5 w-5 mx-auto mb-1 text-crisis" />
            <div className="text-lg font-bold text-crisis">
              {mockStudents.filter(s => s.riskStatus === "high").length}
            </div>
            <div className="text-xs text-muted-foreground">High Risk</div>
          </div>
        </div>

        {/* Students Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Last Check-In</TableHead>
                <TableHead>Risk Status</TableHead>
                <TableHead>Engagement Score</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockStudents.map((student) => {
                const riskConfig = getRiskStatusConfig(student.riskStatus);
                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium font-mono text-sm">
                      {student.id}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {student.lastCheckIn}
                    </TableCell>
                    <TableCell>
                      <Badge variant={riskConfig.variant} className="flex items-center gap-1 w-fit">
                        {riskConfig.icon}
                        {riskConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${getEngagementColor(student.engagementScore)}`}>
                          {student.engagementScore}%
                        </span>
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              student.engagementScore >= 80 ? 'bg-wellness' :
                              student.engagementScore >= 60 ? 'bg-yellow-400' : 'bg-crisis'
                            }`}
                            style={{ width: `${student.engagementScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {student.lastActivity}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground">
            * All student data is anonymized. Risk assessment is based on engagement patterns, 
            check-in frequency, and self-reported wellness scores. No personal information is displayed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}