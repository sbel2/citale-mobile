"use client";

import { useState } from "react";
import { handleFilesInput, FileItem } from "app/lib/fileUtils";
import { useRouter } from "next/navigation";
import { useMedia } from "app/context/MediaContext"; // ✅ Use Media Context

export default function UploadMedia() {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [videoError, setVideoError] = useState<string | null>(null);
    const { setUploadedFiles } = useMedia(); // ✅ Store files locally for preview
    const router = useRouter();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
    
        console.log("🔹 File input change detected");
    
        setVideoError(null); // Reset errors before processing
    
        const selectedFiles = Array.from(e.target.files).map((file) => ({
            name: URL.createObjectURL(file), // ✅ Temporary preview URL
            type: file.type,
        }));
    
        console.log("📂 Selected Files:", selectedFiles);
    
        // ✅ Immediately update state to avoid async issues
        setFiles(selectedFiles);
    
        // ✅ Process files without delaying state update
        await handleFilesInput(selectedFiles, setVideoError, setFiles);
        
        console.log("✅ Files processed and stored in state:", selectedFiles);
    };
    

    const handleNextStep = () => {
        console.log("➡️ Next step button clicked");
    
        if (files.length === 0) {
            console.error("🚨 No files selected");
            setVideoError("Please select at least one file.");
            return;
        }
    
        // ✅ Store both `name` (blob URL) and `type` in `setUploadedFiles`
        const formattedFiles = files.map((file) => ({
            name: file.name,
            type: file.type,
        }));
    
        console.log("📝 Storing files in `setUploadedFiles`:", formattedFiles);
        setUploadedFiles(formattedFiles); // ✅ Now correctly passing objects instead of strings
    
        console.log("🚀 Redirecting to `/share`...");
        router.push(`/posting`);
    };
    
    

    return (
        <div className="flex flex-col items-center p-6">
            <h2 className="text-xl font-bold mb-4">Upload Media</h2>

            <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.gif,.mp4,.mov"
                onChange={handleFileChange}
                className="mb-4 border p-2 rounded-md"
            />

            {videoError && <p className="text-red-500">{videoError}</p>}

            <button
                onClick={handleNextStep}
                className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4"
            >
                Next
            </button>
        </div>
    );
}
