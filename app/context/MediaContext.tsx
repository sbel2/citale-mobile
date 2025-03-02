'use client';

import { createContext, useContext, useState } from "react";
import { FileItem } from "app/lib/fileUtils";

type MediaContextType = {
    uploadedFiles: FileItem[]; // ✅ Change from `string[]` to `FileItem[]`
    setUploadedFiles: (files: FileItem[]) => void; // ✅ Accept objects instead of strings
};

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider = ({ children }: { children: React.ReactNode }) => {
    const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([]); // ✅ Store full file objects

    return (
        <MediaContext.Provider value={{ uploadedFiles, setUploadedFiles }}>
            {children}
        </MediaContext.Provider>
    );
};

export const useMedia = () => {
    const context = useContext(MediaContext);
    if (!context) {
        throw new Error("useMedia must be used within a MediaProvider");
    }
    return context;
};
