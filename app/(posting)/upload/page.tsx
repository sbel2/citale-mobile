'use client';

import React, { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FileItem } from '@/components/formComponents';

export default function FileUploadPage() {
  const [filesArray, setFilesArray] = useState<FileItem[]>([]);
  const [videoError, setVideoError] = useState<string | null>(null);
  const router = useRouter();

  const checkVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          video.src = e.target.result as string;
        } else {
          reject("Failed to read video file.");
        }
      };

      video.onloadedmetadata = () => {
        if (isNaN(video.duration) || video.duration === Infinity) {
          reject("Invalid video duration.");
        } else {
          resolve(video.duration);
        }
      };

      reader.onerror = () => reject("Error reading video file.");
      video.onerror = () => reject("Error loading video.");

      reader.readAsDataURL(file);
    });
  };

  const handleFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideoError(null);
      const newFiles: FileItem[] = [];

      for (const file of Array.from(e.target.files)) {
        if (file.type.startsWith("video/")) {
          try {
            const duration = await checkVideoDuration(file);
            if (duration > 15) {
              setVideoError("Videos must be 15 seconds or shorter.");
              return;
            }
          } catch {
            setVideoError("Error processing video.");
            return;
          }
        }
        newFiles.push({ name: URL.createObjectURL(file), type: file.type });
      }

      setFilesArray(newFiles);
    }
  };

  const handleNext = () => {
    router.push('/createpost');
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-white text-black ml-20">
      <h1 className="text-3xl font-bold mb-4">Upload Media</h1>

      <div className="w-full max-w-3xl bg-white p-6 flex flex-col items-center">
        <label className="block text-gray-700 font-medium mb-2">Upload Images and Videos</label>
        <input
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.gif,.mp4,.mov"
          onChange={handleFileInput}
          className="border rounded-md p-2 w-full bg-gray-700 text-white"
        />

        {videoError && (
          <div className="bg-red-500 text-white p-3 rounded-md mt-2 text-sm">
            {videoError}
          </div>
        )}
      </div>

      {filesArray.length > 0 && (
        <div className="mt-6 w-full max-w-3xl grid grid-cols-2 md:grid-cols-3 gap-4">
          {filesArray.map((file, index) => (
            <div key={index} className="w-full h-64 bg-gray-700 flex items-center justify-center rounded-lg overflow-hidden">
              {file.type.startsWith("image") ? (
                <img src={file.name} alt="Uploaded" className="w-full h-full object-cover" />
              ) : file.type.startsWith("video") ? (
                <video src={file.name} autoPlay loop muted className="w-full h-full object-cover" />
              ) : null}
            </div>
          ))}
        </div>
      )}

      {!videoError && filesArray.length > 0 && (
        <button
          onClick={handleNext}
          className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Next
        </button>
      )}
    </div>
  );
}
