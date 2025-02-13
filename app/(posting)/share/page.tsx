"use client";

import { useEffect, useState } from "react";
import { useMedia } from "app/context/MediaContext";

export default function SharePage() {
    const { uploadedFiles } = useMedia(); // ✅ Now retrieves an array of `{ name, type }`
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isVideo, setIsVideo] = useState(false);
    const [videoType, setVideoType] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    console.log("📂 Uploaded Files:", uploadedFiles);

    useEffect(() => {
        console.log("🟢 useEffect triggered. Checking uploadedFiles:", uploadedFiles);

        if (!uploadedFiles || uploadedFiles.length === 0) {
            console.warn("⚠️ No media selected.");
            setError("No media selected.");
            return;
        }

        try {
            // ✅ Extract blob URLs
            setPreviewUrls(uploadedFiles.map((file) => file.name));

            // ✅ Detect video based on MIME type
            const firstFile = uploadedFiles[0];
            console.log("🔎 Checking file type:", firstFile);

            if (firstFile?.type?.startsWith("video/")) {
                console.log("🎥 Detected as video.");
                setIsVideo(true);
                setVideoType(firstFile.type); // Store MIME type
            } else {
                setIsVideo(false);
            }

        } catch (err) {
            console.error("❌ Error processing uploaded files:", err);
            setError("Failed to process media.");
        }
    }, [uploadedFiles]);

    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col items-center p-6">
            <h2 className="text-xl font-bold mb-4">Review Your Upload</h2>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Video Preview */}
                {isVideo ? (
                    <>
                        <p className="text-green-500">🎥 Detected video format</p>
                        <video
                            key={previewUrls[0]} // 🔑 Ensures video re-renders properly
                            controls
                            className="w-full max-w-lg rounded-lg shadow-lg"
                        >
                            <source src={previewUrls[0]} type={videoType ?? "video/mp4"} />
                            Your browser does not support the video tag.
                        </video>
                    </>
                ) : (

                    <>
                        <p className="text-blue-500">🖼️ Rendering {previewUrls.length} image(s)</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {previewUrls.map((file, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={file}
                                        alt={`Preview ${index + 1}`}
                                        className="w-32 h-32 object-cover rounded-lg shadow-md"
                                    />
                                    <p className="text-xs text-gray-500">File {index + 1}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
