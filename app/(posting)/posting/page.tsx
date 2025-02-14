"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMedia } from "app/context/MediaContext";
import { useAuth } from "app/context/AuthContext";
import ImagePreview from "@/components/share/imagePreview";
import ShareForm from "@/components/share/shareForm";
import { uploadFilesToBucket } from 'app/lib/fileUtils';
import { supabase } from "@/app/lib/definitions";
import { v4 as uuidv4 } from "uuid";

export default function SharePage() {
    const { uploadedFiles, setUploadedFiles } = useMedia();
    const { user } = useAuth();
    const router = useRouter();
    
    const [postId, setPostId] = useState<string>("");
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isVideo, setIsVideo] = useState(false);
    const [videoType, setVideoType] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        post_id: postId,
        title: "",
        description: "",
        location: "",
        category: "",
        price: "",
        user_id: user?.id || null,
        mapUrl: "",
        season: "",
        startDate: null,
        endDate: null,
        mediaUrl: [] as string[],
    });

    // ✅ Generate unique post_id
    async function generatePostId(): Promise<string> {
        let newPostId = uuidv4();
        let isUnique = false;

        while (!isUnique) {
            const { data } = await supabase
                .from("posts")
                .select("post_id")
                .eq("post_id", newPostId)
                .single();

            if (!data) {
                isUnique = true;
            } else {
                newPostId = uuidv4();
            }
        }
        setPostId(newPostId);
        return newPostId;
    }

    useEffect(() => {
        generatePostId();
    }, []);

    // ✅ Ensure user_id updates when user changes
    useEffect(() => {
        if (user) {
            setFormData((prevState) => ({
                ...prevState,
                user_id: user.id,
            }));
        }
    }, [user]);

    useEffect(() => {
        if (!uploadedFiles || uploadedFiles.length === 0) {
            router.replace("/upload");
            return;
        }

        try {
            setPreviewUrls(uploadedFiles.map((file) => file.name));

            const firstFile = uploadedFiles[0];
            if (firstFile?.type?.startsWith("video/")) {
                setIsVideo(true);
                setVideoType(firstFile.type);
            } else {
                setIsVideo(false);
            }
        } catch (err) {
            setError("Failed to process media.");
        }
    }, [uploadedFiles, router]);


    const handleSubmit = async () => {
        try {
            if (uploadedFiles.length === 0) {
                alert("Please upload media.");
                return;
            }

            // ✅ Determine if a video is included
            const hasVideo = uploadedFiles.some((file) => file.type.startsWith("video/"));
            const video_types = uploadedFiles.map((file) => file.type.startsWith("video/"));

            // Upload media to Supabase
            const { uploadedFiles: storedFiles } = await uploadFilesToBucket(
                uploadedFiles.map((file) => file.name),
                "post",
                postId
            );

            const thumbnailUrl = hasVideo ? storedFiles[0] : null;

            const postPayload = {
                ...formData,
                post_id: postId,
                mediaUrl: storedFiles,
                user_id: user?.id, 
                created_at: new Date().toISOString(),
                is_video: hasVideo,
                video_type: video_types,
                post_action: "post", 
                thumbnailUrl: thumbnailUrl
            };

            const { error } = await supabase.from("posts").insert([postPayload]);

            if (error) throw error;
            router.push(`/account/profile/${user?.id}`); // ✅ Redirect to dynamic profile page
        } catch (err) {
            alert("There was an error submitting your post.");
        }
    };


    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col items-center p-6">
            <h2 className="text-xl font-bold mb-4">Review Your Upload</h2>

            {/* Image & Video Previews */}
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
                {isVideo ? (
                    <div className="w-[30%] sticky top-10 shadow-lg">
                        <video key={previewUrls[0]} controls className="w-full rounded-lg">
                            <source src={previewUrls[0]} type={videoType ?? "video/mp4"} />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                ) : (
                    <ImagePreview filesUpload={uploadedFiles} onFilesChange={setUploadedFiles} />
                )}
            </div>

            {/* Post Form */}
            <div className="w-full max-w-3xl mt-6">
                <ShareForm formData={formData} setFormData={setFormData} />
                <button
                    onClick={handleSubmit}
                    className="w-full bg-red-600 text-white py-2 mt-4 rounded-md hover:bg-red-700 transition"
                >
                    Submit Post
                </button>
            </div>
        </div>
    );
}
