import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, AlertCircle, Activity } from "lucide-react";

export function Heatmap() {
  // Mock heatmap data representing different campus areas
  const heatmapData = [
    { area: "Library", level: "high", count: 23, color: "bg-crisis" },
    { area: "Dormitories", level: "medium", count: 15, color: "bg-yellow-400" },
    { area: "Student Center", level: "low", count: 8, color: "bg-wellness" },
    { area: "Academic Buildings", level: "medium", count: 18, color: "bg-yellow-400" },
    { area: "Recreation Center", level: "low", count: 5, color: "bg-wellness" },
    { area: "Dining Halls", level: "high", count: 20, color: "bg-crisis" },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "high": return "text-crisis bg-crisis-light";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "low": return "text-wellness bg-wellness-light";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const totalCount = heatmapData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Campus Wellness Heatmap
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Anonymous stress levels across campus areas (last 24 hours)
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
              <div className="text-2xl font-bold">{totalCount}</div>
              <div className="text-xs text-muted-foreground">Total Check-ins</div>
            </div>
            <div className="text-center p-3 bg-crisis-light rounded-lg">
              <AlertCircle className="h-5 w-5 mx-auto mb-1 text-crisis" />
              <div className="text-2xl font-bold">
                {heatmapData.filter(item => item.level === "high").length}
              </div>
              <div className="text-xs text-muted-foreground">High Stress Areas</div>
            </div>
            <div className="text-center p-3 bg-wellness-light rounded-lg">
              <Activity className="h-5 w-5 mx-auto mb-1 text-wellness" />
              <div className="text-2xl font-bold">87%</div>
              <div className="text-xs text-muted-foreground">Response Rate</div>
            </div>
          </div>

          {/* Heatmap Visualization */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm mb-3">Stress Levels by Campus Area</h3>
            {heatmapData.map((area, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${area.color}`}></div>
                  <span className="font-medium">{area.area}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {area.count} check-ins
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(area.level)}`}>
                    {area.level.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-2">Stress Level Legend</h4>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-wellness rounded"></div>
                <span>Low Stress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                <span>Medium Stress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-crisis rounded"></div>
                <span>High Stress</span>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">
              * Data is completely anonymous and aggregated. Individual responses cannot be identified.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}