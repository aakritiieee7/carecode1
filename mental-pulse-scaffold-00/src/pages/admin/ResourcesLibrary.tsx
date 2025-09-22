// src/pages/student/ResourcesLibrary.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  BookOpen, Search, Star, Clock, Download, Play, Bookmark,
  Heart, Brain, Users, Music, Video, FileText, Headphones, Filter
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "article" | "video" | "audio" | "guide" | "exercise";
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  rating: number;
  language: string;
  cultural: boolean;
  bookmarked: boolean;
  content: string;
  author?: string;
  tags: string[];
}

const resources: Resource[] = [
  {
    id: "1",
    title: "प्राणायाम for Mental Peace",
    description: "Traditional breathing techniques from ancient Indian practices for anxiety relief and mental clarity",
    type: "video",
    category: "Mindfulness",
    difficulty: "beginner",
    duration: "12 mins",
    rating: 4.8,
    language: "Hindi/English",
    cultural: true,
    bookmarked: false,
    content: "Learn the ancient art of pranayama breathing exercises specifically designed for mental wellness. This video covers basic techniques like Anulom Vilom, Bhramari, and Ujjayi breathing that have been practiced for thousands of years in India.",
    author: "Dr. Priya Sharma, Yoga Therapist",
    tags: ["breathing", "anxiety", "yoga", "traditional"]
  },
  {
    id: "2",
    title: "Understanding Depression in Indian Students",
    description: "Culturally sensitive guide to recognizing and managing depression symptoms in academic settings",
    type: "article",
    category: "Mental Health Education",
    difficulty: "beginner",
    duration: "8 mins read",
    rating: 4.6,
    language: "English",
    cultural: true,
    bookmarked: true,
    content: "A comprehensive guide that addresses depression within the context of Indian cultural values, family expectations, and academic pressures. Includes practical strategies for seeking help while maintaining cultural sensitivity.",
    author: "Dr. Rajesh Kumar, Clinical Psychologist",
    tags: ["depression", "students", "culture", "academics"]
  },
  {
    id: "3",
    title: "Bhagavad Gita Verses for Inner Strength",
    description: "Inspirational verses and their practical application for mental wellness and resilience",
    type: "audio",
    category: "Spiritual Wellness",
    difficulty: "beginner",
    duration: "15 mins",
    rating: 4.9,
    language: "Sanskrit/Hindi",
    cultural: true,
    bookmarked: false,
    content: "Selected verses from the Bhagavad Gita with commentary on how ancient wisdom can provide strength during difficult times. Includes practical meditation exercises based on these teachings.",
    author: "Swami Ananda Bharti",
    tags: ["spirituality", "strength", "meditation", "ancient wisdom"]
  },
  {
    id: "4",
    title: "Academic Stress Management Toolkit",
    description: "Evidence-based strategies for managing academic pressure and exam anxiety effectively",
    type: "guide",
    category: "Stress Management",
    difficulty: "intermediate",
    duration: "20 mins",
    rating: 4.7,
    language: "English",
    cultural: false,
    bookmarked: true,
    content: "A comprehensive toolkit featuring research-backed techniques for managing academic stress, including time management, study strategies, and anxiety-reduction methods specifically designed for students.",
    author: "Prof. Sarah Mitchell, Educational Psychology",
    tags: ["stress", "academics", "exams", "study skills"]
  },
  {
    id: "5",
    title: "Progressive Muscle Relaxation Guide",
    description: "Step-by-step guided exercise to release physical tension and mental stress",
    type: "exercise",
    category: "Relaxation",
    difficulty: "beginner",
    duration: "10 mins",
    rating: 4.5,
    language: "English",
    cultural: false,
    bookmarked: false,
    content: "A detailed guide to progressive muscle relaxation techniques that help release physical tension and reduce anxiety. Includes audio guidance and tips for daily practice.",
    author: "Dr. Lisa Chen, Stress Management Specialist",
    tags: ["relaxation", "tension", "exercise", "mindfulness"]
  },
  {
    id: "6",
    title: "Indian Classical Music for Healing",
    description: "Therapeutic ragas and their effects on mental well-being according to ancient traditions",
    type: "audio",
    category: "Cultural Therapy",
    difficulty: "beginner",
    duration: "25 mins",
    rating: 4.8,
    language: "Instrumental",
    cultural: true,
    bookmarked: true,
    content: "Explore how different Indian classical ragas can influence mood and mental state. This collection includes healing ragas like Yaman, Bhairav, and Malkauns with explanations of their therapeutic properties.",
    author: "Pandit Ravi Shankar Institute",
    tags: ["music", "healing", "ragas", "therapy"]
  }
];

export default function ResourcesLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [resourceList, setResourceList] = useState(resources);

  const categories = ["all", "Mindfulness", "Mental Health Education", "Spiritual Wellness", "Stress Management", "Relaxation", "Cultural Therapy"];

  const filteredResources = resourceList.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    const matchesBookmark = !bookmarkedOnly || resource.bookmarked;
    
    return matchesSearch && matchesCategory && matchesBookmark;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article": return <FileText className="h-5 w-5" />;
      case "video": return <Video className="h-5 w-5" />;
      case "audio": return <Headphones className="h-5 w-5" />;
      case "guide": return <BookOpen className="h-5 w-5" />;
      case "exercise": return <Heart className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
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

  const toggleBookmark = (resourceId: string) => {
    setResourceList(prev => prev.map(resource => 
      resource.id === resourceId 
        ? { ...resource, bookmarked: !resource.bookmarked }
        : resource
    ));
  };

  const openResource = (resource: Resource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            Mental Health Resources Library
          </h1>
          <p className="text-muted-foreground mt-2">
            Curated collection of culturally-sensitive mental health resources and wellness tools
          </p>
        </div>
        
        <Button 
          variant={bookmarkedOnly ? "default" : "outline"}
          onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
        >
          <Bookmark className="h-4 w-4 mr-2" />
          {bookmarkedOnly ? "All Resources" : "Bookmarked Only"}
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources, tags, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-4 md:grid-cols-7 w-full">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category === "all" ? "All" : category.split(" ")[0]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card 
            key={resource.id} 
            className="shadow-soft hover:shadow-elevated transition-all duration-300 cursor-pointer group"
            onClick={() => openResource(resource)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(resource.type)}
                  <Badge variant="outline" className="text-xs">
                    {resource.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {resource.cultural && (
                    <Badge className="bg-accent/10 text-accent text-xs border-accent/20">
                      🇮🇳 Cultural
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`p-1 ${resource.bookmarked ? "text-primary" : "text-muted-foreground"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(resource.id);
                    }}
                  >
                    <Bookmark className={`h-4 w-4 ${resource.bookmarked ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </div>
              
              <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                {resource.title}
              </CardTitle>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{resource.duration}</span>
                <span>•</span>
                <span>{resource.language}</span>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {resource.description}
              </p>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{resource.rating}</span>
                  </div>
                  <Badge className={getDifficultyColor(resource.difficulty)}>
                    {resource.difficulty}
                  </Badge>
                </div>
              </div>

              {resource.author && (
                <p className="text-xs text-muted-foreground mb-3">by {resource.author}</p>
              )}

              <div className="flex flex-wrap gap-1">
                {resource.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {resource.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{resource.tags.length - 3}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No resources found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setBookmarkedOnly(false);
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Resource Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedResource && getTypeIcon(selectedResource.type)}
              {selectedResource?.title}
              {selectedResource?.cultural && (
                <Badge className="bg-accent/10 text-accent border-accent/20">🇮🇳 Cultural</Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedResource && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 flex-wrap">
                <Badge variant="outline">{selectedResource.type}</Badge>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{selectedResource.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{selectedResource.rating}</span>
                </div>
                <Badge className={getDifficultyColor(selectedResource.difficulty)}>
                  {selectedResource.difficulty}
                </Badge>
                <span className="text-sm text-muted-foreground">{selectedResource.language}</span>
              </div>
              
              {selectedResource.author && (
                <p className="text-sm text-muted-foreground">
                  <strong>Author:</strong> {selectedResource.author}
                </p>
              )}

              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground mb-4">{selectedResource.description}</p>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="whitespace-pre-line">{selectedResource.content}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <strong className="text-sm">Tags:</strong>
                {selectedResource.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-3 pt-4 border-t">
                {selectedResource.type === "video" && (
                  <Button className="flex-1">
                    <Play className="h-4 w-4 mr-2" />
                    Watch Video
                  </Button>
                )}
                {selectedResource.type === "audio" && (
                  <Button className="flex-1">
                    <Play className="h-4 w-4 mr-2" />
                    Play Audio
                  </Button>
                )}
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => toggleBookmark(selectedResource.id)}
                >
                  <Bookmark className={`h-4 w-4 mr-2 ${selectedResource.bookmarked ? 'fill-current' : ''}`} />
                  {selectedResource.bookmarked ? 'Bookmarked' : 'Bookmark'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}