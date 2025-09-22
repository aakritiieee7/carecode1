import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Users, 
  Database,
  Lock,
  Info,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export function PrivacySettings() {
  const [anonymityLevel, setAnonymityLevel] = useState([60]);
  const [dataSharing, setDataSharing] = useState(true);
  const [institutionalAnalytics, setInstitutionalAnalytics] = useState(true);
  const [peerVisibility, setPeerVisibility] = useState(false);
  const [crisisOverride, setCrisisOverride] = useState(true);

  const getAnonymityLabel = (level: number) => {
    if (level <= 25) return "Open Profile";
    if (level <= 50) return "Semi-Anonymous";
    if (level <= 75) return "Mostly Anonymous";
    return "Fully Anonymous";
  };

  const getAnonymityColor = (level: number) => {
    if (level <= 25) return "text-crisis";
    if (level <= 50) return "text-warning";
    if (level <= 75) return "text-primary";
    return "text-wellness";
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Shield className="h-5 w-5" />
          Privacy & Anonymity Controls
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Control your privacy level to reduce stigma and encourage honest sharing
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Anonymity Level Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Anonymity Level</label>
            <Badge variant="outline" className={getAnonymityColor(anonymityLevel[0])}>
              {getAnonymityLabel(anonymityLevel[0])}
            </Badge>
          </div>
          
          <Slider
            value={anonymityLevel}
            onValueChange={setAnonymityLevel}
            max={100}
            min={0}
            step={25}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Full Identity</span>
            <span>Anonymous</span>
          </div>
          
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              <div className="text-xs text-muted-foreground">
                {anonymityLevel[0] <= 25 && "Your name and profile are visible to mentors and in analytics"}
                {anonymityLevel[0] > 25 && anonymityLevel[0] <= 50 && "Limited profile info shared, name partially hidden"}
                {anonymityLevel[0] > 50 && anonymityLevel[0] <= 75 && "Only anonymous metrics shared, no personal identifiers"}
                {anonymityLevel[0] > 75 && "Complete anonymity, only aggregated data patterns"}
              </div>
            </div>
          </div>
        </div>

        {/* Data Sharing Controls */}
        <div className="space-y-4 border-t pt-4">
          <h4 className="font-medium text-sm">Data Sharing Preferences</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-sm font-medium">Anonymous Analytics</div>
                  <div className="text-xs text-muted-foreground">
                    Help improve campus mental health through anonymous data
                  </div>
                </div>
              </div>
              <Switch 
                checked={institutionalAnalytics} 
                onCheckedChange={setInstitutionalAnalytics}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-accent" />
                <div>
                  <div className="text-sm font-medium">Peer Matching Data</div>
                  <div className="text-xs text-muted-foreground">
                    Share anonymous preferences for better mentor matching
                  </div>
                </div>
              </div>
              <Switch 
                checked={dataSharing} 
                onCheckedChange={setDataSharing}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {peerVisibility ? <Eye className="h-4 w-4 text-wellness" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                <div>
                  <div className="text-sm font-medium">Peer Visibility</div>
                  <div className="text-xs text-muted-foreground">
                    Allow other students to see your support activities
                  </div>
                </div>
              </div>
              <Switch 
                checked={peerVisibility} 
                onCheckedChange={setPeerVisibility}
              />
            </div>
          </div>
        </div>

        {/* Crisis Override */}
        <div className="space-y-3 border-t pt-4">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-crisis" />
            Emergency Settings
          </h4>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Crisis Override</div>
              <div className="text-xs text-muted-foreground">
                Allow emergency services to access your data in crisis situations
              </div>
            </div>
            <Switch 
              checked={crisisOverride} 
              onCheckedChange={setCrisisOverride}
            />
          </div>
          
          <div className="bg-crisis-light/50 border border-crisis/20 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Lock className="h-4 w-4 mt-0.5 text-crisis flex-shrink-0" />
              <div className="text-xs text-crisis">
                When enabled, campus authorities can access your anonymous data patterns 
                if our AI detects severe mental health risks for immediate intervention.
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Summary */}
        <div className="bg-wellness-light/50 border border-wellness/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-wellness" />
            <span className="text-sm font-medium text-wellness">Your Privacy Status</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>• Identity Protection: {getAnonymityLabel(anonymityLevel[0])}</div>
            <div>• Analytics Contribution: {institutionalAnalytics ? "Active" : "Disabled"}</div>
            <div>• Peer Matching: {dataSharing ? "Enabled" : "Disabled"}</div>
            <div>• Crisis Safety Net: {crisisOverride ? "Protected" : "Opt-out"}</div>
          </div>
        </div>

        <Button className="w-full bg-gradient-primary text-white">
          <Shield className="mr-2 h-4 w-4" />
          Save Privacy Settings
        </Button>
      </CardContent>
    </Card>
  );
}