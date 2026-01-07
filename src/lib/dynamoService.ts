export interface FolderData {
  id: string;
  name: string;
  parentId?: string;
  userId: string;
  allowedFileTypes: string[];
  confidentiality: 'public' | 'internal' | 'confidential' | 'restricted';
  importance: 'low' | 'medium' | 'high' | 'critical';
  allowSharing: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFolderInput {
  name: string;
  parentId?: string;
  allowedFileTypes?: string[];
  confidentiality?: 'public' | 'internal' | 'confidential' | 'restricted';
  importance?: 'low' | 'medium' | 'high' | 'critical';
  allowSharing?: boolean;
}

export const FOLDERS_STORAGE_KEY = 'cloudvault_folders';

export class MockDynamoService {
  private getStoredFolders(): FolderData[] {
    try {
      const stored = localStorage.getItem(FOLDERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse stored folders', e);
      return [];
    }
  }

  private setStoredFolders(folders: FolderData[]) {
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
  }

  // Create a new folder
  async createFolder(input: CreateFolderInput): Promise<{ success: boolean; folder?: FolderData; error?: string }> {
    const folders = this.getStoredFolders();

    // Check for duplicate names in the same parent (optional validation)
    if (folders.some(f => f.name === input.name && f.parentId === input.parentId)) {
      // For now, allow duplicates or handle as error? Let's allow for simplicity or append number
    }

    const newFolder: FolderData = {
      id: 'folder-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      name: input.name,
      parentId: input.parentId,
      userId: 'mock-user',
      allowedFileTypes: input.allowedFileTypes || ['all'],
      confidentiality: input.confidentiality || 'internal',
      importance: input.importance || 'low',
      allowSharing: input.allowSharing !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    folders.push(newFolder);
    this.setStoredFolders(folders);

    return {
      success: true,
      folder: newFolder
    };
  }

  // Get all folders for current user (optionally filtered by parent)
  async listFolders(parentId?: string): Promise<{ success: boolean; folders?: FolderData[]; error?: string }> {
    const folders = this.getStoredFolders();
    const filtered = parentId
      ? folders.filter(f => f.parentId === parentId)
      : folders.filter(f => !f.parentId); // Root folders if parentId is undefined

    return {
      success: true,
      folders: filtered
    };
  }

  // Get all folders (including nested) for current user
  async getAllFolders(): Promise<{ success: boolean; folders?: FolderData[]; error?: string }> {
    const folders = this.getStoredFolders();
    return {
      success: true,
      folders: folders
    };
  }

  // Get folder by ID
  async getFolder(folderId: string): Promise<{ success: boolean; folder?: FolderData; error?: string }> {
    const folders = this.getStoredFolders();
    const folder = folders.find(f => f.id === folderId);

    if (!folder) {
      return { success: false, error: 'Folder not found' };
    }

    return {
      success: true,
      folder
    };
  }

  // Update folder
  async updateFolder(folderId: string, updates: Partial<CreateFolderInput>): Promise<{ success: boolean; folder?: FolderData; error?: string }> {
    const folders = this.getStoredFolders();
    const index = folders.findIndex(f => f.id === folderId);

    if (index === -1) {
      return { success: false, error: 'Folder not found' };
    }

    const updatedFolder = {
      ...folders[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    folders[index] = updatedFolder;
    this.setStoredFolders(folders);

    return {
      success: true,
      folder: updatedFolder
    };
  }

  // Delete folder
  async deleteFolder(folderId: string): Promise<{ success: boolean; error?: string }> {
    const folders = this.getStoredFolders();
    const filtered = folders.filter(f => f.id !== folderId);

    // Also recursively delete subfolders? For now, just single level or let valid children become orphans (or handle recursion)
    // Simple mock: just delete the target folder.

    if (folders.length === filtered.length) {
      return { success: false, error: 'Folder not found' };
    }

    this.setStoredFolders(filtered);
    return {
      success: true
    };
  }

  // Get folder hierarchy (for breadcrumbs)
  async getFolderPath(folderId: string): Promise<{ success: boolean; path?: FolderData[]; error?: string }> {
    const folders = this.getStoredFolders();
    const path: FolderData[] = [];
    let currentId = folderId;

    while (currentId) {
      const folder = folders.find(f => f.id === currentId);
      if (folder) {
        path.unshift(folder);
        currentId = folder.parentId || '';
      } else {
        break;
      }
    }

    return {
      success: true,
      path
    };
  }
}

export const dynamoService = new MockDynamoService();
