import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Phone, Users, X } from "lucide-react";

export function CrisisMode() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEmergencyAction = (action: string) => {
    console.log(`Emergency action: ${action}`);
    setIsModalOpen(false);
  };

  return (
    <>
      <Card className="border-crisis/20 bg-crisis-light shadow-crisis">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-crisis">
            <AlertTriangle className="h-5 w-5" />
            Crisis Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            If you're experiencing a mental health crisis or having thoughts of self-harm, 
            immediate help is available.
          </p>
          
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-crisis hover:bg-crisis/90 text-white font-semibold py-3 animate-pulse-glow"
            size="lg"
          >
            <AlertTriangle className="mr-2 h-5 w-5" />
            Get Immediate Help
          </Button>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Available 24/7</p>
            <p>• Confidential support</p>
            <p>• Professional counselors</p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-crisis">
              <AlertTriangle className="h-5 w-5" />
              Crisis Support Options
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Choose the type of immediate support you need:
            </p>
            
            <div className="grid gap-3">
              <Button
                onClick={() => handleEmergencyAction("Call Helpline")}
                className="w-full justify-start bg-crisis hover:bg-crisis/90 text-white"
                size="lg"
              >
                <Phone className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Call Crisis Helpline</div>
                  <div className="text-xs opacity-90">24/7 professional support</div>
                </div>
              </Button>

              <Button
                onClick={() => handleEmergencyAction("Alert Staff")}
                variant="outline"
                className="w-full justify-start border-crisis text-crisis hover:bg-crisis-light"
                size="lg"
              >
                <Users className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Alert Campus Staff</div>
                  <div className="text-xs opacity-70">Notify counseling center</div>
                </div>
              </Button>

              <Button
                onClick={() => setIsModalOpen(false)}
                variant="ghost"
                className="w-full"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>

            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Emergency:</strong> If this is a life-threatening emergency, 
                please call 911 immediately or go to your nearest emergency room.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}