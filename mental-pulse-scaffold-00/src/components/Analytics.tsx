import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Calendar, Activity } from "lucide-react";

const weeklyEngagementData = [
  { day: "Mon", checkIns: 45, chatSessions: 23, crisisAlerts: 2 },
  { day: "Tue", checkIns: 38, chatSessions: 31, crisisAlerts: 1 },
  { day: "Wed", checkIns: 52, chatSessions: 28, crisisAlerts: 3 },
  { day: "Thu", checkIns: 41, chatSessions: 35, crisisAlerts: 1 },
  { day: "Fri", checkIns: 33, chatSessions: 19, crisisAlerts: 4 },
  { day: "Sat", checkIns: 28, chatSessions: 15, crisisAlerts: 1 },
  { day: "Sun", checkIns: 31, chatSessions: 22, crisisAlerts: 2 },
];

const monthlyTrendsData = [
  { month: "Jan", avgMood: 3.2, usage: 234 },
  { month: "Feb", avgMood: 3.1, usage: 267 },
  { month: "Mar", avgMood: 2.8, usage: 298 },
  { month: "Apr", avgMood: 3.4, usage: 312 },
  { month: "May", avgMood: 3.6, usage: 289 },
  { month: "Jun", avgMood: 3.8, usage: 201 },
];

export function Analytics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Engagement Chart */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Weekly Platform Engagement
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Student interactions across different features
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyEngagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="checkIns" fill="hsl(var(--primary))" name="Daily Check-ins" />
                <Bar dataKey="chatSessions" fill="hsl(var(--wellness))" name="Chat Sessions" />
                <Bar dataKey="crisisAlerts" fill="hsl(var(--crisis))" name="Crisis Alerts" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-semibold text-primary">268</div>
              <div className="text-xs text-muted-foreground">Weekly Check-ins</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-wellness">173</div>
              <div className="text-xs text-muted-foreground">Chat Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-crisis">14</div>
              <div className="text-xs text-muted-foreground">Crisis Interventions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends Chart */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-calm" />
            Monthly Wellness Trends
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Average mood scores and platform usage over time
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" domain={[1, 5]} />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="avgMood" 
                  stroke="hsl(var(--calm))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--calm))", strokeWidth: 2, r: 6 }}
                  name="Avg Mood Score"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="usage" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 4 }}
                  name="Platform Usage"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Key Insights */}
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-semibold text-sm mb-3">Key Insights</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-wellness rounded-full"></div>
                <span className="text-muted-foreground">
                  Mood scores improved 19% since March
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">
                  Platform engagement up 8% this month
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-crisis rounded-full"></div>
                <span className="text-muted-foreground">
                  Crisis interventions decreased 23%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics Cards */}
      <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">1,247</div>
            <div className="text-sm text-muted-foreground">Active Students</div>
            <div className="text-xs text-wellness">+5.2% this week</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-wellness" />
            <div className="text-2xl font-bold">89%</div>
            <div className="text-sm text-muted-foreground">Daily Engagement</div>
            <div className="text-xs text-wellness">Above average</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-calm" />
            <div className="text-2xl font-bold">3.4</div>
            <div className="text-sm text-muted-foreground">Avg Mood Score</div>
            <div className="text-xs text-wellness">+0.3 vs last month</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 mx-auto mb-2 text-accent" />
            <div className="text-2xl font-bold">94%</div>
            <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            <div className="text-xs text-wellness">Excellent rating</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}