import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Award,
  ArrowUp,
  ArrowDown,
  Minus,
  Lightbulb,
  BarChart3,
  Loader2
} from "lucide-react";
import { moodApi, MoodEntry as APIMoodEntry } from "@/lib/api";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface MoodEntry {
  date: string;
  mood: number;
  notes?: string;
}

interface WeeklyStats {
  average: number;
  trend: "up" | "down" | "stable";
  streakDays: number;
}

export default function WellnessTracker() {
  const [currentMood, setCurrentMood] = useState([4]);
  const [moodNotes, setMoodNotes] = useState("");
  const [location, setLocation] = useState("");
  const queryClient = useQueryClient();
  
  // Query to fetch mood history
  const { data: historyData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['moodHistory', 30],
    queryFn: () => moodApi.getHistory(30),
    select: (response) => response.data,
  });
  
  const moodHistory = historyData?.history || [];
  const statistics = historyData?.statistics || { totalEntries: 0, averageMood: 0, streak: 0 };
  const dailyAverages = historyData?.dailyAverages || [];
  
  const weeklyStats: WeeklyStats = {
    average: statistics.averageMood || 0,
    trend: "stable",
    streakDays: statistics.streak || 0
  };

  const moodLabels = ["Very Low", "Low", "Neutral", "Good", "Excellent"];
  const moodEmojis = ["😔", "😕", "😐", "😊", "😄"];
  const moodColors = ["text-crisis", "text-orange-500", "text-yellow-500", "text-wellness", "text-emerald-500"];

  // Calculate trend from recent data
  useEffect(() => {
    if (dailyAverages.length >= 2) {
      const recent = dailyAverages.slice(-3).reduce((acc, curr) => acc + curr.averageMood, 0) / Math.min(3, dailyAverages.length);
      const older = dailyAverages.slice(0, -3).reduce((acc, curr) => acc + curr.averageMood, 0) / Math.max(1, dailyAverages.length - 3);
      
      if (recent > older + 0.2) {
        weeklyStats.trend = "up";
      } else if (recent < older - 0.2) {
        weeklyStats.trend = "down";
      } else {
        weeklyStats.trend = "stable";
      }
    }
  }, [dailyAverages]);
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <ArrowUp className="h-4 w-4 text-wellness" />;
      case "down": return <ArrowDown className="h-4 w-4 text-crisis" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  // Mutation for creating mood entry
  const createMoodMutation = useMutation({
    mutationFn: (data: { moodScore: number; notes?: string; location?: string }) => 
      moodApi.createEntry(data),
    onSuccess: () => {
      toast.success('Mood entry saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['moodHistory'] });
      setMoodNotes("");
      setLocation("");
    },
    onError: (error: any) => {
      console.error('Mood entry error:', error);
      toast.error(error.response?.data?.error || 'Failed to save mood entry');
    },
  });
  
  const handleLogMood = () => {
    createMoodMutation.mutate({
      moodScore: currentMood[0],
      notes: moodNotes.trim() || undefined,
      location: location.trim() || undefined,
    });
  };

  const insights = [
    {
      title: "Weekly Improvement",
      description: "Your mood has improved by 15% this week compared to last week.",
      type: "positive" as const
    },
    {
      title: "Consistency Pattern", 
      description: "You tend to feel better on weekends. Consider what makes weekends different.",
      type: "neutral" as const
    },
    {
      title: "Sleep Connection",
      description: "Days with lower mood often correlate with less than 7 hours of sleep.",
      type: "tip" as const
    }
  ];

  const goals = [
    { title: "Daily Check-ins", progress: 7, target: 7, completed: true },
    { title: "Average Mood 4+", progress: 3.6, target: 4, completed: false },
    { title: "Mindful Minutes", progress: 45, target: 60, completed: false }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-wellness" />
          Wellness Tracker
        </h1>
        <p className="text-muted-foreground">
          Monitor your mental health journey with insights and progress tracking
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-wellness mb-1">
              {isLoadingHistory ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : weeklyStats.streakDays}
            </div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-2xl font-bold text-primary">
                {isLoadingHistory ? <Loader2 className="h-6 w-6 animate-spin" /> : weeklyStats.average.toFixed(1)}
              </span>
              {!isLoadingHistory && getTrendIcon(weeklyStats.trend)}
            </div>
            <div className="text-sm text-muted-foreground">Weekly Average</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {isLoadingHistory ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : statistics.totalEntries}
            </div>
            <div className="text-sm text-muted-foreground">Total Entries</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-calm mb-1">
              {Math.round((goals.filter(g => g.completed).length / goals.length) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Goals Met</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current">Current Mood</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        {/* Current Mood Tab */}
        <TabsContent value="current" className="space-y-6">
          <Card className="shadow-wellness">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-wellness">
                <Calendar className="h-5 w-5" />
                How are you feeling right now?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">
                  {moodEmojis[currentMood[0] - 1]}
                </div>
                <h3 className={`text-xl font-semibold ${moodColors[currentMood[0] - 1]}`}>
                  {moodLabels[currentMood[0] - 1]}
                </h3>
              </div>

              <div className="space-y-4">
                <Slider
                  value={currentMood}
                  onValueChange={setCurrentMood}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Very Low</span>
                  <span>Low</span>
                  <span>Neutral</span>
                  <span>Good</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div className="space-y-4">
                <Textarea
                  placeholder="How are you feeling? Any specific thoughts or events today? (optional)"
                  value={moodNotes}
                  onChange={(e) => setMoodNotes(e.target.value)}
                  className="min-h-[80px]"
                />
                
                <Input
                  placeholder="Where are you right now? (optional - helps with location insights)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                
                <Button 
                  onClick={handleLogMood}
                  disabled={createMoodMutation.isPending}
                  className="w-full bg-gradient-wellness text-white"
                >
                  {createMoodMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Log Current Mood'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Mood History (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading mood history...</span>
                </div>
              ) : moodHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No mood entries yet. Start tracking your mood above!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {moodHistory.map((entry, index) => (
                    <div key={entry.id || index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{moodEmojis[entry.moodScore - 1]}</div>
                        <div>
                          <div className="font-medium">
                            {new Date(entry.timestamp).toLocaleDateString('en-US', { 
                              weekday: 'long',
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          {entry.notes && (
                            <div className="text-sm text-muted-foreground mt-1">{entry.notes}</div>
                          )}
                          {entry.location && (
                            <div className="text-xs text-muted-foreground opacity-75">📍 {entry.location}</div>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className={moodColors[entry.moodScore - 1]}>
                        {moodLabels[entry.moodScore - 1]}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insights.map((insight, index) => (
              <Card key={index} className="shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Lightbulb className={`h-5 w-5 mt-0.5 ${
                      insight.type === 'positive' ? 'text-wellness' :
                      insight.type === 'tip' ? 'text-accent' : 'text-primary'
                    }`} />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                Weekly Wellness Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {goal.completed ? (
                        <Award className="h-4 w-4 text-wellness" />
                      ) : (
                        <Target className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="font-medium">{goal.title}</span>
                    </div>
                    <Badge variant={goal.completed ? "default" : "outline"}>
                      {goal.progress}/{goal.target}
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        goal.completed ? 'bg-wellness' : 'bg-primary'
                      }`}
                      style={{ width: `${Math.min((goal.progress / goal.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}