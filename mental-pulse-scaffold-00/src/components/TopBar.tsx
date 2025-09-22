import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Settings, 
  User, 
  LogOut,
  Menu,
  Home
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface TopBarProps {
  userType: "student" | "admin";
  userName?: string;
  onMobileMenuToggle?: () => void;
}

export function TopBar({ userType, userName = "Arjun", onMobileMenuToggle }: TopBarProps) {
  const [notifications] = useState(3); // Mock notification count
  const location = useLocation();

  return (
    <header className="h-16 bg-card border-b border-border px-4 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Mobile menu toggle */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuToggle}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="hidden md:flex items-center gap-4">
          <h1 className="text-lg font-semibold text-foreground">
            {userType === "admin" ? "Admin Dashboard" : "ManasikSeva"}
          </h1>
          
          {/* Navigation Links for Student */}
          {userType === "student" && (
            <div className="flex items-center gap-1 ml-6">
              <Link to="/">
                <Button 
                  variant={location.pathname === "/" ? "default" : "ghost"} 
                  size="sm"
                  className="text-sm"
                >
                  <Home className="h-4 w-4 mr-1" />
                  Home
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Right: User info and actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {notifications}
            </Badge>
          )}
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>

        {/* User Menu */}
        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <div className="hidden sm:block text-right">
            <div className="text-sm font-medium text-foreground">Welcome, {userName}</div>
            <div className="text-xs text-muted-foreground">
              {userType === "admin" ? "Administrator" : "Student"}
            </div>
          </div>
          
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </div>

        {/* Logout */}
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-crisis">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}