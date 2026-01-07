import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { UploadDialog } from "@/components/upload/UploadDialog";
import { FileManager } from "@/components/upload/FileManager";
import { FileMetadata, s3Service } from "@/lib/s3Service";
import { lambdaService } from "@/lib/lambdaService";
import { authService } from "@/lib/authService";
import { dynamoService } from "@/lib/dynamoService";
import { useLocation, Link } from "react-router-dom"; // Added useLocation and Link import
import {
  Cloud,
  Upload,
  Search,
  Grid3X3,
  List,
  Download,
  Share2,
  MoreHorizontal,
  FolderPlus,
  FolderOpen,
  Filter,
  SortDesc,
  File,
  Folder,
  Image,
  FileText,
  Video,
  Music,
  Archive,
  Trash2,
  X,
  Plus,
  Lock,
  Unlock,
  Star,
  AlertTriangle,
  Shield,
  Eye,
  EyeOff,
  Clock,
  PieChart,
  Activity,
  ArrowUpRight,
  MoreVertical,
  LogOut
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface FileItem {
  id: number;
  name: string;
  type: string;
  size: string;
  modified: string;
  icon: any;
  thumbnail?: string;
  folder?: string;
  tags?: string[];
  confidentiality: 'public' | 'internal' | 'confidential' | 'restricted';
  importance: 'low' | 'medium' | 'high' | 'critical';
  allowSharing: boolean;
  isUploading?: boolean;
  uploadProgress?: number;
  allowedFileTypes?: string[]; // For folders only
  s3FolderId?: string; // S3 folder ID for deletion
}

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolder, setCurrentFolder] = useState<string>('Root');
  const [folderPath, setFolderPath] = useState<string[]>(['Root']);
  const [files, setFiles] = useState<FileItem[]>([]);

  // State for modals and functionality
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolderFileTypes, setSelectedFolderFileTypes] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadFolder, setUploadFolder] = useState(currentFolder);
  const [uploadTags, setUploadTags] = useState<string[]>([]);
  const [uploadConfidentiality, setUploadConfidentiality] = useState<'public' | 'internal' | 'confidential' | 'restricted'>('internal');
  const [uploadImportance, setUploadImportance] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [allowSharing, setAllowSharing] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  // Location based view logic
  const location = useLocation();
  const isOverview = location.pathname === '/dashboard';
  const showHero = isOverview && currentFolder === 'Root';

  // Update upload folder when current folder changes
  useEffect(() => {
    setUploadFolder(currentFolder);
  }, [currentFolder]);

  // Load folders from DynamoDB when component mounts
  useEffect(() => {
    const loadFoldersFromDynamoDB = async () => {
      try {
        const result = await dynamoService.getAllFolders();
        if (result.success && result.folders) {
          // Filter folders for current folder context
          const currentFolderId = currentFolder === 'Root' ? undefined : currentFolder;
          const relevantFolders = result.folders.filter((folder: any) =>
            currentFolderId ? folder.parentId === currentFolderId : !folder.parentId
          );

          const dynamoFolders: FileItem[] = relevantFolders.map((folder: any) => ({
            id: folder.id,
            name: folder.name,
            type: "folder",
            size: "0 files",
            modified: new Date(folder.createdAt).toLocaleDateString(),
            icon: Folder,
            folder: currentFolder,
            tags: [],
            confidentiality: folder.confidentiality || "internal",
            importance: folder.importance || "medium",
            allowSharing: folder.allowSharing !== false,
            allowedFileTypes: folder.allowedFileTypes || ['all'],
            s3FolderId: folder.id
          }));

          setFiles(prev => {
            // Remove existing folders for current folder
            const filteredFiles = prev.filter(f => !(f.type === 'folder' && f.folder === currentFolder));
            // Add new folders, but check for duplicates by name and folder context
            const existingFolderNames = new Set(
              filteredFiles
                .filter(f => f.type === 'folder' && f.folder === currentFolder)
                .map(f => f.name)
            );

            const newUniqueFolders = dynamoFolders.filter(folder =>
              !existingFolderNames.has(folder.name)
            );

            return [...filteredFiles, ...newUniqueFolders];
          });
        }
      } catch (error) {
        console.error('Failed to load folders from DynamoDB:', error);
      }
    };

    loadFoldersFromDynamoDB();
  }, [currentFolder]);

  // Clean up any existing duplicates on component mount
  useEffect(() => {
    setFiles(prev => {
      // Remove duplicate folders by name and folder context
      const seen = new Set();
      return prev.filter(file => {
        if (file.type === 'folder') {
          const key = `${file.name}-${file.folder}`;
          if (seen.has(key)) {
            return false; // Remove duplicate
          }
          seen.add(key);
        }
        return true;
      });
    });
  }, []); // Run only once on mount

  // Filter files and folders based on current folder
  const getCurrentFolderFiles = () => {
    return files.filter(file => file.folder === currentFolder && file.type !== 'folder');
  };

  const getCurrentFolderFolders = () => {
    return files.filter(file => file.type === 'folder' && file.folder === currentFolder);
  };

  // Get recent files across all folders
  const getRecentFiles = () => {
    return files
      .filter(file => file.type !== 'folder')
      .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())
      .slice(0, 5);
  };

  // Get storage stats
  const getStorageStats = () => {
    const totalSize = 15; // GB (mock limit)
    const usedSize = 2.4; // GB (mock usage)

    // Calculate breakdown by type
    const breakdown = {
      image: 35,
      video: 25,
      document: 20,
      other: 20
    };

    return { totalSize, usedSize, breakdown };
  };

  const storageStats = getStorageStats();

  const availableFileTypes = [
    { value: 'all', label: 'All Files', icon: File },
    { value: 'image', label: 'Images', icon: Image },
    { value: 'video', label: 'Videos', icon: Video },
    { value: 'audio', label: 'Audio', icon: Music },
    { value: 'pdf', label: 'PDFs', icon: FileText },
    { value: 'text', label: 'Text Files', icon: FileText },
    { value: 'archive', label: 'Archives', icon: Archive },
    { value: 'document', label: 'Documents', icon: FileText },
    { value: 'spreadsheet', label: 'Spreadsheets', icon: FileText }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'folder': return Folder;
      case 'image': return Image;
      case 'video': return Video;
      case 'audio': return Music;
      case 'pdf': return FileText;
      case 'text': return FileText;
      case 'archive': return Archive;
      default: return File;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'folder': return 'text-blue-600';
      case 'image': return 'text-green-600';
      case 'video': return 'text-purple-600';
      case 'audio': return 'text-orange-600';
      case 'pdf': return 'text-red-600';
      case 'text': return 'text-gray-600';
      case 'archive': return 'text-yellow-600';
      default: return 'text-gray-500';
    }
  };

  const handleDelete = async (fileName: string, fileId?: number, isFolder: boolean = false) => {
    try {
      if (isFolder) {
        // Find the folder in the files array to get its details
        const folder = files.find(f => f.name === fileName && f.type === 'folder');
        if (folder && folder.s3FolderId) {
          // Delete folder from DynamoDB
          const result = await dynamoService.deleteFolder(folder.s3FolderId);

          if (result.success) {
            // Remove from local state
            setFiles(prev => prev.filter(f => f.id !== folder.id));
            toast({
              title: "Folder deleted",
              description: `${fileName} folder has been deleted from DynamoDB`,
            });
          } else {
            toast({
              title: "Error",
              description: result.error || "Failed to delete folder",
              variant: "destructive",
            });
          }
        }
      } else {
        // For files, just show the trash message for now
        toast({
          title: "Moved to trash",
          description: `${fileName} has been moved to trash`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  // Helper functions
  const getConfidentialityColor = (level: string) => {
    switch (level) {
      case 'public': return 'bg-green-100 text-green-800';
      case 'internal': return 'bg-blue-100 text-blue-800';
      case 'confidential': return 'bg-yellow-100 text-yellow-800';
      case 'restricted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImportanceColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // File operations
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a folder name",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create folder using DynamoDB service (mocked locally)
      const result = await dynamoService.createFolder({
        name: newFolderName,
        parentId: currentFolder === 'Root' ? undefined : currentFolder,
        allowedFileTypes: selectedFolderFileTypes.length > 0 ? selectedFolderFileTypes : ['all'],
        confidentiality: 'internal',
        importance: 'medium',
        allowSharing: true,
      });

      if (result.success && result.folder) {
        setNewFolderName('');
        setSelectedFolderFileTypes([]);
        setShowCreateFolder(false);

        // Refresh folders from DynamoDB
        const refreshResult = await dynamoService.getAllFolders();
        if (refreshResult.success && refreshResult.folders) {
          const currentFolderId = currentFolder === 'Root' ? undefined : currentFolder;
          const relevantFolders = refreshResult.folders.filter((folder: any) =>
            currentFolderId ? folder.parentId === currentFolderId : !folder.parentId
          );

          const dynamoFolders: FileItem[] = relevantFolders.map((folder: any) => ({
            id: folder.id,
            name: folder.name,
            type: "folder",
            size: "0 files",
            modified: new Date(folder.createdAt).toLocaleDateString(),
            icon: Folder,
            folder: currentFolder,
            tags: [],
            confidentiality: folder.confidentiality || "internal",
            importance: folder.importance || "medium",
            allowSharing: folder.allowSharing !== false,
            allowedFileTypes: folder.allowedFileTypes || ['all'],
            s3FolderId: folder.id
          }));

          setFiles(prev => {
            const filteredFiles = prev.filter(f => !(f.type === 'folder' && f.folder === currentFolder));
            return [...filteredFiles, ...dynamoFolders];
          });
        }

        const fileTypesText = selectedFolderFileTypes.length > 0
          ? ` for ${selectedFolderFileTypes.join(', ')} files`
          : ' for all file types';

        toast({
          title: "Folder created",
          description: `"${newFolderName}" folder has been created${fileTypesText}`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create folder",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create folder",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
    setShowUploadModal(true);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);

    try {
      // Upload files to S3
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const newFile: FileItem = {
          id: Date.now() + i,
          name: file.name,
          type: file.type.split('/')[0] || 'file',
          size: formatFileSize(file.size),
          modified: "Just now",
          icon: getFileIcon(file.type.split('/')[0] || 'file'),
          folder: uploadFolder,
          tags: uploadTags,
          confidentiality: uploadConfidentiality,
          importance: uploadImportance,
          allowSharing: allowSharing,
          isUploading: true,
          uploadProgress: 0
        };

        setFiles(prev => [newFile, ...prev]);

        // Upload to S3 with progress tracking
        const uploadOptions = {
          folderId: uploadFolder === 'Root' ? undefined : uploadFolder,
          tags: uploadTags,
          confidentiality: uploadConfidentiality,
          importance: uploadImportance,
          allowSharing: allowSharing,
          onProgress: (progress: any) => {
            setFiles(prev => prev.map(f =>
              f.id === newFile.id ? { ...f, uploadProgress: progress.percentage } : f
            ));
          },
        };

        const result = await s3Service.uploadFile(file, uploadOptions);

        if (result.success) {
          // Mark upload as complete
          setFiles(prev => prev.map(f =>
            f.id === newFile.id ? { ...f, isUploading: false, uploadProgress: undefined } : f
          ));
        } else {
          // Mark upload as failed
          setFiles(prev => prev.map(f =>
            f.id === newFile.id ? {
              ...f,
              isUploading: false,
              uploadProgress: undefined,
              // You could add an error state here
            } : f
          ));
        }
      }

      setIsUploading(false);
      setSelectedFiles([]);
      setShowUploadModal(false);

      toast({
        title: "Upload complete",
        description: `${selectedFiles.length} file(s) uploaded successfully`,
      });
    } catch (error: any) {
      setIsUploading(false);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload files",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleTagToggle = (tag: string) => {
    setUploadTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleFolderFileTypeToggle = (fileType: string) => {
    setSelectedFolderFileTypes(prev =>
      prev.includes(fileType)
        ? prev.filter(t => t !== fileType)
        : [...prev, fileType]
    );
  };

  // Folder navigation functions
  const handleFolderClick = (folderName: string) => {
    // Don't navigate if we're already in this folder
    if (currentFolder === folderName) {
      return;
    }

    setCurrentFolder(folderName);
    setFolderPath(prev => [...prev, folderName]);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newPath = folderPath.slice(0, index + 1);
    setFolderPath(newPath);
    setCurrentFolder(newPath[newPath.length - 1]);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-full overflow-hidden min-w-0">
      {/* View Toggle Logic (Hidden in UI but logic remaining) */}
      {showHero && (
        <div className="flex flex-col gap-6">
          {/* Folder Breadcrumb & Title for Overview */}
          <div className="flex flex-col space-y-1">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground">Welcome back to your secure cloud storage.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            {/* Storage Breakdown Card */}
            <Card className="lg:col-span-2 shadow-sm border-border/50 bg-gradient-to-br from-card to-secondary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  Storage Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-3xl font-bold">{storageStats.usedSize} GB</span>
                      <span className="text-muted-foreground ml-2">used of {storageStats.totalSize} GB</span>
                    </div>
                    <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                      Pro Plan
                    </Badge>
                  </div>

                  {/* Main Progress Bar */}
                  <div className="h-4 w-full bg-secondary rounded-full overflow-hidden flex">
                    <div style={{ width: `${storageStats.breakdown.image}%` }} className="h-full bg-blue-500" />
                    <div style={{ width: `${storageStats.breakdown.video}%` }} className="h-full bg-purple-500" />
                    <div style={{ width: `${storageStats.breakdown.document}%` }} className="h-full bg-orange-500" />
                    <div style={{ width: `${storageStats.breakdown.other}%` }} className="h-full bg-gray-500" />
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Images</span>
                        <span className="text-xs text-muted-foreground">{storageStats.breakdown.image}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Videos</span>
                        <span className="text-xs text-muted-foreground">{storageStats.breakdown.video}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Docs</span>
                        <span className="text-xs text-muted-foreground">{storageStats.breakdown.document}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-500" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Other</span>
                        <span className="text-xs text-muted-foreground">{storageStats.breakdown.other}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="shadow-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-3">
                <Button onClick={() => fileInputRef.current?.click()} className="w-full justify-start text-left h-auto py-3">
                  <div className="bg-primary/10 p-2 rounded-full mr-3 text-primary">
                    <Upload className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">Upload File</div>
                    <div className="text-xs font-normal opacity-80">Add new content</div>
                  </div>
                </Button>

                <Button variant="outline" onClick={() => setShowCreateFolder(true)} className="w-full justify-start text-left h-auto py-3">
                  <div className="bg-blue-500/10 p-2 rounded-full mr-3 text-blue-600">
                    <FolderPlus className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">New Folder</div>
                    <div className="text-xs text-muted-foreground font-normal">Organize your files</div>
                  </div>
                </Button>

                <Button variant="ghost" className="w-full justify-between text-muted-foreground hover:text-foreground">
                  <span className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Starred Files
                  </span>
                  <ArrowUpRight className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="space-y-4">
        {/* Navigation & Controls - Conditionally Rendered or Adjusted */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center justify-between w-full">
            {!isOverview ? (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  {folderPath.map((folder, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {index > 0 && <span className="text-muted-foreground/40">/</span>}
                      <button
                        onClick={() => handleBreadcrumbClick(index)}
                        className={`hover:text-primary transition-colors ${index === folderPath.length - 1
                          ? 'font-medium text-foreground cursor-default pointer-events-none'
                          : ''
                          }`}
                      >
                        {folder}
                      </button>
                    </div>
                  ))}
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {currentFolder}
                </h1>
              </>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Folders</h2>
                </div>

                <div className="flex items-center gap-4">
                  {/* View Toggle for Folders Section */}
                  <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
                    <Button
                      variant={viewMode === 'grid' ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="h-8 w-8 p-0"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="h-8 w-8 p-0"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>

                  <Link to="/dashboard/files" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                    View All <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {!isOverview && (
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  className="pl-9 w-[200px] bg-background/50 h-9 rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Content Display */}
        <div className="min-h-[300px]">
          {/* Folders Section (Overview) */}
          {isOverview && (
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-full overflow-hidden">
              {getCurrentFolderFolders().length > 0 ? (
                viewMode === 'grid' ? (
                  // Horizontal Scroll Grid View - Left aligned like list view
                  <div className="flex overflow-x-auto pb-4 gap-4 snap-x scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40 scrollbar-track-transparent w-full">
                    {getCurrentFolderFolders().map((folder) => (
                      <div
                        key={folder.id}
                        onClick={() => handleFolderClick(folder.name)}
                        className="flex-none w-[160px] md:w-[200px] snap-start group relative border rounded-xl p-4 cursor-pointer hover:border-primary/50 hover:bg-muted/20 transition-all duration-200 flex flex-col items-start text-left gap-3 bg-card shadow-sm"
                      >
                        <Folder className="h-10 w-10 text-blue-500 fill-blue-500/20 group-hover:scale-110 transition-transform duration-300" />
                        <div className="min-w-0 w-full">
                          <p className="font-medium truncate text-sm">{folder.name}</p>
                          <p className="text-xs text-muted-foreground">{folder.modified}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Vertical List View
                  <div className="flex flex-col gap-2">
                    {getCurrentFolderFolders().map((folder) => (
                      <div
                        key={folder.id}
                        onClick={() => handleFolderClick(folder.name)}
                        className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors shadow-sm cursor-pointer group"
                      >
                        <Folder className="h-8 w-8 text-blue-500 fill-blue-500/20" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{folder.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{folder.modified}</span>
                            <span>•</span>
                            <span>{folder.size || "0 items"}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed rounded-xl">
                  <div className="bg-muted/30 p-4 rounded-full mb-3">
                    <FolderPlus className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">No folders yet</p>
                  <Button variant="outline" size="sm" onClick={() => setShowCreateFolder(true)}>
                    Create Folder
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Files & Folders (Only when NOT Overview) */}
          {!isOverview && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              {/* Folders List (if any) */}
              {getCurrentFolderFolders().length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <Folder className="h-4 w-4" /> Folders
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {getCurrentFolderFolders().map((folder) => (
                      <div
                        key={folder.id}
                        onClick={() => handleFolderClick(folder.name)}
                        className="group relative border rounded-xl p-4 cursor-pointer hover:border-primary/50 hover:bg-muted/20 transition-all duration-200 flex flex-col items-center text-center gap-3 aspect-square justify-center bg-card shadow-sm"
                      >
                        <Folder className="h-10 w-10 text-blue-500 fill-blue-500/20 group-hover:scale-110 transition-transform duration-300" />
                        <div className="min-w-0 w-full">
                          <p className="font-medium truncate text-sm">{folder.name}</p>
                          <p className="text-xs text-muted-foreground">{folder.size || "Empty"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Files List */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Files
                </h3>
                {getCurrentFolderFiles().length > 0 ? (
                  viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {getCurrentFolderFiles().map((file) => {
                        const Icon = file.icon;
                        return (
                          <Card key={file.id} className="group relative overflow-hidden transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
                            <div className="p-4 flex flex-col items-center gap-3 text-center aspect-[4/5] justify-center">
                              <div className={`p-3 rounded-xl bg-muted/50 ${getFileTypeColor(file.type)} group-hover:scale-110 transition-transform duration-300`}>
                                <Icon className="h-8 w-8" />
                              </div>
                              <div className="min-w-0 w-full space-y-1">
                                <p className="font-medium truncate text-sm">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{file.size} • {file.modified}</p>
                              </div>
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Download className="mr-2 h-4 w-4" /> Download
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Share2 className="mr-2 h-4 w-4" /> Share
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {getCurrentFolderFiles().map((file) => {
                        const Icon = file.icon;
                        return (
                          <div key={file.id} className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors shadow-sm group">
                            <div className={`p-2 rounded-lg bg-muted/50 ${getFileTypeColor(file.type)}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0 grid grid-cols-12 gap-4 items-center">
                              <div className="col-span-6 md:col-span-4">
                                <p className="font-medium truncate text-sm">{file.name}</p>
                              </div>
                              <div className="col-span-3 hidden md:block text-sm text-muted-foreground">
                                {file.modified}
                              </div>
                              <div className="col-span-3 hidden md:block text-sm text-muted-foreground">
                                {file.size}
                              </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Download className="mr-2 h-4 w-4" /> Download
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Share2 className="mr-2 h-4 w-4" /> Share
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : (
                  getCurrentFolderFolders().length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl">
                      <div className="bg-muted/30 p-4 rounded-full mb-3">
                        <Upload className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                      <p className="text-muted-foreground text-sm mb-4">This folder is empty</p>
                      <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
                        Upload File
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={handleFileSelect}
      />

      {/* Dialogs */}
      <Dialog open={showCreateFolder} onOpenChange={setShowCreateFolder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Folder Name</Label>
              <Input
                id="name"
                placeholder="e.g. Projects"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateFolder(false)}>Cancel</Button>
            <Button onClick={handleCreateFolder}>Create Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}