'use client'

import{ createClient } from '@/supabase/client';
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { categoryList, locationList } from '@/components/constants';
import { useAuth } from 'app/context/AuthContext';
import { MultiSelectChipsInput, DatesInput, FilesInput, FileItem } from '@/components/formComponents';

const supabase = createClient();

interface ButtonSubmitEvent extends SubmitEvent {
    submitter: HTMLButtonElement | HTMLInputElement;
}

export default function CreatePostPage() {
    const { user, logout } = useAuth();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        mediaUrl: [] as string[],
        category: "",
        price: "",
        user_id: user?.id,
        mapUrl: "",
        season: "",
        startDate: null as string | null,
        endDate: null as string | null,
    });
    const [videoError, setVideoError] = useState<string | null>(null);

    const checkVideoDuration = (file: File): Promise<number> => {
        console.log("checkVideoDuration called");
        
        return new Promise(async (resolve, reject) => {
            const video = document.createElement("video");
            video.preload = "metadata";
    
            try {
                // Convert blob URL back to a Blob
                console.log("pre")
                const response = await fetch(file.name); // Fetch the blob URL
                console.log("response ", response)
                const blob = await response.blob(); // Convert response to a Blob
                console.log("blob ", blob)
                // Read blob as Data URL
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (typeof e.target?.result === "string") {
                        video.src = e.target.result; // Set the video source to the data URL
                    } else {
                        reject("Failed to read video file.");
                    }
                };
    
                reader.onerror = () => {
                    reject("Error reading video file.");
                };
    
                reader.readAsDataURL(blob); // Read blob as Data URL
    
                video.onloadedmetadata = () => {
                    if (isNaN(video.duration) || video.duration === Infinity) {
                        reject("Invalid video duration.");
                    } else {
                        resolve(video.duration);
                    }
                };
    
                video.onerror = () => {
                    reject("Error loading video.");
                };
            } catch (error) {
                reject("Error fetching blob URL.");
            }
        });
    };
    

    function handleInput(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const fieldName = e.target.name;
        if (!(e.target instanceof HTMLSelectElement && e.target.hasAttribute('multiple')))  {
            const fieldValue = e.target.value;
            setFormData((prevState) => ({
                ...prevState,
                [fieldName]: fieldValue,
            }));
        }
    }

    const handleMultiSelect = (chosenOptions: string, inputKey: string) => {
        console.log("ithappened", chosenOptions)
        setTimeout(() => {
            setFormData((prevState) => ({
            ...prevState,
           [inputKey]: `${chosenOptions}`,
            }));
        }, 0)
        console.log(formData)
    }

    const handleDateInput = (period: (string | null)[]) => {
        console.log("datechange!", period)
        setFormData((prevState) => ({
            ...prevState,
            startDate: period[0] ? `${period[0]}` : null,
            endDate: period[1] ? `${period[1]}` : null
        }))
        console.log(formData)
    }

    const handleFilesInput = async (filesArray: FileItem[]) => {
        console.log("fileshere!");
        setVideoError(null);
        
        for (const file of filesArray) {
            if (file.type.startsWith('video/')) {
                try {
                    console.log('checking duration')
                    const duration = await checkVideoDuration(file as unknown as File);
                    console.log('duration: ', duration)
                    if (duration > 15) {
                        setVideoError("Videos must be 15 seconds or shorter. Please upload a shorter video.");
                        return;
                    }
                } catch (err) {
                    console.error("Error checking video duration:", err);
                    setVideoError("Error processing video. Please try again.");
                    return;
                }
            }
        }
        
        const fileNames = Array.from(filesArray).map((file) => file.name);
        const fileTypes = Array.from(filesArray).map((file) => (file.type.startsWith("video/") ? true : false));
        setFormData((prevState) => ({
            ...prevState,
            mediaUrl: fileNames
        }));
    }

    const uploadFilesToBucket = async (blobUrls: string[], postAction: string) => {
        const testPostBucket = 'test';
        const testDraftBucket = 'test-draft'
        
        const fileTypes: boolean[] = [];
        const uploadedFiles: string[] =[];
        let currentFileType = "";

        for (const blobUrl of blobUrls) {
            try {
                const response = await fetch(blobUrl);
                const blob = await response.blob();

                switch (blob.type) {
                    case 'image/jpeg':
                    case 'image/jpg':
                        fileTypes.push(false);
                        currentFileType = "jpg"
                        break
                    case 'image/png':
                        fileTypes.push(false);
                        currentFileType = "png"
                        break
                    case 'image/gif':
                        fileTypes.push(false);
                        currentFileType = "gif"
                        break
                    case 'video/mp4':
                        fileTypes.push(true);
                        currentFileType = "mp4"
                        break
                    case 'video/quicktime':
                        fileTypes.push(true);
                        currentFileType = "mov"
                        break
                }

                if (postAction == "draft" || postAction == "post") {
                    const fileName = `${Date.now()}-${Math.random().toString(35).substring(7)}.${currentFileType}`
                    let filePath = ""

                    if (currentFileType === "jpg" || currentFileType === "png" || currentFileType === "gif") {
                        filePath = `images/${fileName}`
                        console.log(filePath)
                        
                    } else if (currentFileType === "mp4" || currentFileType === "mov") {
                        filePath = `videos/${fileName}`
                        console.log(filePath)
                    }
                    
                    const { data, error } = await supabase.storage
                            .from((postAction=="post") ? testPostBucket : testDraftBucket)
                            .upload(filePath, blob, {
                                upsert: false,
                            });

                    if (error) {
                        console.error(`Error uploading ${blobUrl}:`, error.message);
                        continue;
                    }

                    const publicUrl = supabase.storage.from((postAction=="post") ? testPostBucket : testDraftBucket).getPublicUrl(filePath);
                    uploadedFiles.push(fileName);
                    console.log(`Uploaded ${blobUrl} to:`, publicUrl);
                }
            } catch (error) {
                console.error(`Failed to upload ${blobUrl}:`, (error as Error).message);
            }
        }
        console.log(fileTypes);
        return { fileTypes, uploadedFiles }
    }

    async function submitForm(e: FormEvent) {
        e.preventDefault();
        
        if (videoError) {
            return; 
        }

        console.log(formData);
        const submitEvent = e.nativeEvent as ButtonSubmitEvent;
        const perform = submitEvent.submitter.value;
        
        async function postData(postAction: string, formDataUpdate: typeof formData) {
            if (!formData.mediaUrl[0]) {
                console.log("madeit", formDataUpdate)
                let statusPost = "draft";
                let draftFormData = {}
                draftFormData = {
                    ...formDataUpdate,
                    post_action: statusPost,
                    user_id: user?.id
                }
                
                console.log(draftFormData);
                const { data, error } = await supabase
                .from('testDraft')
                .insert([draftFormData]);

                if (error) {
                    console.error('Error Posting data:', error);
                    return
                }

                console.log('Data posted!!')
                return
            }
            const { fileTypes, uploadedFiles } = await uploadFilesToBucket(formData.mediaUrl, postAction);
        
            console.log(formDataUpdate)
            let thumbnailUrl = null;
            let hasVideo = false;

            for (const [index, type] of fileTypes.entries()) {
                if (type == true) {
                    hasVideo = true;
                    thumbnailUrl = postAction==="preview"? formDataUpdate.mediaUrl[index] : `${uploadedFiles[index]}`;
                    break
                };
            }            

            let finalFormData = {};
            
            console.log("madeit")
            let statusPost = (postAction === "post"? "post" : "draft");

            finalFormData = {
                ...formDataUpdate,
                mediaUrl: uploadedFiles,
                is_video: hasVideo,
                video_type: fileTypes,
                thumbnailUrl: thumbnailUrl,
                post_action: statusPost,
                user_id: user?.id
            }
            
            console.log(finalFormData);
            const { data, error } = await supabase
            .from((postAction === "post")? "testPost" : "testDraft")
            .insert([finalFormData]);

            if (error) {
                console.error('Error Posting data:', error);
                return
            }

            console.log('Data posted!!')
            window.location.href = '/account/profile/{user?.id}';
        };
        

        console.log("Processing Form Submission...")
        console.log(formData)
        postData(perform, formData);
        console.log("Processing Form Submission...")
    }

    // Return JSX
    return (
        <div className="flex justify-center">
            <form onSubmit={submitForm} id="addpost" className="flex flex-col w-full bg-white p-6">
                <p className="text-xl font-semibold text-center mb-4">Post an Event!</p>

                <FilesInput onFilesChange={handleFilesInput}/>
                
                {videoError && (
                    <div className="bg-red-500 text-white p-3 rounded-md mt-5 mb-5 text-sm">
                        {videoError}
                    </div>
                )}

                <label htmlFor="eventdata" className="block text-gray-700 font-medium"> Title
                    <input
                        type="text"
                        id="eventdata"
                        name="title"
                        value={formData.title}
                        onChange={handleInput}
                        className="w-full mt-3 p-2 border rounded-md focus:ring focus:ring-blue-300"
                        required
                    />
                </label>
                <DatesInput onSeasonChange={handleMultiSelect} onDateChange={handleDateInput}/>
                <label htmlFor="locationdata" className="block text-gray-700 font-medium mt-3"> Area
                    <select 
                        name="location"
                        id="location"
                        onChange={handleInput}
                        value={formData.location}
                        className="w-full mt-3 p-2 border rounded-md focus:ring focus:ring-blue-300"
                    >
                        <option value="" disabled> Select Boston Area... </option>
                        {locationList.map((location) => (
                            <option key={location} value={location}>
                                {location}
                            </option>
                        ))}
                    </select>
                </label>
                <label htmlFor="locationtitle" className="block text-gray-700 font-medium mt-3"> Location
                    <input
                        type="text"
                        id="locationtitle"
                        name="mapUrl"
                        value={formData.mapUrl}
                        onChange={handleInput}
                        className="w-full mt-3 p-2 border rounded-md focus:ring focus:ring-blue-300"
                        required
                    />
                </label>
                <label htmlFor="price" className="block text-gray-700 font-medium mt-3"> Price
                    <select 
                        name="price"
                        id="price"
                        onChange={handleInput}
                        value={formData.price}
                        className="w-full mt-3 p-2 border rounded-md focus:ring focus:ring-blue-300"
                    >
                        <option value="" disabled> Select Price Range... </option>
                        <option key='free' value='free'>
                            Free
                        </option>
                        <option key='$' value='$'>
                            $
                        </option>
                        <option key='$$' value='$$'>
                            $$
                        </option>
                        <option key='$$$' value='$$$'>
                            $$$
                        </option>
                    </select>
                </label>
                <label className="block text-gray-700 font-medium mt-3">
                    Description
                    <textarea name="description" value={formData.description} onChange={handleInput} rows={5} className="w-full mt-3 p-2 border rounded-md focus:ring focus:ring-blue-300" required />
                </label>
                <p className="text-gray-700 font-medium mt-3">Event Type(s)</p>
                <MultiSelectChipsInput onMultiSelectChange={handleMultiSelect} elementKey="category" options={categoryList} />

            <div className="flex justify-end mt-6 space-x-3">
                <button 
                    type="submit" 
                    form="addpost" 
                    value="post" 
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                    disabled={!!videoError}
                >
                    Post
                </button>
                {/* <div className="flex">
                    <button 
                        type="submit" 
                        form="addpost" 
                        value="draft" 
                        formNoValidate 
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                        disabled={!!videoError}
                    >
                        Save as Draft
                    </button>
                </div> */}
            </div>
        </form>
        </div>
    );
};