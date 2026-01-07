import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Download,
  Link2,
  Calendar,
  Users,
  MoreHorizontal,
  Copy,
  Share2,
  Trash2,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  File,
  Plus,
  Send,
  Clock,
  TrendingUp,
  ExternalLink,
  RefreshCw,
  Grid3X3,
  List,
  ArrowUpRight,
  Sparkles
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Link } from "react-router-dom";

interface SharedTransfer {
  id: string;
  name: string;
  files: Array<{
    name: string;
    type: string;
    size: string;
  }>;
  recipients: string[];
  message?: string;
  createdAt: string;
  expiresAt: string;
  downloads: number;
  maxDownloads?: number;
  status: 'active' | 'expired' | 'deleted';
  shareLink: string;
}

export default function SharedFiles() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const { toast } = useToast();

  // Mock shared transfers data
  const sharedTransfers: SharedTransfer[] = [
    {
      id: '1',
      name: 'Project Assets',
      files: [
        { name: 'design-mockups.figma', type: 'application/figma', size: '12.4 MB' },
        { name: 'logo-variants.zip', type: 'application/zip', size: '8.2 MB' },
        { name: 'brand-guidelines.pdf', type: 'application/pdf', size: '3.1 MB' }
      ],
      recipients: ['john@company.com', 'sarah@agency.com'],
      message: 'Here are the latest design assets for the project.',
      createdAt: '2024-01-15T10:30:00Z',
      expiresAt: '2024-01-22T10:30:00Z',
      downloads: 3,
      maxDownloads: 10,
      status: 'active',
      shareLink: 'https://cloudvault.app/share/abc123def456'
    },
    {
      id: '2',
      name: 'Presentation Materials',
      files: [
        { name: 'quarterly-review.pptx', type: 'application/vnd.ms-powerpoint', size: '45.2 MB' },
        { name: 'charts-data.xlsx', type: 'application/vnd.ms-excel', size: '2.8 MB' }
      ],
      recipients: ['team@company.com'],
      createdAt: '2024-01-10T14:20:00Z',
      expiresAt: '2024-01-17T14:20:00Z',
      downloads: 8,
      status: 'active',
      shareLink: 'https://cloudvault.app/share/xyz789ghi012'
    },
    {
      id: '3',
      name: 'Media Package',
      files: [
        { name: 'product-video.mp4', type: 'video/mp4', size: '156.7 MB' },
        { name: 'product-images.zip', type: 'application/zip', size: '89.3 MB' }
      ],
      recipients: ['marketing@company.com', 'pr@agency.com', 'social@company.com'],
      message: 'Latest product media assets for the campaign launch.',
      createdAt: '2024-01-05T09:15:00Z',
      expiresAt: '2024-01-05T09:15:00Z',
      downloads: 12,
      status: 'expired',
      shareLink: 'https://cloudvault.app/share/def456ghi789'
    }
  ];

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return Image;
    if (type.includes('video')) return Video;
    if (type.includes('audio')) return Music;
    if (type.includes('pdf') || type.includes('document') || type.includes('presentation') || type.includes('excel')) return FileText;
    if (type.includes('zip') || type.includes('rar')) return Archive;
    return File;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilExpiry = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const copyShareLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied!",
      description: "Share link copied to clipboard",
    });
  };

  const activeTransfers = sharedTransfers.filter(t => t.status === 'active');
  const expiredTransfers = sharedTransfers.filter(t => t.status === 'expired');
  const allTransfers = sharedTransfers;
  const totalDownloads = sharedTransfers.reduce((sum, t) => sum + t.downloads, 0);
  const totalRecipients = sharedTransfers.reduce((sum, t) => sum + t.recipients.length, 0);

  // Stats data
  const stats = [
    {
      label: 'Total Transfers',
      value: allTransfers.length,
      icon: Send,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Active Links',
      value: activeTransfers.length,
      icon: Link2,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Total Downloads',
      value: totalDownloads,
      icon: Download,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Recipients',
      value: totalRecipients,
      icon: Users,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
  ];

  const renderTransferCard = (transfer: SharedTransfer) => {
    const daysLeft = getDaysUntilExpiry(transfer.expiresAt);
    const isExpiringSoon = daysLeft <= 2 && daysLeft > 0;

    return (
      <Card
        key={transfer.id}
        className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 ${transfer.status === 'expired' ? 'opacity-70 bg-muted/20' : 'bg-card'
          }`}
      >
        {/* Status Indicator Line */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${transfer.status === 'active'
            ? isExpiringSoon ? 'bg-orange-500' : 'bg-green-500'
            : 'bg-gray-400'
          }`} />

        <CardHeader className="pb-3 pt-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg truncate">{transfer.name}</h3>
                <Badge
                  variant={transfer.status === 'active' ? 'default' : 'secondary'}
                  className={`shrink-0 ${transfer.status === 'active'
                      ? 'bg-green-500/15 text-green-600 border-green-500/30 hover:bg-green-500/20'
                      : 'bg-gray-500/15 text-gray-500'
                    }`}
                >
                  {transfer.status === 'active' ? 'Active' : 'Expired'}
                </Badge>
              </div>

              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(transfer.createdAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-blue-500" />
                  <span className="font-medium text-foreground">{transfer.recipients.length}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5 text-purple-500" />
                  <span className="font-medium text-foreground">{transfer.downloads}</span>
                  {transfer.maxDownloads && (
                    <span className="text-muted-foreground/60">/ {transfer.maxDownloads}</span>
                  )}
                </span>
              </div>
            </div>

            {/* Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => copyShareLink(transfer.shareLink)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Link
                </DropdownMenuItem>
                {transfer.status === 'active' && (
                  <DropdownMenuItem>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Extend Expiry
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Transfer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Files Preview */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {transfer.files.slice(0, 4).map((file, index) => {
                const IconComponent = getFileIcon(file.type);
                return (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-lg bg-muted border-2 border-background flex items-center justify-center shadow-sm"
                  >
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                  </div>
                );
              })}
              {transfer.files.length > 4 && (
                <div className="w-8 h-8 rounded-lg bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-semibold text-primary">
                  +{transfer.files.length - 4}
                </div>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {transfer.files.length} {transfer.files.length === 1 ? 'file' : 'files'}
            </span>
          </div>

          {/* Share Link */}
          <div className="flex items-center gap-2 p-3 bg-muted/40 rounded-lg border border-border/50 group/link hover:bg-muted/60 transition-colors">
            <Link2 className="h-4 w-4 text-primary shrink-0" />
            <code className="flex-1 text-xs font-mono text-muted-foreground truncate">
              {transfer.shareLink.replace('https://', '')}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyShareLink(transfer.shareLink)}
              className="h-7 w-7 p-0 opacity-0 group-hover/link:opacity-100 transition-opacity hover:bg-primary/10"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Expiry Footer */}
          <div className={`flex items-center gap-2 text-xs ${transfer.status === 'expired'
              ? 'text-gray-500'
              : isExpiringSoon
                ? 'text-orange-600'
                : 'text-muted-foreground'
            }`}>
            <Clock className="h-3.5 w-3.5" />
            {transfer.status === 'expired' ? (
              <span>Expired on {formatDate(transfer.expiresAt)}</span>
            ) : isExpiringSoon ? (
              <span className="font-medium">Expires in {daysLeft} {daysLeft === 1 ? 'day' : 'days'}</span>
            ) : (
              <span>Expires {formatDate(transfer.expiresAt)}</span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderEmptyState = (type: 'active' | 'expired' | 'all') => {
    const configs = {
      active: {
        icon: Send,
        title: 'No Active Transfers',
        description: 'Share files securely with anyone. Create your first transfer to get started.',
        action: 'Create Transfer'
      },
      expired: {
        icon: Clock,
        title: 'No Expired Transfers',
        description: 'Your expired file transfers will appear here for reference.',
        action: null
      },
      all: {
        icon: Share2,
        title: 'No Transfers Yet',
        description: 'Start sharing files securely with expiring links.',
        action: 'Create Transfer'
      }
    };

    const config = configs[type];
    const Icon = config.icon;

    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
          <Icon className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{config.title}</h3>
        <p className="text-muted-foreground max-w-sm mb-6">{config.description}</p>
        {config.action && (
          <Button asChild>
            <Link to="/dashboard/share" className="gap-2">
              <Plus className="h-4 w-4" />
              {config.action}
            </Link>
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-full overflow-hidden min-w-0">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-purple-500/5 border p-6 md:p-8">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Share2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Shared Files</h1>
              <p className="text-muted-foreground mt-1">Manage your file transfers and shared links</p>
            </div>
          </div>
          <Button asChild size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-shadow">
            <Link to="/dashboard/share">
              <Plus className="h-4 w-4" />
              New Transfer
              <ArrowUpRight className="h-4 w-4 ml-1 opacity-50" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search, View Toggle & Tabs */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transfers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/30 border-border/50 focus:bg-background transition-colors"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50 border">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="active" className="gap-2 data-[state=active]:bg-background">
              <Sparkles className="h-3.5 w-3.5" />
              Active
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {activeTransfers.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="expired" className="gap-2 data-[state=active]:bg-background">
              <Clock className="h-3.5 w-3.5" />
              Expired
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {expiredTransfers.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-2 data-[state=active]:bg-background">
              All
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {allTransfers.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            {activeTransfers.length > 0 ? (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
                : 'flex flex-col gap-4'
              }>
                {activeTransfers.map(renderTransferCard)}
              </div>
            ) : (
              renderEmptyState('active')
            )}
          </TabsContent>

          <TabsContent value="expired" className="mt-6">
            {expiredTransfers.length > 0 ? (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
                : 'flex flex-col gap-4'
              }>
                {expiredTransfers.map(renderTransferCard)}
              </div>
            ) : (
              renderEmptyState('expired')
            )}
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            {allTransfers.length > 0 ? (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
                : 'flex flex-col gap-4'
              }>
                {allTransfers.map(renderTransferCard)}
              </div>
            ) : (
              renderEmptyState('all')
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}