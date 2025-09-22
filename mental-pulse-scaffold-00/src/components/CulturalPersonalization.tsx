import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, 
  Music, 
  Heart, 
  Flower,
  Languages,
  Calendar,
  Users,
  BookOpen,
  Sparkles
} from "lucide-react";

export function CulturalPersonalization() {
  const [selectedLanguage, setSelectedLanguage] = useState("hindi-english");
  const [yogaReminders, setYogaReminders] = useState(true);
  const [culturalContent, setCulturalContent] = useState(true);
  const [festivalsReminders, setFestivalsReminders] = useState(true);

  const languages = [
    { id: "hindi-english", name: "Hindi + English", flag: "🇮🇳", speakers: "Most Common" },
    { id: "tamil", name: "Tamil", flag: "🇮🇳", speakers: "65M speakers" },
    { id: "bengali", name: "Bengali", flag: "🇮🇳", speakers: "97M speakers" },
    { id: "telugu", name: "Telugu", flag: "🇮🇳", speakers: "75M speakers" },
    { id: "marathi", name: "Marathi", flag: "🇮🇳", speakers: "72M speakers" },
    { id: "gujarati", name: "Gujarati", flag: "🇮🇳", speakers: "46M speakers" },
  ];

  const culturalPractices = [
    { 
      id: "yoga",
      name: "Yoga & Pranayama",
      icon: <Flower className="h-5 w-5" />,
      description: "Traditional breathing exercises and asanas for mental clarity",
      enabled: true
    },
    { 
      id: "meditation",
      name: "Dhyana Meditation",
      icon: <Sparkles className="h-5 w-5" />,
      description: "Guided meditation sessions based on ancient Indian practices",
      enabled: true
    },
    { 
      id: "music",
      name: "Raaga Therapy",
      icon: <Music className="h-5 w-5" />,
      description: "Classical Indian music therapy for emotional healing",
      enabled: false
    },
    { 
      id: "scriptures",
      name: "Motivational Verses",
      icon: <BookOpen className="h-5 w-5" />,
      description: "Daily inspiration from Bhagavad Gita, Upanishads, and other texts",
      enabled: true
    }
  ];

  const festivals = [
    { name: "Diwali", date: "Nov 12", significance: "Light over darkness - mental strength" },
    { name: "Holi", date: "Mar 8", significance: "Joy and new beginnings" },
    { name: "Navratri", date: "Oct 15", significance: "Inner strength and devotion" },
    { name: "Dussehra", date: "Oct 24", significance: "Victory over internal demons" }
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <Globe className="h-5 w-5" />
            Cultural Personalization
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Customize your mental health support with familiar cultural practices and local languages
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="language" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="language">Language</TabsTrigger>
              <TabsTrigger value="practices">Practices</TabsTrigger>
              <TabsTrigger value="calendar">Cultural Calendar</TabsTrigger>
            </TabsList>

            {/* Language Selection */}
            <TabsContent value="language" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Languages className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Select Your Preferred Language</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {languages.map((lang) => (
                    <Button
                      key={lang.id}
                      variant={selectedLanguage === lang.id ? "default" : "outline"}
                      className="justify-start h-auto p-3"
                      onClick={() => setSelectedLanguage(lang.id)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{lang.flag}</span>
                        <div className="text-left">
                          <div className="font-medium">{lang.name}</div>
                          <div className="text-xs opacity-70">{lang.speakers}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>

                <div className="bg-primary/10 p-3 rounded-lg mt-4">
                  <div className="text-sm text-primary font-medium mb-1">
                    आपकी भाषा में मानसिक स्वास्थ्य सहायता
                  </div>
                  <div className="text-xs text-primary/80">
                    Mental health support in your native language for better understanding and comfort
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Cultural Practices */}
            <TabsContent value="practices" className="space-y-4">
              <div className="space-y-4">
                {culturalPractices.map((practice) => (
                  <div key={practice.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-accent">{practice.icon}</div>
                      <div>
                        <div className="font-medium text-sm">{practice.name}</div>
                        <div className="text-xs text-muted-foreground">{practice.description}</div>
                      </div>
                    </div>
                    <Switch defaultChecked={practice.enabled} />
                  </div>
                ))}

                <div className="bg-wellness/10 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4 text-wellness" />
                    <span className="text-sm font-medium text-wellness">Traditional Healing Integration</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Our AI combines modern psychology with time-tested Indian wellness practices. 
                    These methods have helped millions find peace and mental clarity for centuries.
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Cultural Calendar */}
            <TabsContent value="calendar" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Festival-Based Wellness</span>
                  </div>
                  <Switch 
                    checked={festivalsReminders} 
                    onCheckedChange={setFestivalsReminders}
                  />
                </div>

                <div className="space-y-3">
                  {festivals.map((festival, index) => (
                    <div key={index} className="border-l-4 border-l-accent pl-3 py-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{festival.name}</div>
                          <div className="text-xs text-muted-foreground">{festival.significance}</div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {festival.date}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-accent/10 p-3 rounded-lg">
                  <div className="text-sm text-accent font-medium mb-1">
                    त्योहारों के साथ मानसिक स्वास्थ्य
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Receive wellness tips and meditation guidance aligned with Indian festivals 
                    and their spiritual significance for mental health.
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button className="w-full mt-6 bg-gradient-primary text-white">
            <Sparkles className="mr-2 h-4 w-4" />
            Save Cultural Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}