import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  RefreshCw,
  Download,
  MessageCircle,
  Heart,
  Loader2,
  Calendar,
  UserCheck
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export default function AdminOverview() {
  // Query to fetch admin overview data
  const { data: overviewData, isLoading, error, refetch } = useQuery({
    queryKey: ['adminOverview'],
    queryFn: () => adminApi.getOverview(),
    select: (response) => response.data,
  });

  // Query to fetch crisis alerts
  const { data: crisisData } = useQuery({
    queryKey: ['adminCrisisAlerts', 'active'],
    queryFn: () => adminApi.getCrisisAlerts({ status: 'active', limit: 10 }),
    select: (response) => response.data,
  });

  const handleRefresh = () => {
    refetch();
    toast.success('Data refreshed');
  };

  const handleExport = () => {
    // TODO: Implement data export functionality
    toast.info('Export functionality coming soon');
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <p className="text-destructive">Failed to load admin data</p>
          <Button onClick={() => refetch()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          Admin Overview
        </h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (overviewData?.overview.totalStudents || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-wellness" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Daily Active</p>
                <p className="text-2xl font-bold">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : overviewData?.overview.dailyActiveUsers || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-crisis" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (crisisData?.statistics.totalActive || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-accent" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg Mood Score</p>
                <p className="text-2xl font-bold">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (overviewData?.overview.averageMoodScore?.toFixed(1) || '0') + '/5'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-accent" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Mentors</p>
                <p className="text-2xl font-bold">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (overviewData?.overview.totalMentors || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Chat Sessions</p>
                <p className="text-2xl font-bold">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (overviewData?.engagement.totalChatSessions || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-wellness" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Mood Entries</p>
                <p className="text-2xl font-bold">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (overviewData?.engagement.totalMoodEntries || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Crisis Alerts */}
      {crisisData?.alerts && crisisData.alerts.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-crisis" />
              Recent Crisis Alerts
              <Badge variant="destructive" className="ml-auto">
                {crisisData.alerts.length} Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {crisisData.alerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg bg-crisis/5">
                  <div>
                    <div className="font-medium">{alert.areaOfConcern}</div>
                    <div className="text-sm text-muted-foreground">
                      {alert.description || 'No description provided'}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <Badge 
                    variant={alert.priority === 'critical' ? 'destructive' : 
                            alert.priority === 'high' ? 'destructive' : 
                            alert.priority === 'medium' ? 'default' : 'secondary'}
                  >
                    {alert.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}