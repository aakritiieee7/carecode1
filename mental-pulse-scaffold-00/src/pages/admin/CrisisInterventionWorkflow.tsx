// src/pages/admin/CrisisInterventionWorkflow.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertTriangle, Clock, User, MapPin, Phone, Mail, 
  CheckCircle, XCircle, Shield, Activity, MessageSquare,
  UserCheck, Calendar, RefreshCw
} from "lucide-react";
import { useCrisisAlerts, useUpdateCrisisAlert } from "@/hooks/useApi";
import { toast } from "sonner";

export default function CrisisInterventionWorkflow() {
  const [selectedStatus, setSelectedStatus] = useState<string>("active");
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [responseNotes, setResponseNotes] = useState("");

  // Real API integration
  const { data: alertsData, isLoading, refetch } = useCrisisAlerts({
    status: selectedStatus === "all" ? undefined : selectedStatus,
    page: 1,
    limit: 50
  });

  const updateAlertMutation = useUpdateCrisisAlert();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-600 text-white";
      case "high": return "bg-red-500 text-white";
      case "medium": return "bg-yellow-500 text-white";
      case "low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getTimeElapsed = (timestamp: string) => {
    const now = Date.now();
    const alertTime = new Date(timestamp).getTime();
    const elapsed = now - alertTime;
    
    const minutes = Math.floor(elapsed / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      await updateAlertMutation.mutateAsync({
        alertId,
        isResolved: true
      });
      refetch();
      setIsResponseModalOpen(false);
      toast.success("Crisis alert resolved successfully");
    } catch (error) {
      toast.error("Failed to resolve alert");
    }
  };

  const handleReopenAlert = async (alertId: string) => {
    try {
      await updateAlertMutation.mutateAsync({
        alertId,
        isResolved: false
      });
      refetch();
      toast.success("Crisis alert reopened");
    } catch (error) {
      toast.error("Failed to reopen alert");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-center min-h-[400px]">
          <Activity className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const alerts = alertsData?.alerts || [];
  const statistics = alertsData?.statistics || {};

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Shield className="h-8 w-8 text-crisis" />
            Crisis Intervention Workflow
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time crisis alert management and emergency response coordination
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Alerts</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold text-crisis">{statistics.active || 0}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-crisis" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved Today</p>
                <p className="text-2xl font-bold text-wellness">{statistics.resolved || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-wellness" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">12m</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last 24 Hours</p>
                <p className="text-2xl font-bold">{statistics.last24Hours || 0}</p>
              </div>
              <Activity className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crisis Alerts List */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Crisis Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">No alerts found</h3>
              <p className="text-muted-foreground">No crisis alerts match your current filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert: any) => (
                <div key={alert.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <Badge className={getPriorityColor(alert.priority)}>
                          {alert.priority}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{alert.areaOfConcern}</h3>
                        {alert.description && (
                          <p className="text-muted-foreground mt-1">{alert.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={alert.isResolved ? "default" : "destructive"}>
                        {alert.isResolved ? "Resolved" : "Active"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {getTimeElapsed(alert.timestamp)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{alert.areaOfConcern}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{alert.reporter?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(alert.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {alert.reporter?.canContact && (
                        <>
                          {alert.reporter?.email && (
                            <Button size="sm" variant="outline">
                              <Mail className="h-4 w-4 mr-2" />
                              Contact
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </Button>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Dialog open={isResponseModalOpen} onOpenChange={setIsResponseModalOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedAlert(alert)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Respond
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Crisis Alert Response</DialogTitle>
                          </DialogHeader>
                          
                          {selectedAlert && (
                            <div className="space-y-4">
                              <div className="p-4 bg-muted/50 rounded-lg">
                                <h4 className="font-semibold mb-2">{selectedAlert.areaOfConcern}</h4>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {selectedAlert.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs">
                                  <span>Reporter: {selectedAlert.reporter?.name}</span>
                                  <span>Time: {getTimeElapsed(selectedAlert.timestamp)}</span>
                                  <Badge className={getPriorityColor(selectedAlert.priority)}>
                                    {selectedAlert.priority}
                                  </Badge>
                                </div>
                              </div>

                              <div>
                                <label className="text-sm font-medium mb-2 block">
                                  Response Notes (Optional)
                                </label>
                                <Textarea
                                  placeholder="Enter response details, actions taken, or additional notes..."
                                  value={responseNotes}
                                  onChange={(e) => setResponseNotes(e.target.value)}
                                  rows={3}
                                />
                              </div>

                              <div className="flex gap-3">
                                <Button
                                  onClick={() => handleResolveAlert(selectedAlert.id)}
                                  className="flex-1"
                                  disabled={updateAlertMutation.isPending}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark as Resolved
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => setIsResponseModalOpen(false)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {alert.isResolved ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleReopenAlert(alert.id)}
                          disabled={updateAlertMutation.isPending}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reopen
                        </Button>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => handleResolveAlert(alert.id)}
                          disabled={updateAlertMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}