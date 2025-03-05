'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMedia } from "app/context/MediaContext";
import { useAuth } from "app/context/AuthContext";
import ImagePreview from "@/components/share/imagePreview";
import ShareForm from "@/components/share/shareForm";
import { uploadFilesToBucket } from 'app/lib/fileUtils';
import { supabase } from "@/app/lib/definitions";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import Link from "next/link";

export default function EditPostPage() {
    
}