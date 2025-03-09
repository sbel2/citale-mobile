"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getUserId, updateProfile } from '@/app/actions/auth';
import { supabase } from '@/app/lib/definitions';
import Image from 'next/image';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { FaUser, FaGlobe, FaInfoCircle, FaUpload } from 'react-icons/fa';
import Link from 'next/link';
import imageCompression from 'browser-image-compression';


export default function ProfilePage() {
  const [userId, setUserId] = useState<string|null>(null);
  const [userName, setUserName] = useState<string|null>(null);
  const [userEmail, setUserEmail] = useState<string|null>(null);
  const [userAvatar, setUserAvatar] = useState<string|null>('avatar.png');
  const [userAvatarCompressed, setUserAvatarCompressed] = useState<string|null>('avatar.png');
  const [userWebsite, setUserWebsite] = useState<string|null>(null);
  const [userBio, setUserBio] = useState<string|null>(null);
  const [fullName, setFullName] = useState<string|null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const cropperRef = useRef<ReactCropperElement>(null);
  const [cropWindow, setCropWindow] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async() => {
      const userId = await getUserId();
      if(!userId) {
        console.error('UserId not found');
        return;
      }
      setUserId(userId);

      const {data, error} = await supabase
        .from('profiles')
        .select('username, email, full_name, avatar_url, website, bio')
        .eq('id', userId)
        .single();
      if(error) {
        console.error('Error fetching user profile:', error.message)
        return;
      }
      setUserName(data?.username || null);
      setUserEmail(data?.email || null);
      setUserAvatar(data?.avatar_url || null);
      setUserWebsite(data?.website || null);
      setUserBio(data?.bio || null);
      setFullName(data?.full_name || null);
    };
    fetchUserData();
  }, []);

  const handleEditProfile = async () => {
    setError(null);
    setMessage('Updating your profile...');

    try {
      const { success, message } = await updateProfile(
        userId ?? '',
        userName ?? '',
        userEmail ?? '',
        fullName ?? '',
        userAvatar ?? '',
        userAvatarCompressed ?? '',
        userWebsite ?? '',
        userBio ?? ''
      );
      if (!success) {
        setError(message);
        setMessage('');
        return;
      }
      localStorage.setItem('userAvatar', userAvatar ?? '');
      setMessage(message);
      router.back();
    } catch (e) {
      console.error('Unexpected error during profile update:', e);
      setError('An unexpected error occurred.');
      setMessage('');
    }
  };

  const handleReturn = () => {
    router.back();
  };

  const uploadPicToStorage = async (type: string ,file: File) => {
    if (!file) return;
    const filePath = `${userId}/${Math.floor(Math.random() * 10000)}-${type}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('profile-pic')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true,
      });
    if (error) {
      console.error('Error uploading file:', error.message);
      return;
    }
    if (type === 'normal'){
      setUserAvatar(filePath);
    }
    else if (type === 'compressed'){
      setUserAvatarCompressed(filePath);
    }
    
    return filePath;
  };

  const compressImage = async (file: File) => {
    const options = {
      maxWidthOrHeight: 40,
      useWebWorker: true,
    }
    try{
      const compressed = await imageCompression(file, options);
      const uploadCompressedImage = await uploadPicToStorage('compressed',compressed);
    } catch(error){
      console.error('Error compressing image:', error);
    }
  };

  const getCropData = async () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas({
        width: 128,
        height: 128,
      });

      if(!croppedCanvas) return;

      croppedCanvas.toBlob(async (blob: Blob | null) => {
        if (blob) {
          const file = new File([blob], 'cropped-image.png', { type: 'image/png' });
          const filePath = await uploadPicToStorage('normal', file);
          const compress = await compressImage(file);
          setPreviewUrl(URL.createObjectURL(file));
          setCropWindow(false);
        }
      }, 'image/png');

    }
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setCropWindow(true);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div>
		<header className="shrink-0 border-b border-gray-200 bg-white md:hidden">
        <div className="mx-auto px-4 py-2 flex justify-between items-center">
          <a href="/" aria-label="Go back home" className="text-gray-800 dark:text-white ml-1">
            &#x2190; Home
          </a>
          <Link href="/" aria-label="Home" className="inline-block mt-1">
            <Image
              src="/citale_header.svg"
              alt="Citale Logo"
              width={90}
              height={30}
              priority
            />
          </Link>
        </div>
      </header>
      <div className="w-full mx-auto bg-white h-[100dvh] overflow-y-auto pb-64 md:pb-0">
        <div className="p-6 md:p-16">
          <h2 className="text-base md:text-xl font-bold text-center text-gray-900 mb-8">Edit Profile</h2>
          
          <div className="space-y-8">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <Image
                  className="h-32 w-32 rounded-full border-4 border-blue-500 transition-opacity group-hover:opacity-75"
                  src={previewUrl || `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-pic/${userAvatar}`}
                  alt="User Avatar"
                  width={128}
                  height={128}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <label htmlFor="avatar" className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-300">
                    <FaUpload className="inline mr-2" />
                    Change
                    <input
                      type="file"
                      id="avatar"
                      name="mediaUrl"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                      ref={fileInputRef}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  <FaUser className="inline mr-2" />Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={userName || ""}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
                  <FaUser className="inline mr-2" />Display Name
                </label>
                <input
                  id="fullname"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName || ""}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                  <FaGlobe className="inline mr-2" />Website
                </label>
                <input
                  id="website"
                  type="url"
                  placeholder="Enter your personal website"
                  value={userWebsite || ""}
                  onChange={(e) => setUserWebsite(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  <FaInfoCircle className="inline mr-2" />Bio
                </label>
                <textarea
                  id="bio"
                  placeholder="Enter your bio"
                  value={userBio || ""}
                  onChange={(e) => setUserBio(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-3text-right sm:px-6">
          {error && <p className="text-red-600 mb-2">{error}</p>}
          {message && <p className="text-green-600 mb-2">{message}</p>}
          <div className="flex justify-end space-x-3">
            <button onClick={handleReturn} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Cancel
            </button>
            <button onClick={handleEditProfile} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Submit
            </button>
          </div>
        </div>
      </div>

      {cropWindow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <Cropper
              src={previewUrl || 'avatar.png'}
              style={{ height: 300, width: '100%' }}
              aspectRatio={1}
              guides={false}
              ref={cropperRef}
            />
            <div className="mt-4 flex justify-end space-x-4">
              <button onClick={() => setCropWindow(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
              <button onClick={getCropData} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Crop Image</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
