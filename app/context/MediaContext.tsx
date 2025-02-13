"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type MediaContextType = {
    uploadedFiles: string[];
    setUploadedFiles: (files: string[]) => void;
};

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider = ({ children }: { children: ReactNode }) => {
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

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
