"use client";

import { useEffect, useState } from "react";
import { useMedia } from "app/context/MediaContext";

export default function SharePage() {
    const { uploadedFiles } = useMedia(); // ✅ Retrieve stored files from context
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isVideo, setIsVideo] = useState(false);
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
            // ✅ Use the blob URLs directly instead of recreating blobs
            setPreviewUrls(uploadedFiles);

            // ✅ Detect if the first file is a video based on its MIME type (if available)
            const firstFile = uploadedFiles[0];
            console.log("🔎 Checking if first file is a video:", firstFile);

            // Since it's a blob URL, we can't use regex on the name. Instead, rely on file context.
            setIsVideo(firstFile.includes("blob:") && /\.(mp4|mov)$/i.test(firstFile));

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
                            src={previewUrls[0]}
                            controls
                            className="w-full max-w-lg rounded-lg shadow-lg"
                        />
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
