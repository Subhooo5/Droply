"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Folder, Star, Trash, X, ExternalLink } from "lucide-react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";

import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import FileTabs from "@/components/FileTabs";
import FolderNavigation from "@/components/FolderNavigation";
import FileActionButtons from "@/components/FileActionButtons";
import FileEmptyState from "@/components/FileEmptyState";
import FileActions from "@/components/FileActions";
import FileLoadingState from "@/components/FileLoadingState";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

import type { File as FileType } from "@/lib/db/schema";
import FileIcon from "@/components/FileIcon";

interface FileListProps {
  userId: string;
  refreshTrigger?: number;
  onFolderChange?: (folderId: string | null) => void;
}

export default function FileList({ userId, refreshTrigger = 0, onFolderChange }: FileListProps) {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<Array<{ id: string; name: string }>>([]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [emptyTrashModalOpen, setEmptyTrashModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/files?userId=${userId}`;
      if (currentFolder) url += `&parentId=${currentFolder}`;
      const resp = await axios.get(url);
      setFiles(resp.data);
    } catch {
      toast.error("Error loading files. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [userId, currentFolder]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles, refreshTrigger]);

  const filteredFiles = useMemo(() => {
    return files.filter(file =>
      activeTab === "starred" ? file.isStarred && !file.isTrash :
      activeTab === "trash" ? file.isTrash :
      !file.isTrash
    );
  }, [files, activeTab]);

  const trashCount = useMemo(() => files.filter(f => f.isTrash).length, [files]);
  const starredCount = useMemo(() => files.filter(f => f.isStarred && !f.isTrash).length, [files]);

  const handleStarFile = async (id: string) => {
    try {
      const file = files.find(f => f.id === id);
      await axios.patch(`/api/files/${id}/star`);
      setFiles(fs => fs.map(f => f.id === id ? { ...f, isStarred: !f.isStarred } : f));
      toast.success(file?.isStarred ? "Removed from Starred" : "Added to Starred");
    } catch {
      toast.error("Could not update star. Try again.");
    }
  };

  const handleTrashFile = async (id: string) => {
    try {
      const resp = await axios.patch(`/api/files/${id}/trash`);
      setFiles(fs => fs.map(f => f.id === id ? { ...f, isTrash: resp.data.isTrash } : f));
      toast.success(resp.data.isTrash ? "Moved to Trash" : "Restored from Trash");
    } catch {
      toast.error("Could not update file. Try again.");
    }
  };

  const handleDeleteFile = async (id: string) => {
    try {
      const resp = await axios.delete(`/api/files/${id}/delete`);
      if (resp.data.success) {
        setFiles(fs => fs.filter(f => f.id !== id));
        toast.success("File deleted permanently");
        setDeleteModalOpen(false);
      }
    } catch {
      toast.error("Could not delete file. Try again.");
    }
  };

  const handleEmptyTrash = async () => {
    try {
      await axios.delete("/api/files/empty-trash");
      setFiles(fs => fs.filter(f => !f.isTrash));
      toast.success("Trash emptied");
      setEmptyTrashModalOpen(false);
    } catch {
      toast.error("Could not empty trash. Try again.");
    }
  };

  const handleDownloadFile = async (file: FileType) => {
    try {
      const toastId = toast.loading(`Preparing "${file.name}"...`);
      const downloadUrl = file.type.startsWith("image/")
        ? `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:q-100,orig-true/${file.path}`
        : file.fileUrl as string;
      const resp = await fetch(downloadUrl);
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`"${file.name}" ready for download!`);
      toast.dismiss(toastId);
    } catch {
      toast.error("Download failed. Try again.");
    }
  };

  const navigateToFolder = (id: string, name: string) => {
    setCurrentFolder(id);
    setFolderPath(p => [...p, { id, name }]);
    onFolderChange?.(id);
  };

  const navigateUp = () => {
    const p = [...folderPath];
    p.pop();
    const parentId = p.length ? p[p.length - 1].id : null;
    setFolderPath(p);
    setCurrentFolder(parentId);
    onFolderChange?.(parentId);
  };

  const navigateToPathFolder = (idx: number) => {
    const p = folderPath.slice(0, idx + 1);
    const id = p[p.length - 1]?.id ?? null;
    setFolderPath(p);
    setCurrentFolder(id);
    onFolderChange?.(id);
  };

  const openImageViewer = (file: FileType) => {
    if (file.type.startsWith("image/")) {
      const url = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:q-90,w-1600,h-1200,fo-auto/${file.path}`;
      window.open(url, "_blank");
    }
  };

  const handleItemClick = (file: FileType) =>
    file.isFolder ? navigateToFolder(file.id, file.name) :
    file.type.startsWith("image/") ? openImageViewer(file) : null;

  if (loading) return <FileLoadingState />;

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <FileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        files={files}
        starredCount={starredCount}
        trashCount={trashCount}
      />

      {activeTab === "all" && (
        <FolderNavigation
          folderPath={folderPath}
          navigateUp={navigateUp}
          navigateToPathFolder={navigateToPathFolder}
        />
      )}

      <FileActionButtons
        activeTab={activeTab}
        trashCount={trashCount}
        folderPath={folderPath}
        onRefresh={fetchFiles}
        onEmptyTrash={() => setEmptyTrashModalOpen(true)}
      />

      <Separator />

      {filteredFiles.length === 0 ? (
        <FileEmptyState activeTab={activeTab} />
      ) : (
        <Card className="border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell className="hidden sm:table-cell">Type</TableCell>
                <TableCell className="hidden md:table-cell">Size</TableCell>
                <TableCell className="hidden sm:table-cell">Added</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map(file => (
                <TableRow
                  key={file.id}
                  onClick={() => handleItemClick(file)}
                  className="hover:bg-muted cursor-pointer"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <FileIcon file={file} />
                      <div>
                        <div className="flex items-center gap-2 font-medium">
                          <span className="truncate max-w-[200px]">{file.name}</span>
                          {file.isStarred && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Star className="h-4 w-4 text-yellow-400" />
                              </TooltipTrigger>
                              <TooltipContent>Starred</TooltipContent>
                            </Tooltip>
                          )}
                          {file.isFolder && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Folder className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>Folder</TooltipContent>
                            </Tooltip>
                          )}
                          {file.type.startsWith("image/") && (
                            <Tooltip>
                              <TooltipTrigger>
                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>View image</TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground sm:hidden">
                          {formatDistanceToNow(new Date(file.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {file.isFolder ? "Folder" : file.type}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {!file.isFolder &&
                      (file.size < 1024
                        ? `${file.size} B`
                        : file.size < 1024 * 1024
                        ? `${(file.size / 1024).toFixed(1)} KB`
                        : `${(file.size / 1024 / 1024).toFixed(1)} MB`)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div>
                      <div>{formatDistanceToNow(new Date(file.createdAt), { addSuffix: true })}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(file.createdAt), "MMMM d, yyyy")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell onClick={e => e.stopPropagation()}>
                    <FileActions
                      file={file}
                      onStar={handleStarFile}
                      onTrash={handleTrashFile}
                      onDelete={() => {
                        setSelectedFile(file);
                        setDeleteModalOpen(true);
                      }}
                      onDownload={handleDownloadFile}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Permanently?"
        description="This cannot be undone."
        icon={X}
        confirmColor="destructive"
        onConfirm={() => selectedFile && handleDeleteFile(selectedFile.id)}
      />

      <ConfirmationModal
        isOpen={emptyTrashModalOpen}
        onOpenChange={setEmptyTrashModalOpen}
        title="Empty Trash?"
        description={`Permanently delete ${trashCount} items?`}
        icon={Trash}
        confirmColor="destructive"
        onConfirm={handleEmptyTrash}
      />
    </div>
  );
}
