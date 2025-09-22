import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { 
  Bot, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  Shield,
  Globe,
  BarChart3,
  Heart,
  CheckCircle,
  ArrowRight,
  Zap,
  Target
} from "lucide-react";

export function EcosystemOverview() {
  const ecosystemFeatures = [
    {
      id: "ai-chatbot",
      title: "AI-Guided Chatbot",
      description: "Empathetic, instant coping strategies trained on PHQ-9 and GAD-7",
      icon: <Bot className="h-5 w-5" />,
      status: "active",
      link: "/student/chatbot",
      progress: 100,
      color: "primary"
    },
    {
      id: "wellness-tracker",
      title: "Wellness Tracker",
      description: "Daily check-ins with mood tracking and concerning result flags",
      icon: <TrendingUp className="h-5 w-5" />,
      status: "active", 
      link: "/student/wellness",
      progress: 85,
      color: "wellness"
    },
    {
      id: "peer-mentoring",
      title: "Peer Mentor Matching",
      description: "Connect with trained peer mentors for supportive guidance",
      icon: <Users className="h-5 w-5" />,
      status: "active",
      link: "/student/mentorship", 
      progress: 92,
      color: "accent"
    },
    {
      id: "crisis-mode",
      title: "Crisis Response System",
      description: "Immediate helpline access and anonymous emergency alerts",
      icon: <AlertTriangle className="h-5 w-5" />,
      status: "standby",
      link: "/student/crisis",
      progress: 100,
      color: "crisis"
    },
    {
      id: "privacy-design",
      title: "Progressive Privacy Design",
      description: "Student-controlled anonymity levels to reduce stigma",
      icon: <Shield className="h-5 w-5" />,
      status: "configured",
      link: "#",
      progress: 75,
      color: "primary"
    },
    {
      id: "cultural-personalization", 
      title: "Cultural Personalization",
      description: "Local-language content, yoga, and traditional therapy practices",
      icon: <Globe className="h-5 w-5" />,
      status: "active",
      link: "#",
      progress: 88,
      color: "accent"
    }
  ];

  const keyMetrics = [
    { 
      label: "Complete Ecosystem", 
      value: "6 Integrated Modules",
      icon: <Target className="h-4 w-4" />,
      description: "All-in-one platform for comprehensive mental health support"
    },
    { 
      label: "Cultural Sensitivity", 
      value: "6 Languages + Traditional Practices",
      icon: <Globe className="h-4 w-4" />,
      description: "Tailored content in local languages and familiar practices"
    },
    { 
      label: "Privacy-First Design", 
      value: "4 Anonymity Levels",
      icon: <Shield className="h-4 w-4" />,
      description: "Student-controlled privacy reduces stigma and encourages use"
    },
    { 
      label: "Proactive Care Model", 
      value: "Early Detection & Prevention",
      icon: <Zap className="h-4 w-4" />,
      description: "Shifts from crisis-only help to preventive mental healthcare"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-wellness text-white";
      case "standby": return "bg-crisis text-white"; 
      case "configured": return "bg-primary text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getProgressColor = (color: string) => {
    switch (color) {
      case "wellness": return "bg-wellness";
      case "crisis": return "bg-crisis";
      case "accent": return "bg-accent";
      case "primary": 
      default: return "bg-primary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Overview */}
      <Card className="shadow-elevated bg-gradient-hero text-white">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Heart className="h-6 w-6" />
                ManasikSeva Complete Ecosystem
              </h2>
              <p className="text-white/90 text-sm max-w-2xl">
                An integrated mental health platform combining AI chatbots, peer support, 
                crisis response, and institutional analytics - all with cultural sensitivity 
                and privacy-first design.
              </p>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Complete Platform
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {keyMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    {metric.icon}
                  </div>
                </div>
                <div className="text-sm font-semibold">{metric.value}</div>
                <div className="text-xs text-white/80">{metric.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Differentiators */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-wellness" />
            Key Differentiators (USP)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {keyMetrics.map((metric, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-primary mt-1">{metric.icon}</div>
                  <div>
                    <div className="font-semibold text-sm mb-1">{metric.label}</div>
                    <div className="text-xs text-muted-foreground">{metric.description}</div>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {metric.value}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ecosystem Components */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Integrated System Components
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            All modules work together for comprehensive mental health support
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ecosystemFeatures.map((feature) => (
              <div key={feature.id} className="border rounded-lg p-4 hover:shadow-soft transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${feature.color}/10 text-${feature.color}`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(feature.status)}>
                      {feature.status}
                    </Badge>
                    {feature.link.startsWith('/') && (
                      <Link to={feature.link}>
                        <Button size="sm" variant="outline">
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Integration Status</span>
                    <span className="font-medium">{feature.progress}%</span>
                  </div>
                  <Progress 
                    value={feature.progress} 
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Benefits */}
      <Card className="shadow-soft border-wellness/20 bg-wellness-light/30">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 text-wellness font-semibold mb-2">
              <Heart className="h-5 w-5" />
              Comprehensive Mental Health Ecosystem
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              From prevention to crisis intervention, our platform provides culturally-sensitive, 
              privacy-first mental health support that scales from individual care to institutional insights.
            </p>
          </div>
          
          <div className="flex justify-center gap-3 mt-4">
            <Link to="/student/chatbot">
              <Button className="bg-gradient-primary text-white">
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline">
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}