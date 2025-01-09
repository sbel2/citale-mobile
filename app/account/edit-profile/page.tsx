"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserId, updateProfile } from '@/app/actions/auth';
import { supabase } from '@/app/lib/definitions';
import Image from 'next/image';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

export default function ProfilePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userWebsite, setUserWebsite] = useState<string | null>(null);
  const [userBio, setUserBio] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const cropperRef = useRef<ReactCropperElement>(null);
  const router = useRouter();

   // get user information
    useEffect(() => {
      const fetchUserData = async () => {
      const userId = await getUserId();
      if(!userId){
        console.error('UserId not found');
        return;
        }
      setUserId(userId);

      // get user profile
      const { data, error } = await supabase
        .from('profiles')
        .select('username, email, full_name, avatar_url, website, bio')
        .eq('id', userId)
        .single();
      if (error) {
        console.error('Error fetching user profile:', error.message);
        return;
      }
      setUserName(data?.username || '');
      setUserEmail(data?.email || '');
      setUserAvatar(data?.avatar_url || '');
      setUserWebsite(data?.website || '');
      setUserBio(data?.bio || '');
      setFullName(data?.full_name || '');
      };
      fetchUserData();
    }, []);

    const handleEditProfile = async () => {
      setError(null);
      setMessage('Updating your password...');
  
      try {
        const { success, message } = await updateProfile(
          userId ?? '',
          userName ?? '',
          userEmail ?? '',
          fullName ?? '',
          userAvatar ?? '',
          userWebsite ?? '',
          userBio ?? ''
        );
        if (!success) {
          setError(message);
          setMessage('');
          return;
        }
        setMessage(message);
      } catch (e) {
        console.error('Unexpected error during password update:', e);
        setError('An unexpected error occurred.');
        setMessage('');
      }
    };

    const handleReturn = async () => {
      router.back();
    };
  
    // Uploads a file to the storage bucket
    const uploadPicToStorage = async (file: File) => {
      if (!file) {
        return;
      }
      const filePath = `${userId}/${file.name}`;
      const { data, error } = await supabase.storage
        .from('profile-pic')
        .upload(filePath, file, {
          contentType: file.type,
        });
        setUserAvatar(filePath);
        setPreviewUrl(filePath);
      if (error) {
        console.error('Error uploading file:', error.message);
        return;
      }
      return filePath;
    };

    const getCropData = async () => {
      if (cropperRef.current) {
        const croppedCanvas = (cropperRef.current?.cropper as any)?.getCroppedCanvas({
          width: 128,
          height: 128,
        });
        croppedCanvas.toBlob(async (blob: Blob | null) => {
          if (blob) {
            const file = new File([blob], 'cropped-image.png', { type: blob.type });
            const filePath = await uploadPicToStorage(file);
            setPreviewUrl(URL.createObjectURL(file));
            return filePath;
          }
        });
      }
    };

      // Handles Profile picture input
    const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
      }
    };

    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
        <div className="space-y-4">
          <div className="p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Image
              className="h-32 w-32 rounded-full border-4 border-white mx-auto md:mx-0 mb-4"
              src={
                previewUrl ||
                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-pic/${userAvatar}`
              }
              alt="User Avatar"
              width={128}
              height={128}
            />
          </div>
          <div>
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-gray-700"
            >
              Profile Picture
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept=".jpg, .jpeg, .png, .svg, .gif"
              onChange={handleFileInput}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {/*if upload image, appear the crop window and crop the image*/}
          {previewUrl && (
            <div>
              <Cropper
                src={previewUrl}
                style={{ height: 400, width: '100%' }}
                initialAspectRatio={1}
                aspectRatio={1}
                guides={false}
                ref={cropperRef}
              />
              <button
                onClick={getCropData}
                className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save Image
              </button>
            </div>
          )}
          <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={userName || ''}
            onChange={(e) => setUserName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="fullname"
            className="block text-sm font-medium text-gray-700"
          >
            Display Name
          </label>
          <input
            id="fullname"
            type="fullname"
            placeholder="Enter your fullname"
            value={fullName || ''}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="website"
            className="block text-sm font-medium text-gray-700"
          >
            Website
          </label>
          <input
            id="website"
            type="website"
            placeholder="Enter your personal website"
            value={userWebsite || ''}
            onChange={(e) => setUserWebsite(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <input
            id="bio"
            type="bio"
            placeholder="Enter your bio"
            value={userBio || ''}
            onChange={(e) => setUserBio(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}
      {/* Navigation Links */}
      <div className="mt-4 w-full">
        <button onClick={handleEditProfile}>Save</button>
      </div>
      <div className="mt-4 w-full">
        <button onClick={handleReturn}>Back</button>
      </div>
    </div>
  );
}
