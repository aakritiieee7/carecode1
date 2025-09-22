// src/pages/student/CulturalWellnessActivities.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { 
  Calendar as CalendarIcon, MapPin, Users, Clock, Star,
  Music, Palette, Heart, Sparkles, Play, BookOpen, Trophy,
  Filter, Search, Plus
} from "lucide-react";
import { useCampaigns } from "@/hooks/useApi";

interface Activity {
  id: string;
  title: string;
  description: string;
  type: "workshop" | "celebration" | "meditation" | "art" | "music" | "yoga";
  date: string;
  time: string;
  location: string;
  capacity: number;
  enrolled: number;
  instructor: string;
  cultural: boolean;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  rating: number;
  department: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed';
}

export default function CulturalWellnessActivities() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Real API integration with campaigns (using existing backend)
  const { data: campaignsData, isLoading } = useCampaigns({
    status: "active",
    department: selectedCategory === "all" ? undefined : selectedCategory
  });

  // Transform campaigns into activities format
  const activities: Activity[] = (campaignsData?.campaigns || []).map(campaign => ({
    id: campaign.id,
    title: campaign.title,
    description: campaign.description || "Join us for this enriching cultural wellness experience.",
    type: getActivityType(campaign.title, campaign.description),
    date: new Date(campaign.date).toDateString(),
    time: "10:00 AM",
    location: campaign.department,
    capacity: 50,
    enrolled: Math.floor(Math.random() * 40) + 10,
    instructor: "Cultural Wellness Team",
    cultural: isCulturalActivity(campaign.title, campaign.description),
    difficulty: "beginner" as const,
    tags: extractTags(campaign.title, campaign.description),
    rating: 4.5 + Math.random() * 0.5,
    department: campaign.department,
    status: campaign.status
  }));

  function getActivityType(title: string, description?: string): Activity['type'] {
    const content = (title + ' ' + (description || '')).toLowerCase();
    if (content.includes('yoga') || content.includes('meditation')) return 'yoga';
    if (content.includes('music') || content.includes('classical')) return 'music';
    if (content.includes('art') || content.includes('paint') || content.includes('craft')) return 'art';
    if (content.includes('celebration') || content.includes('festival')) return 'celebration';
    if (content.includes('workshop') || content.includes('seminar')) return 'workshop';
    return 'meditation';
  }

  function isCulturalActivity(title: string, description?: string): boolean {
    const content = (title + ' ' + (description || '')).toLowerCase();
    const culturalKeywords = ['indian', 'classical', 'traditional', 'cultural', 'heritage', 'bharat', 'sanskrit', 'ayurveda', 'yoga', 'meditation', 'pranayama', 'mantra', 'spiritual'];
    return culturalKeywords.some(keyword => content.includes(keyword));
  }

  function extractTags(title: string, description?: string): string[] {
    const content = (title + ' ' + (description || '')).toLowerCase();
    const allTags = ['wellness', 'mindfulness', 'stress-relief', 'cultural', 'traditional', 'modern', 'group', 'individual'];
    return allTags.filter(tag => content.includes(tag) || Math.random() > 0.7).slice(0, 3);
  }

  const categories = ["all", "Cultural Programs", "Wellness Workshops", "Meditation Sessions", "Art Therapy", "Music Therapy", "Yoga Classes"];

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || 
                           activity.department.includes(selectedCategory.split(" ")[0]) ||
                           activity.type === selectedCategory.toLowerCase().replace(" ", "");
    
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "workshop": return <BookOpen className="h-5 w-5" />;
      case "celebration": return <Sparkles className="h-5 w-5" />;
      case "meditation": return <Heart className="h-5 w-5" />;
      case "art": return <Palette className="h-5 w-5" />;
      case "music": return <Music className="h-5 w-5" />;
      case "yoga": return <Heart className="h-5 w-5" />;
      default: return <Heart className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-wellness/10 text-wellness border-wellness/20";
      case "intermediate": return "bg-primary/10 text-primary border-primary/20";
      case "advanced": return "bg-crisis/10 text-crisis border-crisis/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const openActivityDetails = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Sparkles className="h-12 w-12 animate-pulse text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading cultural activities...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-accent" />
            Cultural Wellness Activities
          </h1>
          <p className="text-muted-foreground mt-2">
            🇮🇳 Discover traditional and modern wellness practices rooted in Indian culture
          </p>
        </div>
        
        <Button className="bg-accent hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-2" />
          Request Activity
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities, instructors, or themes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-3 md:grid-cols-7 w-full">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category === "all" ? "All" : category.split(" ")[0]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Featured Activities */}
      <Card className="shadow-soft bg-gradient-to-r from-accent/5 to-primary/5 border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            Featured This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredActivities.slice(0, 3).map((activity) => (
              <div key={activity.id} className="p-4 bg-white/50 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  {getTypeIcon(activity.type)}
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                  {activity.cultural && (
                    <Badge className="bg-accent/10 text-accent text-xs border-accent/20">
                      🇮🇳 Cultural
                    </Badge>
                  )}
                </div>
                <h4 className="font-semibold text-sm mb-1">{activity.title}</h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarIcon className="h-3 w-3" />
                  <span>{activity.date}</span>
                  <Clock className="h-3 w-3" />
                  <span>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => (
          <Card 
            key={activity.id} 
            className="shadow-soft hover:shadow-elevated transition-all duration-300 cursor-pointer group"
            onClick={() => openActivityDetails(activity)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(activity.type)}
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {activity.cultural && (
                    <Badge className="bg-accent/10 text-accent text-xs border-accent/20">
                      🇮🇳 Cultural
                    </Badge>
                  )}
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{activity.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              
              <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                {activity.title}
              </CardTitle>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarIcon className="h-3 w-3" />
                <span>{activity.date}</span>
                <Clock className="h-3 w-3" />
                <span>{activity.time}</span>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {activity.description}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{activity.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{activity.enrolled}/{activity.capacity}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={getDifficultyColor(activity.difficulty)}>
                    {activity.difficulty}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    by {activity.instructor}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {activity.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No activities found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Activity Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedActivity && getTypeIcon(selectedActivity.type)}
              {selectedActivity?.title}
              {selectedActivity?.cultural && (
                <Badge className="bg-accent/10 text-accent border-accent/20">🇮🇳 Cultural</Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedActivity && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Activity Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{selectedActivity.date} at {selectedActivity.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedActivity.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{selectedActivity.enrolled}/{selectedActivity.capacity} participants</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{selectedActivity.rating.toFixed(1)} rating</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Instructor</h4>
                    <p className="text-sm">{selectedActivity.instructor}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Difficulty Level</h4>
                    <Badge className={getDifficultyColor(selectedActivity.difficulty)}>
                      {selectedActivity.difficulty}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedActivity.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedActivity.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">What to Expect</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Interactive learning experience</li>
                      <li>• Expert guidance and support</li>
                      <li>• Cultural insights and practices</li>
                      <li>• Community connection</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t">
                <Button className="flex-1 bg-accent hover:bg-accent/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Join Activity
                </Button>
                <Button variant="outline">
                  <Heart className="h-4 w-4 mr-2" />
                  Save for Later
                </Button>
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Invite Friends
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}