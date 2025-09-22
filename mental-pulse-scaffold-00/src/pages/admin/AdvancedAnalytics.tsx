// src/pages/admin/AdvancedAnalytics.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from "recharts";
import { 
  TrendingUp, Users, AlertTriangle, Brain, Download, Activity, Heart, Target, Shield
} from "lucide-react";

const trendData = [
  { month: "Jan", avgMood: 3.2, students: 1240, crisisEvents: 12, engagement: 68 },
  { month: "Feb", avgMood: 3.1, students: 1267, crisisEvents: 15, engagement: 71 },
  { month: "Mar", avgMood: 2.8, students: 1298, crisisEvents: 22, engagement: 65 },
  { month: "Apr", avgMood: 3.4, students: 1312, crisisEvents: 8, engagement: 76 },
  { month: "May", avgMood: 3.6, students: 1289, crisisEvents: 6, engagement: 82 },
  { month: "Jun", avgMood: 3.8, students: 1201, crisisEvents: 4, engagement: 88 }
];

const departmentData = [
  { name: "Engineering", students: 520, avgMood: 3.4, riskLevel: "medium", trend: "up" },
  { name: "Liberal Arts", students: 280, avgMood: 3.8, riskLevel: "low", trend: "up" },
  { name: "Business", students: 320, avgMood: 3.2, riskLevel: "medium", trend: "stable" },
  { name: "Sciences", students: 240, avgMood: 2.9, riskLevel: "high", trend: "down" },
  { name: "Medicine", students: 180, avgMood: 3.1, riskLevel: "medium", trend: "stable" }
];

const interventionData = [
  { type: "AI Chatbot", usage: 1240, effectiveness: 87, trend: "+12%" },
  { type: "Peer Mentoring", usage: 340, effectiveness: 92, trend: "+8%" },
  { type: "Crisis Support", usage: 45, effectiveness: 95, trend: "+15%" },
  { type: "Wellness Resources", usage: 890, effectiveness: 76, trend: "+5%" }
];

const riskDistribution = [
  { name: "Low Risk", value: 65, color: "#10B981", count: 1848 },
  { name: "Medium Risk", value: 28, color: "#F59E0B", count: 796 },
  { name: "High Risk", value: 7, color: "#EF4444", count: 199 }
];

export default function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState("6months");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const exportReport = () => {
    console.log("Exporting analytics report...");
    // In real app, this would call your backend API
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            Advanced Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Deep insights into campus mental health trends and intervention effectiveness
          </p>
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departmentData.map(dept => (
                <SelectItem key={dept.name} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={exportReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="interventions">Interventions</TabsTrigger>
          <TabsTrigger value="predictions">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                    <p className="text-2xl font-bold">2,847</p>
                    <p className="text-xs text-wellness flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +5.2% from last month
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Mood</p>
                    <p className="text-2xl font-bold">3.6/5</p>
                    <p className="text-xs text-wellness flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Improving trend
                    </p>
                  </div>
                  <Heart className="h-8 w-8 text-wellness" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Interventions</p>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-crisis flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Requires attention
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-crisis" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold">89%</p>
                    <p className="text-xs text-accent">
                      Intervention effectiveness
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Risk Level Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {riskDistribution.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Intervention Effectiveness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interventionData.map((item) => (
                    <div key={item.type} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.type}</span>
                        <span className="font-medium">{item.effectiveness}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${item.effectiveness}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{item.usage.toLocaleString()} students</span>
                        <span className="text-wellness">{item.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Campus Mental Health Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="mood" domain={[1, 5]} />
                    <YAxis yAxisId="events" orientation="right" />
                    <Tooltip />
                    <Area
                      yAxisId="mood"
                      type="monotone"
                      dataKey="avgMood"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.6}
                      name="Average Mood"
                    />
                    <Line
                      yAxisId="events"
                      type="monotone"
                      dataKey="crisisEvents"
                      stroke="#EF4444"
                      strokeWidth={3}
                      name="Crisis Events"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Department-wise Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentData.map((dept) => (
                  <div key={dept.name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{dept.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          dept.riskLevel === "high" ? "bg-crisis text-white" :
                          dept.riskLevel === "medium" ? "bg-warning text-white" :
                          "bg-wellness text-white"
                        }>
                          {dept.riskLevel} risk
                        </Badge>
                        <Badge variant="outline" className={
                          dept.trend === "up" ? "text-wellness border-wellness" :
                          dept.trend === "down" ? "text-crisis border-crisis" :
                          "text-muted-foreground"
                        }>
                          {dept.trend === "up" ? "↗" : dept.trend === "down" ? "↘" : "→"} {dept.trend}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Students: </span>
                        <span className="font-medium">{dept.students}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Mood: </span>
                        <span className="font-medium">{dept.avgMood}/5</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interventions" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Intervention Impact Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={interventionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="effectiveness" fill="#3B82F6" name="Effectiveness %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card className="shadow-soft border-accent/20 bg-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-accent" />
                AI-Powered Predictions & Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 bg-wellness/10 border border-wellness/20 rounded-lg">
                  <h4 className="font-semibold text-wellness mb-2">Positive Trend Prediction</h4>
                  <p className="text-sm">Engineering department showing 23% mood improvement likelihood in next month based on current intervention patterns.</p>
                </div>
                
                <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                  <h4 className="font-semibold text-warning mb-2">Attention Required</h4>
                  <p className="text-sm">Sciences department may need increased support during exam period (predicted 15% mood decline).</p>
                </div>
                
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">Resource Optimization</h4>
                  <p className="text-sm">AI chatbot effectiveness could increase by 12% with enhanced cultural personalization features.</p>
                </div>

                <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                  <h4 className="font-semibold text-accent mb-2">Campus Wellness Forecast</h4>
                  <p className="text-sm">Overall campus mood trending upward with projected 8% improvement over next quarter.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}