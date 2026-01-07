import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { dynamoService } from "@/lib/dynamoService";
import { authService } from "@/lib/authService";
import { lambdaService } from "@/lib/lambdaService";
import {
  Folder,
  FolderPlus,
  MoreHorizontal,
  FolderOpen,
  Share2,
  Trash2,
  Lock,
  Search,
  Grid3X3,
  List,
  RefreshCw,
  Plus,
  ArrowUpRight,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  File,
  Clock,
  Users,
  Shield,
  Star,
  ChevronRight
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string;
  folder: string;
  tags: string[];
  confidentiality: 'public' | 'internal' | 'confidential';
  importance: 'low' | 'medium' | 'high';
  allowSharing: boolean;
  allowedFileTypes?: string[];
  s3FolderId?: string;
  fileCount?: number;
}

export default function Folders() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderFileTypes, setNewFolderFileTypes] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const availableFileTypes = [
    'all', 'documents', 'images', 'videos', 'audio', 'archives', 'code', 'data'
  ];

  // Stats calculation
  const totalFolders = files.length;
  const sharedFolders = files.filter(f => f.allowSharing).length;
  const privateFolders = files.filter(f => !f.allowSharing).length;
  const confidentialFolders = files.filter(f => f.confidentiality === 'confidential').length;

  const stats = [
    { label: 'Total Folders', value: totalFolders, icon: Folder, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { label: 'Shared', value: sharedFolders, icon: Share2, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { label: 'Private', value: privateFolders, icon: Lock, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
    { label: 'Confidential', value: confidentialFolders, icon: Shield, color: 'text-red-500', bgColor: 'bg-red-500/10' },
  ];

  // Load all folders from DynamoDB
  const loadFolders = async () => {
    setIsRefreshing(true);
    try {
      const result = await dynamoService.getAllFolders();
      if (result.success && result.folders) {
        const folderItems: FileItem[] = result.folders.map((folder) => ({
          id: folder.id,
          name: folder.name,
          type: 'folder',
          size: '0 files',
          modified: new Date(folder.createdAt).toLocaleDateString(),
          folder: folder.parentId ? 'Subfolder' : 'Root',
          tags: [],
          confidentiality: folder.confidentiality,
          importance: folder.importance,
          allowSharing: folder.allowSharing,
          allowedFileTypes: folder.allowedFileTypes,
          s3FolderId: folder.id,
          fileCount: Math.floor(Math.random() * 25) // Mock file count
        }));
        setFiles(folderItems);
      }
    } catch (error) {
      console.error('Error loading folders:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadFolders();
  }, []);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast({ title: "Error", description: "Please enter a folder name", variant: "destructive" });
      return;
    }

    try {
      const result = await dynamoService.createFolder({
        name: newFolderName.trim(),
        parentId: undefined,
        allowedFileTypes: newFolderFileTypes.length > 0 ? newFolderFileTypes : ['all'],
        confidentiality: 'internal',
        importance: 'low',
        allowSharing: true,
      });

      if (result.success) {
        await loadFolders();
        setNewFolderName("");
        setNewFolderFileTypes([]);
        setShowCreateFolderModal(false);
        toast({ title: "Success", description: "Folder created successfully" });
      } else {
        toast({ title: "Error", description: result.error || "Failed to create folder", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create folder", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await dynamoService.deleteFolder(id);
      if (result.success) {
        setFiles(prev => prev.filter(file => file.id !== id));
        toast({ title: "Success", description: "Folder deleted successfully" });
      } else {
        toast({ title: "Error", description: result.error || "Failed to delete folder", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete folder", variant: "destructive" });
    }
  };

  const getConfidentialityConfig = (level: string) => {
    switch (level) {
      case 'public': return { color: 'text-green-600', bg: 'bg-green-500/10', border: 'border-green-500/20' };
      case 'internal': return { color: 'text-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
      case 'confidential': return { color: 'text-red-600', bg: 'bg-red-500/10', border: 'border-red-500/20' };
      default: return { color: 'text-gray-600', bg: 'bg-gray-500/10', border: 'border-gray-500/20' };
    }
  };

  const getImportanceConfig = (level: string) => {
    switch (level) {
      case 'low': return { color: 'text-gray-600', bg: 'bg-gray-500/10' };
      case 'medium': return { color: 'text-yellow-600', bg: 'bg-yellow-500/10' };
      case 'high': return { color: 'text-red-600', bg: 'bg-red-500/10' };
      default: return { color: 'text-gray-600', bg: 'bg-gray-500/10' };
    }
  };

  const getFileTypeIcon = (types: string[] | undefined) => {
    if (!types || types.includes('all')) return File;
    if (types.includes('images')) return Image;
    if (types.includes('videos')) return Video;
    if (types.includes('audio')) return Music;
    if (types.includes('documents')) return FileText;
    if (types.includes('archives')) return Archive;
    return File;
  };

  const filteredFolders = files.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-full overflow-hidden min-w-0">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/5 via-blue-500/10 to-indigo-500/5 border p-6 md:p-8">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Folder className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Folders</h1>
              <p className="text-muted-foreground mt-1">Organize and manage your file folders</p>
            </div>
          </div>
          <Button onClick={() => setShowCreateFolderModal(true)} size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-shadow">
            <Plus className="h-4 w-4" />
            New Folder
            <ArrowUpRight className="h-4 w-4 ml-1 opacity-50" />
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

      {/* Search & Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search folders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/30 border-border/50 focus:bg-background transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadFolders}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50 border">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Folders Content */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">All Folders</h2>
            <p className="text-sm text-muted-foreground">{filteredFolders.length} folder{filteredFolders.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {filteredFolders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
              <FolderPlus className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No folders yet</h3>
            <p className="text-muted-foreground max-w-sm mb-6">Create folders to organize your files and keep everything structured.</p>
            <Button onClick={() => setShowCreateFolderModal(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Folder
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredFolders.map((folder) => {
              const confConfig = getConfidentialityConfig(folder.confidentiality);
              const impConfig = getImportanceConfig(folder.importance);
              const FileTypeIcon = getFileTypeIcon(folder.allowedFileTypes);

              return (
                <Card
                  key={folder.id}
                  className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 cursor-pointer"
                >
                  {/* Top indicator */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${folder.confidentiality === 'confidential' ? 'bg-red-500' :
                      folder.confidentiality === 'internal' ? 'bg-blue-500' : 'bg-green-500'
                    }`} />

                  <CardContent className="p-4 pt-5">
                    <div className="flex flex-col items-center text-center space-y-3">
                      {/* Folder Icon */}
                      <div className="relative">
                        <div className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                          <Folder className="h-8 w-8 text-blue-500 fill-blue-500/20" />
                        </div>
                        {!folder.allowSharing && (
                          <div className="absolute -top-1 -right-1 p-1 bg-background rounded-full border shadow-sm">
                            <Lock className="h-3 w-3 text-orange-500" />
                          </div>
                        )}
                      </div>

                      {/* Folder Info */}
                      <div className="w-full space-y-1">
                        <p className="font-medium text-sm truncate" title={folder.name}>{folder.name}</p>
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                          <FileTypeIcon className="h-3 w-3" />
                          <span>{folder.fileCount || 0} files</span>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap items-center justify-center gap-1">
                        <Badge variant="outline" className={`text-xs px-1.5 py-0 ${confConfig.color} ${confConfig.bg} ${confConfig.border}`}>
                          {folder.confidentiality}
                        </Badge>
                        {folder.importance !== 'low' && (
                          <Badge variant="outline" className={`text-xs px-1.5 py-0 ${impConfig.color} ${impConfig.bg}`}>
                            {folder.importance}
                          </Badge>
                        )}
                      </div>

                      {/* Date */}
                      <p className="text-xs text-muted-foreground">{folder.modified}</p>
                    </div>

                    {/* Hover Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>
                          <FolderOpen className="h-4 w-4 mr-2" />
                          Open Folder
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Star className="h-4 w-4 mr-2" />
                          Add to Favorites
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(folder.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFolders.map((folder) => {
              const confConfig = getConfidentialityConfig(folder.confidentiality);
              const FileTypeIcon = getFileTypeIcon(folder.allowedFileTypes);

              return (
                <Card
                  key={folder.id}
                  className="group hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Icon */}
                        <div className="p-2.5 rounded-xl bg-blue-500/10">
                          <Folder className="h-6 w-6 text-blue-500 fill-blue-500/20" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{folder.name}</p>
                            {!folder.allowSharing && <Lock className="h-3.5 w-3.5 text-orange-500 shrink-0" />}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                            <span className="flex items-center gap-1">
                              <FileTypeIcon className="h-3.5 w-3.5" />
                              {folder.fileCount || 0} files
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {folder.modified}
                            </span>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="hidden md:flex items-center gap-2">
                          <Badge variant="outline" className={`${confConfig.color} ${confConfig.bg} ${confConfig.border}`}>
                            {folder.confidentiality}
                          </Badge>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem>
                              <FolderOpen className="h-4 w-4 mr-2" />
                              Open Folder
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(folder.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Folder Dialog */}
      <Dialog open={showCreateFolderModal} onOpenChange={setShowCreateFolderModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FolderPlus className="h-5 w-5 text-blue-500" />
              </div>
              Create New Folder
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="folderName">Folder Name</Label>
              <Input
                id="folderName"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="e.g. Project Documents"
                className="bg-muted/30"
              />
            </div>
            <div className="space-y-2">
              <Label>Allowed File Types</Label>
              <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded-lg border">
                {availableFileTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={newFolderFileTypes.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewFolderFileTypes(prev => [...prev, type]);
                        } else {
                          setNewFolderFileTypes(prev => prev.filter(t => t !== type));
                        }
                      }}
                    />
                    <Label htmlFor={type} className="text-sm capitalize cursor-pointer">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateFolderModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
