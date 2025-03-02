import { createClient } from "@/supabase/client";

const supabase = createClient();

// Define FileItem directly here
export type FileItem = {
    name: string;
    type: string;
};

// Allowed file formats
const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/quicktime"];
const MAX_VIDEO_DURATION = 15;

export const checkVideoDuration = (file: File): Promise<number> => {
    return new Promise(async (resolve, reject) => {
        const video = document.createElement("video");
        video.preload = "metadata";

        try {
            const response = await fetch(file.name);
            const blob = await response.blob();
            const reader = new FileReader();

            reader.onload = (e) => {
                if (typeof e.target?.result === "string") {
                    video.src = e.target.result;
                } else {
                    reject("Failed to read video file.");
                }
            };

            reader.onerror = () => reject("Error reading video file.");
            reader.readAsDataURL(blob);

            video.onloadedmetadata = () => {
                if (isNaN(video.duration) || video.duration === Infinity) {
                    reject("Invalid video duration.");
                } else {
                    resolve(video.duration);
                }
            };

            video.onerror = () => reject("Error loading video.");
        } catch (error) {
            reject("Error fetching blob URL.");
        }
    });
};

export const handleFilesInput = async (
    filesArray: FileItem[],
    setVideoError: (error: string | null) => void,
    setFiles: (updateFn: (prevState: FileItem[]) => FileItem[]) => void
): Promise<boolean> => {
    setVideoError(null);

    let hasVideo = false;
    let hasImages = false;
    let validFiles: FileItem[] = [];

    for (const file of filesArray) {
        if (VIDEO_TYPES.includes(file.type)) {
            if (hasImages) {
                setVideoError("You can only upload either one video or multiple images, not both.");
                return false;
            }
            if (hasVideo) {
                setVideoError("Only one video is allowed.");
                return false;
            }

            try {
                const duration = await checkVideoDuration(file as unknown as File);
                if (duration > MAX_VIDEO_DURATION) {
                    setVideoError(`Videos must be ${MAX_VIDEO_DURATION} seconds or shorter.`);
                    return false;
                }
                hasVideo = true;
                validFiles = [file]; // Only allow one video
            } catch (err) {
                setVideoError("We only take mp4 files for videos at the moment.");
                return false;
            }
        } else if (IMAGE_TYPES.includes(file.type)) {
            if (hasVideo) {
                setVideoError("You can only upload either one video or multiple images, not both.");
                return false;
            }
            hasImages = true;
            validFiles.push(file);
        }
    }

    setFiles(() => validFiles); // Update state correctly
    return validFiles.length > 0; // ✅ Indicate success/failure
};



export const uploadFilesToBucket = async (blobUrls: string[], postAction: string, postId: string) => {
    const storageBucket = postAction === "post" ? "posts" : "drafts";
    const uploadedFiles: string[] = [];

    for (const blobUrl of blobUrls) {
        try {
            const response = await fetch(blobUrl);
            const blob = await response.blob();
            const fileType = blob.type;

            if (![...IMAGE_TYPES, ...VIDEO_TYPES].includes(fileType)) {
                console.error(`Unsupported file type: ${fileType}`);
                continue;
            }

            const fileExtension = fileType.split("/")[1];
            const fileName = `${postId}_${Date.now()}_${Math.random().toString(36).substring(6)}.${fileExtension}`;
            const filePath = `${fileType.startsWith("image/") ? "images" : "videos"}/${fileName}`;

            // Upload to Supabase Storage
            const { error } = await supabase.storage.from(storageBucket).upload(filePath, blob, { upsert: false });

            if (error) {
                console.error(`Error uploading ${blobUrl}:`, error.message);
                continue;
            }

            uploadedFiles.push(fileName);
        } catch (error) {
            console.error(`Failed to upload ${blobUrl}:`, (error as Error).message);
        }
    }

    return { uploadedFiles };
};
