'use client'

//trigger commit

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
                console.log("pre")
                const response = await fetch(file.name);
                console.log("response ", response)
                const blob = await response.blob();
                console.log("blob ", blob)
                // Read blob as Data URL
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (typeof e.target?.result === "string") {
                        video.src = e.target.result;
                    } else {
                        
                        console.log("Failed to read video file.")
                        reject("Failed to read video file.");
                        
                    }
                };
    
                reader.onerror = () => {
                    console.log("Error reading video file.")
                    reject("Error reading video file.");
                    
                };
                reader.readAsDataURL(blob);
    
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
            }))
        }

        console.log(formData)
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
                    if (duration > 16) {
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
        console.log(fileTypes);
        console.log(fileNames);
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
            return; // Don't submit if there's a video error
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
                    thumbnailUrl = `${uploadedFiles[index]}`;
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
        <div>
            <form onSubmit={submitForm} id="addpost" style={styles.form}>
                <p style={styles.title}>Post an Event!</p>
                {videoError && (
                    <div style={styles.errorMessage}>
                        {videoError}
                    </div>
                )}
                <label htmlFor="eventdata" style={styles.label}> Title
                    <input
                        type="text"
                        id="eventdata"
                        name="title"
                        value={formData.title}
                        onChange={handleInput}
                        style={styles.input}
                        required
                    />
                </label>
                <DatesInput onSeasonChange={handleMultiSelect} onDateChange={handleDateInput} style={styles}/>
                <label htmlFor="locationdata" style={styles.specialLabel}> Area
                    <select 
                        name="location"
                        id="location"
                        onChange={handleInput}
                        value={formData.location}
                        style={styles.specialInput}
                    >
                        <option value="" disabled> Select Boston Area... </option>
                        {locationList.map((location) => (
                            <option key={location} value={location}>
                                {location}
                            </option>
                        ))}
                    </select>
                </label>
                <label htmlFor="locationtitle" style={styles.label}> Location
                    <input
                        type="text"
                        id="locationtitle"
                        name="mapUrl"
                        value={formData.mapUrl}
                        onChange={handleInput}
                        style={styles.input}
                        required
                    />
                </label>
                <label htmlFor="price" style={styles.specialLabel}> Price
                    <select 
                        name="price"
                        id="price"
                        onChange={handleInput}
                        value={formData.price}
                        style={styles.specialInput}
                    >
                        <option value="" disabled> Select Price Range... </option>
                        <option key='Free' value='Free'>
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
                <div className="flex">
                    <label htmlFor="descriptiondata" style={styles.label}>Description</label>
                    <textarea
                        id="descriptiondata"
                        style={styles.textarea} 
                        rows={5}
                        cols={40}
                        name="description"
                        value={formData.description}
                        onChange={handleInput}
                        required
                    />
                </div>
                <div>
                    <p style={styles.label}> Event Type(s)</p>
                    <MultiSelectChipsInput onMultiSelectChange={handleMultiSelect} elementKey="category" options={categoryList} />
                </div>
                <FilesInput style={styles} onFilesChange={handleFilesInput}/>
            </form>
            <div className="flex justify-end">
                <button 
                    type="submit" 
                    form="addpost" 
                    value="post" 
                    style={{
                        ...styles.submit,
                        ...(videoError ? styles.submitDisabled : {})
                    }}
                    disabled={!!videoError}
                >
                    Post
                </button>
                <div className="flex">
                    <button 
                        type="submit" 
                        form="addpost" 
                        value="draft" 
                        formNoValidate 
                        style={{
                            ...styles.submit,
                            ...(videoError ? styles.submitDisabled : {})
                        }}
                        disabled={!!videoError}
                    >
                        Save as Draft
                    </button>
                </div>
            </div>
        </div>
    );
};

// Styles object
const styles = {
    total: {
        display: 'flex',
        position: 'fixed' as const,
        left: '30%',
        justifyContent: 'center',
        zIndex: 10,
        width: '40%',
    },

    form: {
        display: 'flex',
        flexDirection: 'column' as const,
        width: '100%',
        minWidth: '500px',
        margin: '20px 10px',
        borderRadius: '15px',
        backgroundColor: 'white',
    },

    title: {
        alignSelf: 'center',
        fontSize: '25px',
        margin: '25px 0px 10px',
    },

    input: {
        backgroundColor: '#f2f3f4',
        borderRadius: '8px',
        height: '30px',
        width: '100%'
    },

    inputLined: {
        borderBottom: "1px solid black",
        height: '30px',
        width: '100%'
    },

    textarea: {
        backgroundColor: '#f2f3f4',
        borderRadius: '8px',
        width: '100%',
        marginRight: '25px',
    },

    label: {
        margin: '10px 25px 0px',
        fontSize: '15px',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'flex-start',
    },

    specialLabel: {
        margin: '10px 25px 0px',
        fontSize: '15px',
    },

    map: {
        margin: '5px 25px',
    },

    specialInput: {
        margin: '10px 5px',
        backgroundColor: '#f2f3f4',
    },

    submit: {
        border: '1px white solid',
        borderRadius: '10px',
        backgroundColor: '#ff0000',
        color: 'white',
        margin: '100px 10px 40px 10px',
        alignSelf: 'flex-end',
        width: '200px',
        height: '35px',
        cursor: 'pointer',
    },

    dateDisplay: {
        display: 'none !important',
    },

    errorMessage: {
        backgroundColor: '#FEE2E2',
        color: '#DC2626',
        padding: '12px 16px',
        margin: '10px 25px',
        borderRadius: '8px',
        fontSize: '14px',
        border: '1px solid #FCA5A5',
    },

    submitDisabled: {
        backgroundColor: '#cccccc',
        cursor: 'not-allowed',
        opacity: 0.7,
    }
}