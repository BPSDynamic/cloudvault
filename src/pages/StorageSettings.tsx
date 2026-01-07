import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  HardDrive,
  Trash2,
  Archive,
  Zap,
  ArrowUp,
  Folder,
  File,
  Image,
  Video,
  Music
} from "lucide-react";

export default function StorageSettings() {
  const storageBreakdown = [
    {
      type: "Images",
      size: "1.2 GB",
      percentage: 48,
      color: "bg-green-500",
      icon: Image,
    },
    {
      type: "Videos",
      size: "800 MB",
      percentage: 32,
      color: "bg-purple-500",
      icon: Video,
    },
    {
      type: "Documents",
      size: "300 MB",
      percentage: 12,
      color: "bg-blue-500",
      icon: File,
    },
    {
      type: "Audio",
      size: "100 MB",
      percentage: 4,
      color: "bg-orange-500",
      icon: Music,
    },
    {
      type: "Other",
      size: "100 MB",
      percentage: 4,
      color: "bg-gray-500",
      icon: Folder,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Storage Management</h1>
        <p className="text-muted-foreground">Monitor and manage your cloud storage usage.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column (Left - 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Storage Usage Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Storage Usage
              </CardTitle>
              <CardDescription>
                2.5 GB used of 15 GB available
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Used Space</span>
                  <span>2.5 GB / 15 GB</span>
                </div>
                <Progress value={16.7} className="h-3" />
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Storage Breakdown</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {storageBreakdown.map((item) => (
                    <div key={item.type} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{item.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{item.size}</span>
                        <span className="text-xs text-muted-foreground">({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Storage Plans Section */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Storage Plans</h2>
              <p className="text-sm text-muted-foreground">Choose the plan that fits your needs</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <Card className="p-4 flex flex-col">
                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="font-semibold">Basic</h3>
                    <p className="text-2xl font-bold">15 GB</p>
                    <p className="text-sm text-muted-foreground">Free</p>
                  </div>
                  <Badge variant="secondary" className="w-fit">Current Plan</Badge>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• 15 GB storage</li>
                    <li>• Basic file sharing</li>
                    <li>• 30-day version history</li>
                  </ul>
                </div>
              </Card>

              <Card className="p-4 flex flex-col border-primary shadow-md bg-primary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full -mr-10 -mt-10"></div>
                <div className="space-y-3 flex-1 relative">
                  <div>
                    <h3 className="font-semibold text-primary">Pro</h3>
                    <p className="text-2xl font-bold">100 GB</p>
                    <p className="text-sm text-muted-foreground">$9.99/month</p>
                  </div>
                  <Badge className="w-fit bg-primary text-primary-foreground hover:bg-primary/90">Recommended</Badge>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• 100 GB storage</li>
                    <li>• Advanced sharing</li>
                    <li>• 90-day version history</li>
                    <li>• Priority support</li>
                  </ul>
                </div>
                <div className="mt-4 pt-4">
                  <Button className="w-full shadow-sm">Upgrade to Pro</Button>
                </div>
              </Card>

              <Card className="p-4 flex flex-col">
                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="font-semibold">Business</h3>
                    <p className="text-2xl font-bold">1 TB</p>
                    <p className="text-sm text-muted-foreground">$19.99/month</p>
                  </div>
                  <Badge variant="outline" className="w-fit">Enterprise</Badge>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• 1 TB storage</li>
                    <li>• Team collaboration</li>
                    <li>• Unlimited version history</li>
                    <li>• 24/7 support</li>
                    <li>• Advanced security</li>
                  </ul>
                </div>
                <div className="mt-4 pt-4">
                  <Button variant="outline" className="w-full">Contact Sales</Button>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Sidebar Column (Right - 1/3) */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2 h-12">
                <Trash2 className="h-4 w-4" />
                Empty Trash
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 h-12">
                <Archive className="h-4 w-4" />
                Compress Files
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 h-12">
                <Zap className="h-4 w-4" />
                Optimize Storage
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Unlock More Power</CardTitle>
              <CardDescription>
                Get 1TB of storage, advanced security, and 24/7 support.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full gap-2 shadow-lg shadow-primary/25">
                <ArrowUp className="h-4 w-4" />
                Upgrade to Business
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}