import { useState, useEffect } from "react";
import { campaignApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Megaphone, Calendar, Users, CheckCircle, Plus } from "lucide-react";

import { Campaign } from "@/lib/api";

export function CampaignPlanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    department: "",
    description: ""
  });

  const handleSubmit = async () => {
    if (!formData.title || !formData.date || !formData.department) return;

    try {
      const response = await campaignApi.create({
        title: formData.title,
        date: formData.date,
        department: formData.department,
        description: formData.description,
        status: "draft",
      });

      const newCampaign = response.data.data.campaign;

      // Ensure reach is not undefined
      newCampaign.reach = newCampaign.reach || 0;

      setCampaigns([newCampaign, ...campaigns]);
      setFormData({ title: "", date: "", department: "", description: "" });
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error creating campaign:", error);
      setErrorMessage("Failed to create campaign. Please try again later.");
    }
  };

  const getStatusConfig = (status: string): { color: string; label: string } => {
    switch (status) {
      case "active":
        return { color: "bg-wellness text-white", label: "Active" };
      case "scheduled":
        return { color: "bg-primary text-white", label: "Scheduled" };
      case "completed":
        return { color: "bg-muted text-muted-foreground", label: "Completed" };
      case "draft":
        return { color: "bg-accent text-white", label: "Draft" };
      default:
        return { color: "bg-muted text-muted-foreground", label: "Unknown" };
    }
  }
  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      try {
        const response = await campaignApi.getAll();
        const campaignsData = response.data.data.campaigns;
        setCampaigns(campaignsData);
      } catch (error: any) {
        console.error("Error fetching campaigns:", error);
        setErrorMessage("Failed to fetch campaigns. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <>
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-accent" />
            Awareness Campaign Planner
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Create and manage mental health awareness campaigns across campus
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Create New Campaign Button */}
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-gradient-primary text-white"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Launch New Campaign
          </Button>

          {/* Active Campaigns */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Current Campaigns</h3>
            {isLoading ? (
              <div>Loading campaigns...</div>
            ) : errorMessage ? (
              <div className="text-red-500 text-sm">{errorMessage}</div>
            ) : campaigns.length > 0 ? (
              <div className="space-y-3">
                {campaigns.map((campaign) => {
                  const statusConfig = getStatusConfig(campaign.status);
                  return (
                    <div key={campaign.id} className="border rounded-lg p-4 hover:shadow-soft transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm">{campaign.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(campaign.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {campaign.department}
                        </div>
                      </div>
                      
                      {campaign.reach > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Reached: {campaign.reach.toLocaleString()} students
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No campaigns created yet</p>
                <p className="text-sm">Start by launching your first awareness campaign</p>
              </div>
            )}
          </div>

          {/* Campaign Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <div className="text-lg font-bold text-primary">{campaigns.length}</div>
              <div className="text-xs text-muted-foreground">Total Campaigns</div>
            </div>
            <div className="text-center p-3 bg-wellness/10 rounded-lg">
              <div className="text-lg font-bold text-wellness">
                {campaigns.reduce((sum, c) => sum + c.reach, 0).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Students Reached</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Create New Campaign
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title</Label>
              <Input
                id="title"
                placeholder="e.g., Mental Health Awareness Week"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Launch Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Target Department</Label>
              <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Departments">All Departments</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Liberal Arts">Liberal Arts</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Sciences">Sciences</SelectItem>
                  <SelectItem value="Medicine">Medicine</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Campaign goals, activities, and expected outcomes..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSubmit} className="flex-1">
                <CheckCircle className="mr-2 h-4 w-4" />
                Create Campaign
              </Button>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}