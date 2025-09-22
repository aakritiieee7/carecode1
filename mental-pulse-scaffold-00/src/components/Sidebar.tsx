import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Home, 
  MessageCircle, 
  TrendingUp, 
  Users, 
  Shield,
  BarChart3,
  Map,
  FileText,
  UserCog,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  userType: "student" | "admin";
}

export function Sidebar({ userType }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const studentNavItems = [
    { path: "/student", label: "Home", icon: Home },
    { path: "/student/chatbot", label: "AI Assistant", icon: MessageCircle },
    { path: "/student/wellness", label: "Wellness Tracker", icon: TrendingUp },
    { path: "/student/mentorship", label: "Peer Mentorship", icon: Users },
    { path: "/student/crisis", label: "Crisis Help", icon: AlertTriangle },
  ];

  const adminNavItems = [
    { path: "/admin", label: "Overview", icon: BarChart3 },
    { path: "/admin/heatmap", label: "Campus Heatmap", icon: Map },
    { path: "/admin/reports", label: "Reports & Trends", icon: FileText },
    { path: "/admin/mentors", label: "Manage Mentors", icon: UserCog },
  ];

  const navItems = userType === "student" ? studentNavItems : adminNavItems;
  const isActive = (path: string) => location.pathname === path;

  return (
    <div 
      className={cn(
        "h-screen bg-gradient-surface border-r border-sidebar-border/50 flex flex-col transition-all duration-300 ease-spring backdrop-blur-sm",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Premium Header */}
      <div className="p-6 border-b border-sidebar-border/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-glow animate-float">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-wellness rounded-full flex items-center justify-center">
                  <Sparkles className="h-2 w-2 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gradient-primary">ManasikSeva</span>
                <span className="text-xs text-muted-foreground">Mental Wellness Platform</span>
              </div>
            </Link>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center mx-auto shadow-glow animate-float">
              <Heart className="h-6 w-6 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* User Type Badge - Enhanced */}
      {!isCollapsed && (
        <div className="px-6 py-4">
          <div className={cn(
            "relative overflow-hidden rounded-xl p-4 text-center transition-all duration-300",
            userType === "admin" 
              ? "bg-gradient-to-r from-primary to-primary-glow text-white" 
              : "bg-gradient-to-r from-wellness to-wellness-glow text-white"
          )}>
            <div className="relative z-10 flex items-center justify-center gap-2">
              {userType === "admin" ? (
                <>
                  <Shield className="h-4 w-4" />
                  <span className="font-semibold">Administrator Portal</span>
                </>
              ) : (
                <>
                  <Users className="h-4 w-4" />
                  <span className="font-semibold">Student Dashboard</span>
                </>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10" />
          </div>
        </div>
      )}

      {/* Premium Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 scrollbar-premium">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link key={item.path} to={item.path} className="block">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-4 h-12 rounded-xl transition-all duration-300 relative group",
                  isCollapsed && "px-0 justify-center",
                  active && "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent text-primary shadow-soft border border-primary/20",
                  !active && "hover:bg-gradient-to-r hover:from-muted/50 hover:to-transparent hover:shadow-soft"
                )}
              >
                {/* Active Indicator */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-primary rounded-r-full" />
                )}
                
                <div className={cn(
                  "relative p-2 rounded-lg transition-all duration-300",
                  active && "bg-primary/10",
                  !active && "group-hover:bg-primary/5"
                )}>
                  <Icon className={cn(
                    "h-5 w-5 transition-all duration-300",
                    active && "text-primary",
                    !active && "text-muted-foreground group-hover:text-primary"
                  )} />
                  
                  {/* Glow effect for active state */}
                  {active && !isCollapsed && (
                    <div className="absolute inset-0 bg-primary/20 rounded-lg blur-sm animate-pulse-glow" />
                  )}
                </div>
                
                {!isCollapsed && (
                  <div className="flex flex-col items-start">
                    <span className={cn(
                      "font-medium transition-colors duration-300",
                      active && "text-primary",
                      !active && "text-foreground group-hover:text-primary"
                    )}>
                      {item.label}
                    </span>
                    {active && (
                      <span className="text-xs text-primary/70 font-medium">
                        Active
                      </span>
                    )}
                  </div>
                )}
                
                {!isCollapsed && active && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  </div>
                )}
              </Button>
            </Link>
          );
        })}
        
        {/* Emergency Access for Students */}
        {userType === "student" && !isCollapsed && (
          <div className="mt-8 pt-6 border-t border-sidebar-border/50">
            <Link to="/student/crisis">
              <div className="relative overflow-hidden bg-gradient-to-br from-crisis/10 via-crisis/5 to-transparent border border-crisis/20 rounded-xl p-4 hover-lift group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-crisis/10 rounded-lg group-hover:bg-crisis/20 transition-colors">
                    <AlertTriangle className="h-5 w-5 text-crisis" />
                  </div>
                  <div>
                    <div className="font-semibold text-crisis text-sm">Emergency Help</div>
                    <div className="text-xs text-crisis/70">24/7 Crisis Support</div>
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <div className="status-indicator status-available" />
                </div>
              </div>
            </Link>
          </div>
        )}
      </nav>

      {/* Premium Collapse Toggle */}
      <div className="p-4 border-t border-sidebar-border/50">
        <Button
          variant="ghost"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "w-full rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent hover:shadow-soft",
            isCollapsed && "justify-center"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted/50 rounded-lg">
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </div>
            {!isCollapsed && (
              <span className="font-medium">Collapse Menu</span>
            )}
          </div>
        </Button>
      </div>
    </div>
  );
}