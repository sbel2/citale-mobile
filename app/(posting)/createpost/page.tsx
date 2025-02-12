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
        setTimeout(() => {
            setFormData((prevState) => ({
                ...prevState,
                [inputKey]: `${chosenOptions}`,
            }));
        }, 0);
    }

    const handleDateInput = (period: (string | null)[]) => {
        setFormData((prevState) => ({
            ...prevState,
            startDate: period[0] ? `${period[0]}` : null,
            endDate: period[1] ? `${period[1]}` : null
        }));
    }

    const handleFilesInput = async (filesArray: FileItem[]) => {
        setVideoError(null);
        
        for (const file of filesArray) {
            if (file.type.startsWith('video/')) {
                try {
                    const duration = await checkVideoDuration(file as unknown as File);
                    if (duration > 16) {
                        setVideoError("Videos must be 15 seconds or shorter. Please upload a shorter video.");
                        return;
                    }
                } catch (err) {
                    setVideoError("Error processing video. Please try again.");
                    return;
                }
            }
        }
        
        const fileNames = Array.from(filesArray).map((file) => file.name);
        setFormData((prevState) => ({
            ...prevState,
            mediaUrl: fileNames
        }));
    }

    async function submitForm(e: FormEvent) {
        e.preventDefault();
        
        if (videoError) return;

        const submitEvent = e.nativeEvent as ButtonSubmitEvent;
        const perform = submitEvent.submitter.value;
        
        async function postData(postAction: string, formDataUpdate: typeof formData) {
            const { data, error } = await supabase
                .from(postAction === "post" ? "testPost" : "testDraft")
                .insert([{ ...formDataUpdate, post_action: postAction, user_id: user?.id }]);

            if (error) {
                console.error('Error Posting data:', error);
                return;
            }

            console.log('Data posted!!');
            window.location.href = `/account/profile/${user?.id}`;
        };

        postData(perform, formData);
    }

    return (
        <div className="flex justify-center">
            <form onSubmit={submitForm} id="addpost" className="flex flex-col w-full bg-white p-6">
                <p className="text-xl font-semibold text-center mb-4">Post an Event!</p>

                <FilesInput onFilesChange={handleFilesInput} />

                {videoError && (
                    <div className="bg-red-500 text-white p-3 rounded-md mt-5 mb-5 text-sm">
                        {videoError}
                    </div>
                )}

                <label className="block text-gray-700 font-medium">
                    Title
                    <input type="text" name="title" value={formData.title} onChange={handleInput} className="w-full mt-3 p-2 border rounded-md focus:ring focus:ring-blue-300" required />
                </label>

                <DatesInput onSeasonChange={handleMultiSelect} onDateChange={handleDateInput} />

                <label className="block text-gray-700 font-medium mt-3">
                    Area
                    <select name="location" value={formData.location} onChange={handleInput} className="w-full mt-3 p-2 border rounded-md focus:ring focus:ring-blue-300">
                        <option value="" disabled>Select Boston Area...</option>
                        {locationList.map((location) => (
                            <option key={location} value={location}>{location}</option>
                        ))}
                    </select>
                </label>

                <label className="block text-gray-700 font-medium mt-3">
                    Location
                    <input type="text" name="mapUrl" value={formData.mapUrl} onChange={handleInput} className="w-full mt-3 p-2 border rounded-md focus:ring focus:ring-blue-300" required />
                </label>

                <label className="block text-gray-700 font-medium mt-3">
                    Price
                    <select name="price" value={formData.price} onChange={handleInput} className="w-full mt-3 p-2 border rounded-md focus:ring focus:ring-blue-300">
                        <option value="" disabled>Select Price Range...</option>
                        <option key='Free' value='Free'>Free</option>
                        <option key='$' value='$'>$</option>
                        <option key='$$' value='$$'>$$</option>
                        <option key='$$$' value='$$$'>$$$</option>
                    </select>
                </label>

                <label className="block text-gray-700 font-medium mt-3">
                    Description
                    <textarea name="description" value={formData.description} onChange={handleInput} rows={5} className="w-full mt-3 p-2 border rounded-md focus:ring focus:ring-blue-300" required />
                </label>

                <p className="text-gray-700 font-medium mt-3">Event Type(s)</p>
                <MultiSelectChipsInput onMultiSelectChange={handleMultiSelect} elementKey="category" options={categoryList} />
                <div className="flex justify-end mt-6 space-x-3">
                    <button type="submit" form="addpost" value="post" className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">Post</button>
                    <button type="submit" form="addpost" value="draft" className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition">Save as Draft</button>
                </div>
            </form>
        </div>
    );
}
