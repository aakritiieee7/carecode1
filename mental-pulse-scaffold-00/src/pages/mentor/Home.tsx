import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Star, 
  MessageCircle, 
  Calendar,
  CheckCircle,
  Clock,
  Heart,
  Settings,
  Edit,
  Plus,
  Loader2,
  UserCheck,
  X,
  CheckIcon,
  AlertCircle
} from "lucide-react";
import { mentorshipApi } from "@/lib/api";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export default function MentorHome() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    department: "",
    year: "",
    specialties: [] as string[],
    bio: "",
  });
  const [newSpecialty, setNewSpecialty] = useState("");
  
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query to fetch mentor profile
  const { data: mentorProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['mentorProfile'],
    queryFn: async () => {
      try {
        // This will fail if no profile exists, which is expected
        const response = await mentorshipApi.getMentor(user?.id || '');
        return response.data.mentor;
      } catch (error) {
        // Return null if no profile exists yet
        return null;
      }
    },
    enabled: !!user?.id,
  });

  // Query to fetch mentor's connections
  const { data: connectionsData, isLoading: isLoadingConnections } = useQuery({
    queryKey: ['mentorConnections'],
    queryFn: () => mentorshipApi.getConnections(),
    select: (response) => response.data,
  });

  const connections = connectionsData?.connections || [];

  // Initialize profile data when mentor profile is loaded
  useEffect(() => {
    if (mentorProfile) {
      setProfileData({
        department: mentorProfile.department,
        year: mentorProfile.year,
        specialties: mentorProfile.specialties,
        bio: mentorProfile.bio || "",
      });
    }
  }, [mentorProfile]);

  // Mutation for creating/updating mentor profile
  const profileMutation = useMutation({
    mutationFn: (data: typeof profileData) => {
      if (mentorProfile) {
        return mentorshipApi.updateProfile(data);
      } else {
        return mentorshipApi.createProfile(data);
      }
    },
    onSuccess: () => {
      toast.success(mentorProfile ? 'Profile updated successfully!' : 'Profile created successfully!');
      queryClient.invalidateQueries({ queryKey: ['mentorProfile'] });
      setIsEditingProfile(false);
    },
    onError: (error: any) => {
      console.error('Profile error:', error);
      toast.error(error.response?.data?.error || 'Failed to save profile');
    },
  });

  // Mutation for responding to connection requests
  const respondConnectionMutation = useMutation({
    mutationFn: ({ requestId, action }: { requestId: string; action: 'accept' | 'reject' }) => 
      mentorshipApi.respondToConnection(requestId, action),
    onSuccess: (_, variables) => {
      toast.success(`Connection ${variables.action}ed successfully!`);
      queryClient.invalidateQueries({ queryKey: ['mentorConnections'] });
    },
    onError: (error: any) => {
      console.error('Connection response error:', error);
      toast.error(error.response?.data?.error || 'Failed to respond to connection');
    },
  });

  const handleSaveProfile = () => {
    if (!profileData.department || !profileData.year || profileData.specialties.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    profileMutation.mutate(profileData);
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !profileData.specialties.includes(newSpecialty.trim())) {
      setProfileData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty("");
    }
  };

  const removeSpecialty = (specialty: string) => {
    setProfileData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const handleConnectionResponse = (requestId: string, action: 'accept' | 'reject') => {
    respondConnectionMutation.mutate({ requestId, action });
  };

  const pendingConnections = connections.filter(c => c.status === 'pending');
  const activeConnections = connections.filter(c => c.status === 'accepted');

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Users className="h-8 w-8 text-accent" />
          Welcome, {user?.fullName}!
        </h1>
        <p className="text-muted-foreground">
          Mentor Dashboard - Support students in their mental wellness journey
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <UserCheck className="h-6 w-6 mx-auto mb-2 text-accent" />
            <div className="text-2xl font-bold text-accent">
              {isLoadingConnections ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : activeConnections.length}
            </div>
            <div className="text-sm text-muted-foreground">Active Connections</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">
              {isLoadingConnections ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : pendingConnections.length}
            </div>
            <div className="text-sm text-muted-foreground">Pending Requests</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 mx-auto mb-2 text-wellness" />
            <div className="text-2xl font-bold text-wellness">
              {mentorProfile?.rating?.toFixed(1) || 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground">Rating</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <Heart className="h-6 w-6 mx-auto mb-2 text-calm" />
            <div className="text-2xl font-bold text-calm">
              {mentorProfile?.isAvailable ? 'Available' : 'Busy'}
            </div>
            <div className="text-sm text-muted-foreground">Status</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="connections" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Connections
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Requests ({pendingConnections.length})
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-accent" />
                  Mentor Profile
                </CardTitle>
                {!isEditingProfile && mentorProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingProfile(true)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingProfile ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading profile...</span>
                </div>
              ) : (!mentorProfile || isEditingProfile) ? (
                // Profile Creation/Edit Form
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Input
                        id="department"
                        placeholder="e.g., Computer Science"
                        value={profileData.department}
                        onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                        disabled={profileMutation.isPending}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year/Level *</Label>
                      <Input
                        id="year"
                        placeholder="e.g., Final Year, M.Tech 2nd Year"
                        value={profileData.year}
                        onChange={(e) => setProfileData(prev => ({ ...prev, year: e.target.value }))}
                        disabled={profileMutation.isPending}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Specialties * (Areas you can help with)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., Academic Stress, Social Anxiety"
                        value={newSpecialty}
                        onChange={(e) => setNewSpecialty(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSpecialty()}
                        disabled={profileMutation.isPending}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addSpecialty}
                        disabled={!newSpecialty.trim() || profileMutation.isPending}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profileData.specialties.map((specialty) => (
                        <Badge key={specialty} variant="outline" className="gap-2">
                          {specialty}
                          <button
                            onClick={() => removeSpecialty(specialty)}
                            className="hover:bg-destructive hover:text-destructive-foreground rounded-full"
                            disabled={profileMutation.isPending}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio (Optional)</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell students about your experience and approach to mentoring..."
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={profileMutation.isPending}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    {mentorProfile && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditingProfile(false);
                          setProfileData({
                            department: mentorProfile.department,
                            year: mentorProfile.year,
                            specialties: mentorProfile.specialties,
                            bio: mentorProfile.bio || "",
                          });
                        }}
                        disabled={profileMutation.isPending}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      onClick={handleSaveProfile}
                      disabled={profileMutation.isPending}
                      className="gap-2"
                    >
                      {profileMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          {mentorProfile ? 'Update Profile' : 'Create Profile'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                // Profile Display
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Department</h4>
                      <p className="text-lg">{mentorProfile.department}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Year/Level</h4>
                      <p className="text-lg">{mentorProfile.year}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {mentorProfile.specialties.map((specialty) => (
                        <Badge key={specialty} variant="outline">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {mentorProfile.bio && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Bio</h4>
                      <p className="text-sm leading-relaxed">{mentorProfile.bio}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{mentorProfile.rating?.toFixed(1) || 'N/A'}</span>
                      </div>
                      <Badge variant={mentorProfile.isAvailable ? "default" : "secondary"}>
                        {mentorProfile.isAvailable ? "Available" : "Busy"}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Connections Tab */}
        <TabsContent value="connections" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                Active Connections ({activeConnections.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingConnections ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading connections...</span>
                </div>
              ) : activeConnections.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No active connections yet</p>
                  <p className="text-sm">Students will appear here once you accept their connection requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeConnections.map((connection) => (
                    <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg bg-wellness/5">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-wellness text-white font-semibold">
                            {connection.student.fullName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="font-medium">
                            {connection.student.anonymityLevel > 70 ? 'Anonymous Student' : connection.student.fullName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Connected {new Date(connection.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <Button size="sm" className="gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Chat
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Pending Connection Requests ({pendingConnections.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingConnections ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading requests...</span>
                </div>
              ) : pendingConnections.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No pending requests</p>
                  <p className="text-sm">New connection requests from students will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingConnections.map((connection) => (
                    <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                            {connection.student.fullName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="font-medium">
                            {connection.student.anonymityLevel > 70 ? 'Anonymous Student' : connection.student.fullName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Requested {new Date(connection.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleConnectionResponse(connection.id, 'reject')}
                          disabled={respondConnectionMutation.isPending}
                          className="gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <X className="h-4 w-4" />
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleConnectionResponse(connection.id, 'accept')}
                          disabled={respondConnectionMutation.isPending}
                          className="gap-2 bg-wellness hover:bg-wellness/90 text-white"
                        >
                          {respondConnectionMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <CheckIcon className="h-4 w-4" />
                              Accept
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}