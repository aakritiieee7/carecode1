import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  AlertTriangle, 
  Phone, 
  Users, 
  MessageSquare,
  Clock,
  Shield,
  Heart,
  ExternalLink,
  MapPin,
  Calendar,
  Sparkles,
  Zap,
  Send,
  Loader2
} from "lucide-react";
import { crisisApi } from "@/lib/api";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

interface HelplineResource {
  name: string;
  number: string;
  description: string;
  availability: string;
  type: "crisis" | "support" | "text";
}

interface CampusResource {
  name: string;
  location: string;
  hours: string;
  services: string[];
  contact: string;
}

export default function CrisisHelp() {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isReportAlertOpen, setIsReportAlertOpen] = useState(false);
  const [alertArea, setAlertArea] = useState("");
  const [alertDescription, setAlertDescription] = useState("");
  
  const crisisHelplines: HelplineResource[] = [
    {
      name: "KIRAN Mental Health Helpline",
      number: "1800-599-0019",
      description: "24/7 mental health support by Ministry of Social Justice & Empowerment, GoI",
      availability: "24/7",
      type: "crisis"
    },
    {
      name: "Vandrevala Foundation Helpline",
      number: "9999 666 555",
      description: "Free confidential crisis counseling and emotional support",
      availability: "24/7",
      type: "crisis"
    },
    {
      name: "Aasra Suicide Prevention",
      number: "91-9820466726",
      description: "24x7 helpline for suicide prevention and mental health support",
      availability: "24/7",
      type: "crisis"
    },
    {
      name: "iCall Psychosocial Helpline",
      number: "9152987821",
      description: "Professional counseling and emotional support by trained volunteers",
      availability: "Mon-Sat 8AM-10PM",
      type: "support"
    },
    {
      name: "Sneha India Foundation",
      number: "91-44-24640050",
      description: "Suicide prevention and emotional support for students and adults",
      availability: "24/7",
      type: "support"
    }
  ];

  const campusResources: CampusResource[] = [
    {
      name: "Student Counselling Centre",
      location: "Academic Block-A, Ground Floor",
      hours: "Mon-Fri 9AM-6PM, Emergency after hours",
      services: ["Individual Counselling", "Group Therapy", "Crisis Intervention"],
      contact: "+91-11-2659-1234"
    },
    {
      name: "Health & Wellness Centre",
      location: "Student Activity Centre, 1st Floor",
      hours: "Mon-Sat 9AM-7PM",
      services: ["Stress Management", "Yoga & Meditation", "Peer Support Groups"],
      contact: "+91-11-2659-5678"
    },
    {
      name: "Campus Security (24/7 Emergency)",
      location: "Available campus-wide",
      hours: "24/7",
      services: ["Emergency Response", "Safety Escorts", "Crisis Support"],
      contact: "+91-11-2659-1100"
    },
    {
      name: "Dean of Student Welfare",
      location: "Administrative Block, 2nd Floor",
      hours: "Mon-Fri 10AM-5PM",
      services: ["Academic Counselling", "Hostel Issues", "Financial Support"],
      contact: "+91-11-2659-2300"
    }
  ];

  const selfCareStrategies = [
    {
      title: "Breathing Exercises",
      description: "Simple techniques to calm anxiety and panic",
      icon: <Heart className="h-5 w-5 text-wellness" />,
      steps: ["Find a comfortable position", "Inhale for 4 counts", "Hold for 4 counts", "Exhale for 6 counts", "Repeat 5-10 times"]
    },
    {
      title: "Grounding Technique (5-4-3-2-1)",
      description: "Use your senses to stay present during overwhelming moments",
      icon: <Shield className="h-5 w-5 text-primary" />,
      steps: ["5 things you can see", "4 things you can touch", "3 things you can hear", "2 things you can smell", "1 thing you can taste"]
    }
  ];

  const getHelplineTypeColor = (type: string) => {
    switch (type) {
      case "crisis": return "bg-crisis text-white";
      case "text": return "bg-accent text-white";
      case "support": return "bg-primary text-white";
      default: return "bg-muted";
    }
  };

  // Crisis alert mutation
  const reportAlertMutation = useMutation({
    mutationFn: (data: { areaOfConcern: string; description?: string }) => 
      crisisApi.createAlert(data),
    onSuccess: () => {
      toast.success('Crisis alert sent successfully. Help is on the way.');
      setIsReportAlertOpen(false);
      setAlertArea("");
      setAlertDescription("");
    },
    onError: (error: any) => {
      console.error('Crisis alert error:', error);
      toast.error(error.response?.data?.error || 'Failed to send crisis alert');
    },
  });

  const handleEmergencyAction = (action: string) => {
    console.log(`Emergency action: ${action}`);
    setIsEmergencyModalOpen(false);
  };

  const handleReportAlert = () => {
    if (!alertArea.trim()) {
      toast.error('Please specify the area of concern');
      return;
    }
    
    reportAlertMutation.mutate({
      areaOfConcern: alertArea.trim(),
      description: alertDescription.trim() || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
        {/* Hero Section with Premium Layout */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 text-white animate-slide-down">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Shield className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-1">Crisis Support & Resources</h1>
                    <p className="text-white/80 text-lg">
                      Professional help available 24/7 - आप अकेले नहीं हैं
                    </p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => setIsEmergencyModalOpen(true)}
                size="lg"
                className="bg-crisis hover:bg-crisis-glow text-white animate-pulse-crisis px-8 py-4 h-auto shadow-elevated hover:shadow-glow transition-all duration-300"
              >
                <Zap className="mr-3 h-6 w-6" />
                <div className="text-left">
                  <div className="font-bold text-lg">EMERGENCY HELP</div>
                  <div className="text-xs opacity-90">तुरंत सहायता</div>
                </div>
              </Button>
            </div>

            {/* Important Notice - Enhanced */}
            <div className="glass rounded-xl p-4 border border-white/20">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-crisis/20 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">महत्वपूर्ण सूचना - Important Notice</h3>
                  <p className="text-sm text-white/80">
                    यदि यह एक जानलेवा आपातकाल है, तो तुरंत 100 (पुलिस) या 108 (एम्बुलेंस) पर कॉल करें।
                  </p>
                  <p className="text-xs text-white/70 mt-1">
                    If this is a life-threatening emergency, please call 100 (Police) or 108 (Ambulance) immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content - Crisis Helplines & Campus Resources */}
          <div className="xl:col-span-2 space-y-8">
            {/* Crisis Helplines - Premium Design */}
            <div className="card-premium animate-slide-up">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-gradient-primary">Crisis Helplines</span>
                  <Badge variant="secondary" className="ml-auto">
                    <Sparkles className="h-3 w-3 mr-1" />
                    24/7 Available
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {crisisHelplines.map((helpline, index) => (
                  <div key={index} className="group relative overflow-hidden border border-border/50 rounded-xl p-6 hover-lift hover-glow bg-gradient-to-r from-card via-card to-muted/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{helpline.name}</h3>
                          <Badge className={getHelplineTypeColor(helpline.type)} variant="secondary">
                            {helpline.type === 'crisis' && <Zap className="h-3 w-3 mr-1" />}
                            {helpline.type.charAt(0).toUpperCase() + helpline.type.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-2xl font-mono text-primary mb-3 font-bold tracking-wide">
                          {helpline.number}
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-4">{helpline.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <div className="status-indicator status-available" />
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">{helpline.availability}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </Button>
                      <Button variant="outline" className="hover-glow">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </div>

            {/* Campus Resources - Enhanced */}
            <div className="card-premium animate-slide-up">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-wellness/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-wellness" />
                  </div>
                  <span className="text-gradient-wellness">Campus Resources</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {campusResources.map((resource, index) => (
                  <div key={index} className="group border border-border/50 rounded-xl p-6 hover-lift bg-gradient-to-br from-card to-wellness-light/5">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-wellness rounded-full" />
                      {resource.name}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <MapPin className="h-4 w-4 text-wellness" />
                        <span className="text-sm">{resource.location}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm">{resource.hours}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg md:col-span-2">
                        <Phone className="h-4 w-4 text-accent" />
                        <span className="text-sm font-mono">{resource.contact}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {resource.services.map((service) => (
                        <Badge key={service} variant="outline" className="text-xs border-wellness/30 hover:bg-wellness/5">
                          {service}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button variant="outline" className="w-full hover-glow">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Appointment
                    </Button>
                  </div>
                ))}
              </CardContent>
            </div>
          </div>

          {/* Sidebar - Self-Care & Resources */}
          <div className="space-y-8">
            {/* Immediate Self-Care - Premium */}
            <div className="card-glass animate-slide-left">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-wellness/10 rounded-lg">
                    <Heart className="h-5 w-5 text-wellness" />
                  </div>
                  <span className="text-wellness">Immediate Self-Care</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {selfCareStrategies.map((strategy, index) => (
                  <div key={index} className="group space-y-4 p-4 rounded-xl bg-gradient-to-br from-wellness-light/5 to-transparent border border-wellness/10 hover:border-wellness/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-wellness/10 rounded-lg group-hover:bg-wellness/20 transition-colors">
                        {strategy.icon}
                      </div>
                      <h4 className="font-semibold">{strategy.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{strategy.description}</p>
                    <div className="bg-gradient-to-r from-muted/50 to-wellness-light/10 rounded-xl p-4 space-y-3">
                      <ol className="space-y-2">
                        {strategy.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start gap-3 text-sm">
                            <span className="flex items-center justify-center w-6 h-6 bg-wellness/10 text-wellness rounded-full font-medium text-xs">
                              {stepIndex + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </CardContent>
            </div>

            {/* Additional Resources - Enhanced */}
            <div className="card-glass animate-slide-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <ExternalLink className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-accent">Additional Resources</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start hover-lift" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="h-4 w-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Mental Health First Aid Guide</div>
                      <div className="text-xs text-muted-foreground">Hindi/English</div>
                    </div>
                  </a>
                </Button>
                
                <Button variant="outline" className="w-full justify-start hover-lift" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Users className="h-4 w-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Local Support Groups</div>
                      <div className="text-xs text-muted-foreground">Community connections</div>
                    </div>
                  </a>
                </Button>
                
                <Button variant="outline" className="w-full justify-start hover-lift" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Shield className="h-4 w-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Student Safety Planning</div>
                      <div className="text-xs text-muted-foreground">Personal safety tools</div>
                    </div>
                  </a>
                </Button>
              </CardContent>
            </div>

            {/* Emergency Quick Actions - Premium Design */}
            <div className="relative overflow-hidden bg-gradient-to-br from-crisis via-crisis-glow to-crisis rounded-xl p-6 text-white animate-slide-left">
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />
              <div className="relative z-10">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Emergency Quick Actions
                  </CardTitle>
                </CardHeader>
                
                <div className="space-y-3">
                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20" size="lg">
                    <Phone className="h-4 w-4 mr-2" />
                    Call 100/108
                  </Button>
                  
                  <Button 
                    onClick={() => setIsReportAlertOpen(true)}
                    variant="outline" 
                    className="w-full border-white/30 text-white hover:bg-white/10"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Report Crisis Alert
                  </Button>
                  
                  <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Text Crisis Line
                  </Button>
                  
                  <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                    <Users className="h-4 w-4 mr-2" />
                    Contact Campus Security
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Emergency Modal */}
        <Dialog open={isEmergencyModalOpen} onOpenChange={setIsEmergencyModalOpen}>
          <DialogContent className="max-w-lg card-glass border-crisis/20">
            <DialogHeader className="text-center">
              <DialogTitle className="flex items-center justify-center gap-3 text-crisis text-2xl">
                <div className="p-3 bg-crisis/10 rounded-full animate-pulse-crisis">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                Emergency Support Options
              </DialogTitle>
              <p className="text-muted-foreground mt-2">
                तुरंत सहायता के लिए सबसे उपयुक्त विकल्प चुनें
              </p>
            </DialogHeader>
            
            <div className="space-y-4 mt-6">
              <div className="grid gap-4">
                <Button
                  onClick={() => handleEmergencyAction("Call Emergency")}
                  className="w-full justify-start bg-gradient-to-r from-crisis to-crisis-glow hover:shadow-glow text-white h-auto py-6 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-lg">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg">Call 100/108</div>
                      <div className="text-sm opacity-90">Police/Medical Emergency</div>
                      <div className="text-xs opacity-70">पुलिस/चिकित्सा आपातकाल</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleEmergencyAction("Crisis Helpline")}
                  variant="outline"
                  className="w-full justify-start border-crisis/30 text-crisis hover:bg-crisis-light h-auto py-6 rounded-xl hover-lift"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-crisis/10 rounded-lg">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg">KIRAN Helpline</div>
                      <div className="text-sm opacity-70">1800-599-0019</div>
                      <div className="text-xs opacity-60">24x7 Mental Health Support</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleEmergencyAction("Campus Security")}
                  variant="outline"
                  className="w-full justify-start border-primary/30 text-primary hover:bg-primary/5 h-auto py-6 rounded-xl hover-lift"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg">Campus Security</div>
                      <div className="text-sm opacity-70">On-campus Emergency Response</div>
                      <div className="text-xs opacity-60">कैंपस सुरक्षा सहायता</div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Crisis Alert Reporting Dialog */}
        <Dialog open={isReportAlertOpen} onOpenChange={setIsReportAlertOpen}>
          <DialogContent className="max-w-lg card-glass border-crisis/20">
            <DialogHeader className="text-center">
              <DialogTitle className="flex items-center justify-center gap-3 text-crisis text-xl">
                <div className="p-2 bg-crisis/10 rounded-full">
                  <Send className="h-5 w-5" />
                </div>
                Report Crisis Alert
              </DialogTitle>
              <p className="text-muted-foreground text-sm mt-2">
                Your alert will be sent to campus authorities for immediate response
              </p>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="alert-area">Area of Concern *</Label>
                <Input
                  id="alert-area"
                  placeholder="e.g., Library Study Hall, Hostel Room 204, Campus Garden"
                  value={alertArea}
                  onChange={(e) => setAlertArea(e.target.value)}
                  disabled={reportAlertMutation.isPending}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alert-description">Description (Optional)</Label>
                <Textarea
                  id="alert-description"
                  placeholder="Briefly describe the situation if you feel comfortable sharing..."
                  value={alertDescription}
                  onChange={(e) => setAlertDescription(e.target.value)}
                  disabled={reportAlertMutation.isPending}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="bg-crisis/5 border border-crisis/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-crisis mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    <p><strong>Privacy Notice:</strong> This alert will be sent anonymously based on your privacy settings. Campus authorities will respond to the location you specify.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => setIsReportAlertOpen(false)}
                  disabled={reportAlertMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleReportAlert}
                  disabled={reportAlertMutation.isPending || !alertArea.trim()}
                  className="flex-1 bg-crisis hover:bg-crisis/90 text-white"
                >
                  {reportAlertMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Alert
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
