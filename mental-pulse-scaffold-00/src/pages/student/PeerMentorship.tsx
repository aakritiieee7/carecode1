import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Star, 
  MessageCircle, 
  Calendar,
  CheckCircle,
  Clock,
  Heart,
  Search,
  Filter,
  Loader2,
  UserPlus,
  Send
} from "lucide-react";
import { mentorshipApi, Mentor as APIMentor, Connection } from "@/lib/api";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

interface Mentor {
  id: string;
  name: string;
  department: string;
  year: string;
  specialties: string[];
  rating: number;
  totalSessions: number;
  matchPercentage: number;
  bio: string;
  isAvailable: boolean;
}

interface Session {
  id: string;
  mentorName: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "pending";
  type: string;
}

export default function PeerMentorship() {
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query to fetch available mentors
  const { data: mentorsData, isLoading: isLoadingMentors } = useQuery({
    queryKey: ['mentors', { department: selectedDepartment, search: searchQuery }],
    queryFn: () => mentorshipApi.getMentors({ 
      department: selectedDepartment || undefined,
      page: 1,
      limit: 20 
    }),
    select: (response) => response.data,
  });

  // Query to fetch user's connections
  const { data: connectionsData, isLoading: isLoadingConnections } = useQuery({
    queryKey: ['connections'],
    queryFn: () => mentorshipApi.getConnections(),
    select: (response) => response.data,
  });

  const availableMentors = mentorsData?.mentors || [];
  const connections = connectionsData?.connections || [];

  // Mutation for requesting connection
  const requestConnectionMutation = useMutation({
    mutationFn: (mentorId: string) => mentorshipApi.requestConnection({ mentorId }),
    onSuccess: () => {
      toast.success('Connection request sent successfully!');
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      queryClient.invalidateQueries({ queryKey: ['mentors'] });
    },
    onError: (error: any) => {
      console.error('Connection request error:', error);
      toast.error(error.response?.data?.error || 'Failed to send connection request');
    },
  });

  // Mutation for responding to connection request
  const respondConnectionMutation = useMutation({
    mutationFn: ({ requestId, action }: { requestId: string; action: 'accept' | 'reject' }) => 
      mentorshipApi.respondToConnection(requestId, action),
    onSuccess: (_, variables) => {
      toast.success(`Connection ${variables.action}ed successfully!`);
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
    onError: (error: any) => {
      console.error('Connection response error:', error);
      toast.error(error.response?.data?.error || 'Failed to respond to connection');
    },
  });

  const handleRequestConnection = (mentorId: string) => {
    requestConnectionMutation.mutate(mentorId);
  };

  const handleConnectionResponse = (requestId: string, action: 'accept' | 'reject') => {
    respondConnectionMutation.mutate({ requestId, action });
  };

  const filteredMentors = availableMentors.filter((mentor) => {
    const matchesSearch = !searchQuery || 
      mentor.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesDepartment = !selectedDepartment || 
      mentor.department.toLowerCase().includes(selectedDepartment.toLowerCase());
    return matchesSearch && matchesDepartment;
  });

  // Mock data for backward compatibility (remove when fully integrated)
  const mockMentors: Mentor[] = [
    {
      id: "1",
      name: "Priya Sharma",
      department: "Psychology",
      year: "Final Year",
      specialties: ["Academic Stress", "Social Anxiety", "Time Management"],
      rating: 4.8,
      totalSessions: 45,
      matchPercentage: 92,
      bio: "Psychology final year student with experience in peer counseling and meditation practices. I'm passionate about helping fellow students navigate academic challenges in Indian educational system.",
      isAvailable: true
    },
    {
      id: "2", 
      name: "Rahul Kumar",
      department: "Computer Science",
      year: "M.Tech 2nd Year",
      specialties: ["Imposter Syndrome", "Career Anxiety", "Work-Life Balance"],
      rating: 4.9,
      totalSessions: 67,
      matchPercentage: 87,
      bio: "M.Tech student in Computer Science who understands the unique pressures of engineering studies in India. Here to support your academic and personal growth through cultural understanding.",
      isAvailable: true
    },
    {
      id: "3",
      name: "Sneha Patel",
      department: "English Literature",
      year: "3rd Year",
      specialties: ["Depression Support", "Creative Expression", "Self-Esteem"],
      rating: 4.7,
      totalSessions: 32,
      matchPercentage: 84,
      bio: "English Literature student with training in active listening and emotional support. I believe in the healing power of Indian cultural arts and creative expression.",
      isAvailable: false
    },
    {
      id: "4",
      name: "Vikram Singh",
      department: "Management Studies",
      year: "Final Year", 
      specialties: ["Performance Pressure", "Family Expectations", "Goal Setting"],
      rating: 4.6,
      totalSessions: 28,
      matchPercentage: 79,
      bio: "Management student focused on handling Indian family expectations and career pressure. Let's work together to achieve your goals while maintaining mental wellness.",
      isAvailable: true
    }
  ];

  const mySessions: Session[] = [
    {
      id: "1",
      mentorName: "Priya Sharma",
      date: "2024-09-20",
      time: "3:00 PM",
      status: "upcoming",
      type: "Academic Support"
    },
    {
      id: "2",
      mentorName: "Rahul Kumar", 
      date: "2024-09-18",
      time: "2:00 PM",
      status: "completed",
      type: "Career Discussion"
    },
    {
      id: "3",
      mentorName: "Priya Sharma",
      date: "2024-09-15",
      time: "4:00 PM", 
      status: "completed",
      type: "Stress Management"
    }
  ];


  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-primary text-white";
      case "completed": return "bg-wellness text-white";
      case "pending": return "bg-yellow-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Users className="h-8 w-8 text-accent" />
          Peer Mentorship
        </h1>
        <p className="text-muted-foreground">
          Connect with trained peer mentors for support, guidance, and shared experiences
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-accent" />
            <div className="text-2xl font-bold text-accent">
              {isLoadingConnections ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : 
               connections.filter(c => c.status === 'accepted').length}
            </div>
            <div className="text-sm text-muted-foreground">Active Mentors</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <MessageCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">
              {isLoadingConnections ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : connections.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Connections</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 mx-auto mb-2 text-wellness" />
            <div className="text-2xl font-bold text-wellness">
              {isLoadingMentors ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : 
               availableMentors.length > 0 ? 
               (availableMentors.reduce((acc, m) => acc + (m.rating || 0), 0) / availableMentors.length).toFixed(1) : '0'}
            </div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-calm" />
            <div className="text-2xl font-bold text-calm">
              {isLoadingConnections ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : 
               connections.filter(c => c.status === 'pending').length}
            </div>
            <div className="text-sm text-muted-foreground">Pending Requests</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Mentors</TabsTrigger>
          <TabsTrigger value="sessions">My Sessions</TabsTrigger>
          <TabsTrigger value="connections">My Connections</TabsTrigger>
        </TabsList>

        {/* Browse Mentors Tab */}
        <TabsContent value="browse" className="space-y-6">
          {/* Filters */}
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search mentors by name or specialty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Department filter"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-48"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedDepartment("");
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <Badge variant="secondary">
                  {isLoadingMentors ? '...' : filteredMentors.filter(m => m.isAvailable).length} Available Now
                </Badge>
                <div className="text-sm text-muted-foreground">
                  {isLoadingMentors ? 'Loading...' : `${filteredMentors.length} mentors found`}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mentor Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoadingMentors ? (
              <div className="col-span-2 flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading mentors...</span>
              </div>
            ) : filteredMentors.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No mentors found matching your criteria.</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setSearchQuery("");
                  setSelectedDepartment("");
                }}>
                  Clear Filters
                </Button>
              </div>
            ) : filteredMentors.map((mentor) => {
              const existingConnection = connections.find(c => 
                c.mentor.id === mentor.user.id
              );
              const isConnected = existingConnection?.status === 'accepted';
              const isPending = existingConnection?.status === 'pending';
              
              return (
                <Card key={mentor.user.id} className="shadow-soft hover:shadow-wellness transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                          {mentor.user.fullName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">
                            {mentor.user.anonymityLevel > 70 ? 'Anonymous Mentor' : mentor.user.fullName}
                          </h3>
                          {isConnected && (
                            <Badge variant="outline" className="text-xs bg-wellness/10 text-wellness">
                              Connected
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {mentor.department} • {mentor.year}
                        </p>
                        
                        <div className="flex items-center gap-1 mb-3">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{mentor.rating?.toFixed(1) || 'N/A'}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={mentor.isAvailable ? "default" : "secondary"}>
                          {mentor.isAvailable ? "Available" : "Busy"}
                        </Badge>
                      </div>
                    </div>
                    
                    {mentor.bio && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {mentor.bio}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {mentor.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      {isConnected ? (
                        <Button className="flex-1 gap-2">
                          <MessageCircle className="h-4 w-4" />
                          Chat
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleRequestConnection(mentor.user.id)}
                          disabled={isPending || !mentor.isAvailable || requestConnectionMutation.isPending}
                          className="flex-1 gap-2"
                        >
                          {requestConnectionMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : isPending ? (
                            <>
                              <Clock className="h-4 w-4" />
                              Pending
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4" />
                              Connect
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* My Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Session History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mySessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-primary text-white">
                          {session.mentorName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="font-medium">{session.mentorName}</div>
                        <div className="text-sm text-muted-foreground">{session.type}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(session.date).toLocaleDateString()} at {session.time}
                        </div>
                      </div>
                    </div>
                    
                    <Badge className={getStatusColor(session.status)}>
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Connections Tab */}
        <TabsContent value="connections" className="space-y-6">
          {isLoadingConnections ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading connections...</span>
            </div>
          ) : (
            <>
              {/* Pending Requests */}
              {connections.filter(c => c.status === 'pending').length > 0 && (
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      Pending Requests ({connections.filter(c => c.status === 'pending').length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {connections
                        .filter(c => c.status === 'pending')
                        .map((connection) => (
                          <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                                  {connection.mentor.fullName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div>
                                <div className="font-medium">
                                  {connection.mentor.anonymityLevel > 70 ? 'Anonymous Mentor' : connection.mentor.fullName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {connection.mentor.mentorProfile?.department} • {connection.mentor.mentorProfile?.year}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Requested {new Date(connection.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              Pending
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Active Connections */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-wellness" />
                    Active Connections ({connections.filter(c => c.status === 'accepted').length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {connections.filter(c => c.status === 'accepted').length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No active connections yet</p>
                      <p className="text-sm">Start by browsing and requesting connections with mentors</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {connections
                        .filter(c => c.status === 'accepted')
                        .map((connection) => (
                          <Card key={connection.id} className="border-wellness/20 bg-wellness/5">
                            <CardContent className="p-4 text-center">
                              <Avatar className="h-16 w-16 mx-auto mb-3">
                                <AvatarFallback className="bg-gradient-wellness text-white font-semibold text-lg">
                                  {connection.mentor.fullName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              
                              <h3 className="font-semibold mb-1">
                                {connection.mentor.anonymityLevel > 70 ? 'Anonymous Mentor' : connection.mentor.fullName}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-1">
                                {connection.mentor.mentorProfile?.department}
                              </p>
                              <div className="flex justify-center gap-1 mb-3">
                                {connection.mentor.mentorProfile?.specialties.slice(0, 2).map((specialty, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                              
                              <div className="flex justify-center gap-2">
                                <Button size="sm" variant="outline" className="gap-1">
                                  <MessageCircle className="h-3 w-3" />
                                  Chat
                                </Button>
                              </div>
                              
                              <div className="text-xs text-muted-foreground mt-2">
                                Connected {new Date(connection.updatedAt).toLocaleDateString()}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}