"use client";

import { useState, useRef, useEffect } from "react";
import { handleFilesInput, FileItem } from "app/lib/fileUtils";
import { useRouter } from "next/navigation";
import { useMedia } from "app/context/MediaContext";
import { FiUpload } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

export default function UploadMedia() {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [videoError, setVideoError] = useState<string | null>(null);
    const { setUploadedFiles } = useMedia();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // 📱 Auto-trigger mobile file picker on mount
    useEffect(() => {
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            fileInputRef.current?.click();
        }
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setVideoError(null);
    
        const selectedFiles = Array.from(e.target.files).map((file) => ({
            name: URL.createObjectURL(file),
            type: file.type,
        }));
    
        setFiles(selectedFiles);
    
        const isValid = await handleFilesInput(selectedFiles, setVideoError, setFiles);
    
        if (!isValid) {
            return;
        }
        handleNextStep(selectedFiles);
    };

    // 📌 Handle Drag-and-Drop Events
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files.length > 0) {
            handleFileChange({ target: { files: e.dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>);
        }
    };

    const handleNextStep = (selectedFiles: FileItem[]) => {
        if (selectedFiles.length === 0) {
            setVideoError("Please select at least one file.");
            return;
        }
    
        const formattedFiles = selectedFiles.map((file) => ({
            name: file.name,
            type: file.type,
        }));
    
        setUploadedFiles(formattedFiles);
        router.push("/posting");
    };
    

    return (
        <div className="flex flex-col items-center justify-center h-screen w-full">
            {/* 📌 Logo at the Top */}
            <Link href="/" aria-label="Home" className="inline-block mb-28">
                <Image
                    src="/citale_header.svg"
                    alt="Citale Logo"
                    width={150}
                    height={30}
                    priority
                />
            </Link>

            {/* 📌 Drag-and-Drop Box */}
            <div
                className={`w-full max-w-3xl h-96 flex flex-col items-center justify-center border-2 
                border-dashed rounded-lg transition-all cursor-pointer bg-gray-100 
                ${isDragging ? "border-blue-500 bg-blue-100" : "border-gray-300 hover:border-blue-500"}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <FiUpload className="text-gray-600 text-5xl mb-4" />
                <p className="text-gray-600 text-md mt-4">
                    {isDragging ? "Drop files here..." : "Drag files or click to upload"}
                </p>
            </div>

            {/* 📌 Hidden File Input (Auto-opens on mobile) */}
            <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.gif,.mp4,.mov"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />

            {/* 📌 Error Messages */}
            {videoError && <p className="text-red-500 mt-4">{videoError}</p>}
        </div>

    );
}
