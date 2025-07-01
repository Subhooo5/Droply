"use client";

import { File, Star, Trash } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { File as FileType } from "@/lib/db/schema";

interface FileTabsProps {
  activeTab: string;
  onTabChange: (key: string) => void;
  files: FileType[];
  starredCount: number;
  trashCount: number;
}

export default function FileTabs({
  activeTab,
  onTabChange,
  files,
  starredCount,
  trashCount,
}: FileTabsProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(key) => onTabChange(key)}
      className="w-full overflow-x-auto"
    >
      <TabsList className="gap-2 sm:gap-4 md:gap-6 flex-nowrap min-w-full">
        
        {/* All Files Tab */}
        <TabsTrigger value="all" className="py-3 whitespace-nowrap flex items-center gap-2 sm:gap-3">
          <File className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="font-medium">All Files</span>
          <Badge variant="outline" className="text-xs">
            {files.filter((file) => !file.isTrash).length}
          </Badge>
        </TabsTrigger>

        {/* Starred Tab */}
        <TabsTrigger value="starred" className="py-3 whitespace-nowrap flex items-center gap-2 sm:gap-3">
          <Star className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="font-medium">Starred</span>
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 text-xs">
            {starredCount}
          </Badge>
        </TabsTrigger>

        {/* Trash Tab */}
        <TabsTrigger value="trash" className="py-3 whitespace-nowrap flex items-center gap-2 sm:gap-3">
          <Trash className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="font-medium">Trash</span>
          <Badge variant="destructive" className="text-xs">
            {trashCount}
          </Badge>
        </TabsTrigger>

      </TabsList>
    </Tabs>
  );
}
