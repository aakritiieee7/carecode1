import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Star, MessageCircle, CheckCircle } from "lucide-react";

export function PeerMentor() {
  const [hasRequested, setHasRequested] = useState(false);

  const mockMentor = {
    name: "Alex Chen",
    department: "Psychology",
    matchPercentage: 87,
    specialties: ["Anxiety", "Academic Stress", "Social Support"],
    rating: 4.8,
    bio: "Senior psychology student with experience in peer counseling and mindfulness practices.",
  };

  const handleRequestConnection = () => {
    setHasRequested(true);
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent">
          <Users className="h-5 w-5" />
          Peer Mentor Match
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasRequested ? (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                  {mockMentor.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{mockMentor.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {mockMentor.matchPercentage}% match
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {mockMentor.department} • Rating: {mockMentor.rating}
                  <Star className="inline h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                </p>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {mockMentor.bio}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {mockMentor.specialties.map((specialty) => (
                    <Badge key={specialty} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <Button 
              onClick={handleRequestConnection}
              className="w-full bg-gradient-primary text-white"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Request Connection
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-4xl">🤝</div>
            <div>
              <h3 className="text-lg font-semibold text-accent flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Connection Requested!
              </h3>
              <p className="text-muted-foreground mt-2">
                Your request has been sent to {mockMentor.name}. 
                You'll receive a notification when they respond.
              </p>
            </div>
            
            <div className="bg-accent/10 p-3 rounded-lg">
              <p className="text-sm text-accent font-medium">
                Expected response time: 24-48 hours
              </p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setHasRequested(false)}
              className="mt-4"
            >
              View Other Mentors
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}