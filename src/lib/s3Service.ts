import { authService } from './authService';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  s3Key: string;
  folderId?: string;
  tags?: string[];
  confidentiality?: 'public' | 'internal' | 'confidential' | 'restricted';
  importance?: 'low' | 'medium' | 'high' | 'critical';
  allowSharing?: boolean;
  // Sharing metadata
  shareRecipients?: string[];
  shareMessage?: string;
  shareExpirationDays?: number;
  shareLink?: string;
  shareSender?: {
    name: string;
    surname: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UploadOptions {
  folderId?: string;
  tags?: string[];
  confidentiality?: 'public' | 'internal' | 'confidential' | 'restricted';
  importance?: 'low' | 'medium' | 'high' | 'critical';
  allowSharing?: boolean;
  // Sharing options
  shareRecipients?: string[];
  shareMessage?: string;
  shareExpirationDays?: number;
  shareLink?: string;
  shareSender?: {
    name: string;
    surname: string;
    email: string;
  };
  onProgress?: (progress: UploadProgress) => void;
}

class MockS3Service {
  // Upload file to S3
  async uploadFile(
    file: File,
    options: UploadOptions = {}
  ): Promise<{ success: boolean; fileMetadata?: FileMetadata; error?: string }> {
    const fileMetadata: FileMetadata = {
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      s3Key: `mock-key/${file.name}`,
      folderId: options.folderId,
      tags: options.tags || [],
      confidentiality: options.confidentiality || 'internal',
      importance: options.importance || 'medium',
      allowSharing: options.allowSharing ?? true,
      shareRecipients: options.shareRecipients,
      shareMessage: options.shareMessage,
      shareExpirationDays: options.shareExpirationDays,
      shareLink: options.shareLink,
      shareSender: options.shareSender,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (options.onProgress) {
      options.onProgress({ loaded: file.size, total: file.size, percentage: 100 });
    }

    return {
      success: true,
      fileMetadata,
    };
  }

  // Download file from S3
  async downloadFile(s3Key: string): Promise<{ success: boolean; blob?: Blob; error?: string }> {
    return {
      success: true,
      blob: new Blob(['mock content'], { type: 'text/plain' }),
    };
  }

  // Get file download URL
  async getFileUrl(s3Key: string, expiresIn: number = 86400): Promise<{ success: boolean; url?: string; error?: string }> {
    return {
      success: true,
      url: 'https://via.placeholder.com/150',
    };
  }

  // Refresh file URL if expired
  async refreshFileUrl(s3Key: string): Promise<{ success: boolean; url?: string; error?: string }> {
    return this.getFileUrl(s3Key);
  }

  // Update file metadata
  async updateFileMetadata(s3Key: string, metadata: FileMetadata): Promise<{ success: boolean; error?: string }> {
    return {
      success: true,
    };
  }

  // Delete file from S3
  async deleteFile(s3Key: string): Promise<{ success: boolean; error?: string }> {
    return {
      success: true,
    };
  }

  // List files in a folder
  async listFiles(folderId?: string): Promise<{ success: boolean; files?: any[]; error?: string }> {
    return {
      success: true,
      files: [],
    };
  }

  // Upload multiple files
  async uploadMultipleFiles(
    files: File[],
    options: UploadOptions = {}
  ): Promise<{ success: boolean; results?: Array<{ success: boolean; fileMetadata?: FileMetadata; error?: string }>; error?: string }> {
    const results = await Promise.all(files.map(file => this.uploadFile(file, options)));
    return {
      success: true,
      results,
    };
  }

  // Get file size in human readable format
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Validate file type
  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type) || allowedTypes.includes('*');
  }

  // Validate file size
  validateFileSize(file: File, maxSizeInMB: number): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  }

  // Create folder in S3
  async createFolder(
    folderName: string,
    parentFolderId?: string,
    allowedFileTypes?: string[]
  ): Promise<{ success: boolean; folderId?: string; error?: string }> {
    return {
      success: true,
      folderId: folderName,
    };
  }

  // List folders
  async listFolders(parentFolderId?: string): Promise<{ success: boolean; folders?: any[]; error?: string }> {
    return {
      success: true,
      folders: [],
    };
  }

  // Delete folder
  async deleteFolder(folderId: string, parentFolderId?: string): Promise<{ success: boolean; error?: string }> {
    return {
      success: true,
    };
  }

  // Get folder metadata from centralized location
  async getFolderMetadata(folderId: string): Promise<{ success: boolean; metadata?: any; error?: string }> {
    return {
      success: true,
      metadata: { name: folderId },
    };
  }

  // List all metadata files for debugging/management
  async listAllMetadata(): Promise<{ success: boolean; metadataFiles?: string[]; error?: string }> {
    return {
      success: true,
      metadataFiles: [],
    };
  }

  // Get file icon based on type
  getFileIcon(fileType: string): string {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.startsWith('video/')) return '🎥';
    if (fileType.startsWith('audio/')) return '🎵';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📽️';
    if (fileType.includes('zip') || fileType.includes('rar')) return '📦';
    return '📁';
  }
}

export const s3Service = new MockS3Service();
