import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Brain, 
  Headphones, 
  Heart, 
  BookOpen, 
  Play, 
  Download,
  Clock,
  Star
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  duration?: string;
  rating?: number;
  content: string;
}

export function ResourceHub() {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resources: Resource[] = [
    {
      id: "yoga",
      title: "Mindful Yoga",
      description: "Gentle yoga sequences to reduce stress and anxiety",
      icon: <Brain className="h-6 w-6" />,
      category: "Exercise",
      duration: "15 mins",
      rating: 4.7,
      content: `
        **Mindful Yoga Session**
        
        This 15-minute gentle yoga sequence is designed to help you:
        - Release physical tension
        - Calm your mind
        - Improve focus and clarity
        - Reduce anxiety and stress
        
        **What you'll need:**
        - A quiet space
        - Yoga mat (optional)
        - Comfortable clothing
        
        **Poses included:**
        1. Child's Pose (2 minutes)
        2. Cat-Cow Stretches (3 minutes)
        3. Gentle Twists (4 minutes)
        4. Forward Folds (3 minutes)
        5. Final Relaxation (3 minutes)
        
        Remember to breathe deeply and listen to your body throughout the practice.
      `
    },
    {
      id: "relaxation",
      title: "Relaxation Audio",
      description: "Guided meditation and calming soundscapes",
      icon: <Headphones className="h-6 w-6" />,
      category: "Audio",
      duration: "10 mins",
      rating: 4.9,
      content: `
        **Guided Relaxation Audio Collection**
        
        Choose from our library of calming audio experiences:
        
        **Available Sessions:**
        - Deep Breathing Exercise (5 mins)
        - Progressive Muscle Relaxation (15 mins)
        - Nature Sounds & Meditation (20 mins)
        - Sleep Stories (30 mins)
        
        **Benefits:**
        ✓ Reduce stress and anxiety
        ✓ Improve sleep quality
        ✓ Enhance focus and concentration
        ✓ Lower blood pressure
        ✓ Boost mood and emotional well-being
        
        **How to use:**
        1. Find a comfortable, quiet space
        2. Use headphones for best experience
        3. Close your eyes and follow the guidance
        4. Practice regularly for best results
      `
    },
    {
      id: "coping",
      title: "Coping Strategies",
      description: "Evidence-based techniques for managing difficult emotions",
      icon: <Heart className="h-6 w-6" />,
      category: "Techniques",
      rating: 4.8,
      content: `
        **Coping Strategies Toolkit**
        
        **Immediate Stress Relief (0-5 minutes):**
        - 4-7-8 Breathing Technique
        - Grounding: 5-4-3-2-1 Method
        - Cold water on face/wrists
        - Progressive muscle relaxation
        
        **Daily Management (5-20 minutes):**
        - Journaling prompts
        - Mindfulness meditation
        - Physical exercise
        - Creative expression
        
        **Long-term Wellness:**
        - Sleep hygiene practices
        - Nutrition for mental health
        - Social connection building
        - Professional support resources
        
        **Emergency Resources:**
        - Crisis hotline numbers
        - Campus counseling services
        - Trusted friend/family contacts
        - Self-care safety plan
        
        Remember: It's okay to ask for help. You're not alone in this journey.
      `
    },
    {
      id: "articles",
      title: "Wellness Articles",
      description: "Research-backed articles on mental health topics",
      icon: <BookOpen className="h-6 w-6" />,
      category: "Education",
      rating: 4.5,
      content: `
        **Featured Wellness Articles**
        
        **Understanding Anxiety in College Students**
        Learn about common anxiety symptoms, triggers, and effective management strategies specifically for the college environment.
        
        **Building Resilience: A Student's Guide**
        Discover how to develop emotional resilience and bounce back from academic and personal challenges.
        
        **The Science of Stress: What Happens in Your Body**
        Explore the physiological effects of stress and why understanding them can help you manage better.
        
        **Healthy Sleep Habits for Better Mental Health**
        Evidence-based tips for improving sleep quality and its impact on emotional well-being.
        
        **Social Connection and Mental Health**
        The importance of relationships and community in maintaining psychological wellness.
        
        **Mindfulness in Daily Life**
        Simple ways to incorporate mindfulness practices into your busy student schedule.
        
        All articles are reviewed by licensed mental health professionals and based on current research.
      `
    },
  ];

  const openResource = (resource: Resource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <BookOpen className="h-5 w-5" />
            Wellness Resource Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource) => (
              <Card 
                key={resource.id} 
                className="cursor-pointer hover:shadow-wellness transition-shadow border-l-4 border-l-primary/20 hover:border-l-primary"
                onClick={() => openResource(resource)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {resource.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{resource.title}</h3>
                        {resource.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-muted-foreground">
                              {resource.rating}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {resource.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {resource.category}
                        </span>
                        {resource.duration && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {resource.duration}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedResource?.icon}
              {selectedResource?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedResource && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {selectedResource.category}
                </span>
                {selectedResource.duration && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {selectedResource.duration}
                  </div>
                )}
                {selectedResource.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{selectedResource.rating}</span>
                  </div>
                )}
              </div>
              
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-line text-sm text-muted-foreground">
                  {selectedResource.content}
                </div>
              </div>
              
              <div className="flex gap-2 pt-4 border-t">
                {selectedResource.category === "Audio" && (
                  <Button className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Play Audio
                  </Button>
                )}
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Save Resource
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}