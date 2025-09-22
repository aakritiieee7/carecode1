import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { 
  Heart, 
  MessageCircle, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  Calendar,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Shield,
  Globe,
  BarChart3,
  Target
} from "lucide-react";
import { useState } from "react";
import { EcosystemOverview } from "@/components/EcosystemOverview";
import { PrivacySettings } from "@/components/PrivacySettings";
import { CulturalPersonalization } from "@/components/CulturalPersonalization";

export default function StudentHome() {
  const [todayMood, setTodayMood] = useState([4]);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  
  const userName = "Arjun";
  const currentDate = new Date().toLocaleDateString('en-IN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const moodLabels = ["Very Low", "Low", "Neutral", "Good", "Excellent"];
  const moodEmojis = ["😔", "😕", "😐", "😊", "😄"];

  const quickActions = [
    {
      title: "Talk to AI Assistant",
      description: "Get instant support and guidance",
      icon: <MessageCircle className="h-6 w-6" />,
      link: "/student/chatbot",
      color: "bg-primary/10 text-primary border-primary/20"
    },
    {
      title: "View Wellness Trends",
      description: "Check your progress and insights",
      icon: <TrendingUp className="h-6 w-6" />,
      link: "/student/wellness",
      color: "bg-wellness/10 text-wellness border-wellness/20"
    },
    {
      title: "Connect with Mentors",
      description: "Find peer support and guidance",
      icon: <Users className="h-6 w-6" />,
      link: "/student/mentorship",
      color: "bg-accent/10 text-accent border-accent/20"
    },
    {
      title: "Crisis Support",
      description: "Get immediate help when needed",
      icon: <AlertTriangle className="h-6 w-6" />,
      link: "/student/crisis",
      color: "bg-crisis/10 text-crisis border-crisis/20"
    }
  ];

  const upcomingEvents = [
    { title: "Yoga & Mindfulness Session", time: "Today, 3:00 PM", type: "workshop" },
    { title: "Peer Support Circle", time: "Tomorrow, 5:00 PM", type: "support" },
    { title: "Mental Health Awareness Week", time: "Friday, 10:00 AM", type: "event" }
  ];

  const handleMoodCheckin = () => {
    setHasCheckedIn(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Heart className="h-8 w-8 text-wellness" />
          Namaskar, {userName}!
        </h1>
        <p className="text-muted-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {currentDate}
        </p>
        <div className="mt-4">
          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">
            <Target className="h-3 w-3 mr-1" />
            Complete Mental Health Ecosystem • Privacy-First • Culturally Sensitive
          </Badge>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="ecosystem" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Ecosystem
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="cultural" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Cultural
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab (Original Content) */}
        <TabsContent value="dashboard">{/* Dashboard content will go here */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Mood Check-in */}
          <Card className="shadow-wellness animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-wellness">
                <Sparkles className="h-5 w-5" />
                Daily Mood Check-in
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!hasCheckedIn ? (
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    Take a moment to reflect on how you're feeling today. Apka mental health bohot important hai.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl mb-2">
                        {moodEmojis[todayMood[0] - 1]}
                      </div>
                      <p className="font-medium text-lg">
                        {moodLabels[todayMood[0] - 1]}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Slider
                        value={todayMood}
                        onValueChange={setTodayMood}
                        max={5}
                        min={1}
                        step={1}
                        className="w-full"
                        aria-label="Select your mood level"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Very Low</span>
                        <span>Excellent</span>
                      </div>
                    </div>

                    <Button 
                      onClick={handleMoodCheckin}
                      className="w-full bg-gradient-wellness text-white"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Complete Check-in
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="text-6xl">✨</div>
                  <div>
                    <h3 className="text-lg font-semibold text-wellness mb-2">
                      Thank you for checking in!
                    </h3>
                    <p className="text-muted-foreground">
                      Your mood today: {moodLabels[todayMood[0] - 1]}
                    </p>
                  </div>
                  <Link to="/student/wellness">
                    <Button variant="outline" className="mt-4">
                      View Wellness Trends
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Grid */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.link}>
                  <Card className={`cursor-pointer hover:shadow-soft transition-all duration-200 border ${action.color} hover:scale-105`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {action.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{action.title}</h3>
                          <p className="text-sm opacity-80">{action.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 opacity-60" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Today's Stats */}
          <Card className="shadow-soft animate-slide-up">
            <CardHeader>
              <CardTitle className="text-lg">Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Check-in Streak</span>
                <Badge variant="secondary" className="bg-wellness/10 text-wellness">
                  7 days
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg Mood Score</span>
                <Badge variant="outline">4.2/5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Mentors</span>
                <Badge variant="secondary">3</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="shadow-soft animate-slide-up">
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="border-l-4 border-l-primary pl-3 py-2">
                  <div className="text-sm font-medium">{event.title}</div>
                  <div className="text-xs text-muted-foreground">{event.time}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Crisis Access */}
          <Card className="border-crisis/20 bg-crisis-light animate-slide-up">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-crisis" />
              <h3 className="font-semibold text-crisis mb-2">Need Immediate Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Crisis support is available 24/7
              </p>
              <Link to="/student/crisis">
                <Button className="w-full bg-crisis hover:bg-crisis/90 text-white">
                  Get Help Now
                </Button>
              </Link>
            </CardContent>
          </Card>
          </div>
        </div>
        </TabsContent>

        {/* Ecosystem Overview Tab */}
        <TabsContent value="ecosystem">
          <EcosystemOverview />
        </TabsContent>

        {/* Privacy Settings Tab */}
        <TabsContent value="privacy">
          <PrivacySettings />
        </TabsContent>

        {/* Cultural Personalization Tab */}
        <TabsContent value="cultural">
          <CulturalPersonalization />
        </TabsContent>
      </Tabs>
    </div>
  );
}