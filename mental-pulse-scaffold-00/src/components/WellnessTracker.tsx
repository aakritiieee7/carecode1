import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Heart, TrendingUp, MapPin } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useMoodHistory, useCreateMoodEntry } from "@/hooks/useApi";
import { format } from "date-fns";

export function WellnessTracker() {
  const [currentMood, setCurrentMood] = useState([4]);
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState("");
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  
  const { data: moodData, isLoading } = useMoodHistory(7); // Last 7 days
  const createMoodEntry = useCreateMoodEntry();

  const moodLabels = ["Very Low", "Low", "Neutral", "Good", "Excellent"];
  const moodEmojis = ["😔", "😕", "😐", "😊", "😄"];

  const handleCheckIn = async () => {
    try {
      await createMoodEntry.mutateAsync({
        moodScore: currentMood[0],
        notes: notes || undefined,
        location: location || undefined
      });
      setHasCheckedIn(true);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };
  
  // Format chart data from API response
  const chartData = moodData?.dailyAverages?.map(item => ({
    day: format(new Date(item.date), 'EEE'), // Mon, Tue, etc.
    mood: Math.round(item.averageMood * 100) / 100
  })) || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Daily Check-in Card */}
      <Card className="shadow-wellness">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-wellness">
            <Calendar className="h-5 w-5" />
            Daily Wellness Check-In
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!hasCheckedIn ? (
            <>
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  "Take a moment to reflect on how you're feeling today. Your mental health matters."
                </p>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">
                    {moodEmojis[currentMood[0] - 1]}
                  </div>
                  <p className="font-medium text-lg">
                    {moodLabels[currentMood[0] - 1]}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>How are you feeling? (1-5)</Label>
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
                    <span>Excellent</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Input
                    id="notes"
                    placeholder="How was your day? Any thoughts to share?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location (optional)
                  </Label>
                  <Input
                    id="location"
                    placeholder="Where are you? (e.g., Library, Dorm, Gym)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                onClick={handleCheckIn}
                disabled={createMoodEntry.isPending}
                className="w-full bg-gradient-wellness text-white"
              >
                {createMoodEntry.isPending ? 'Recording...' : 'Complete Check-In'}
              </Button>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-6xl">✨</div>
              <div>
                <h3 className="text-lg font-semibold text-wellness">
                  Thank you for checking in!
                </h3>
                <p className="text-muted-foreground">
                  Your mood today: {moodLabels[currentMood[0] - 1]}
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setHasCheckedIn(false)}
                className="mt-4"
              >
                Check In Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mood Trends Chart */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-calm" />
            Weekly Mood Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-calm mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading your mood trends...</p>
              </div>
            </div>
          ) : chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[1, 5]} />
                  <Tooltip 
                    formatter={(value: number) => [value.toFixed(1), 'Mood']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="hsl(var(--calm))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--calm))", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">No mood data yet</p>
                <p className="text-sm text-muted-foreground">
                  Start tracking your daily mood to see trends and patterns
                </p>
              </div>
            </div>
          )}
          
          {moodData?.statistics && (
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-wellness">{moodData.statistics.totalEntries}</p>
                <p className="text-xs text-muted-foreground">Total Entries</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-calm">{moodData.statistics.averageMood.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Average Mood</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-mindful">{moodData.statistics.streak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          )}
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Track your daily mood to identify patterns and progress
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}