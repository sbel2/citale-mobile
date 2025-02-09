
import React, { useEffect, useState } from "react";
import { supabase } from "@/app/lib/definitions";
import { useAuth } from 'app/context/AuthContext';
import { Post } from "@/app/lib/types";


interface DeletePopupProps {
    posts: Post[];
    postStatus: string;
    postId: string;
    resetPosts: (updatedPosts: Post[]) => void;
    togglePopup: () => void;
}

export default function DeletePopup({ posts, postStatus, postId, resetPosts, togglePopup }: DeletePopupProps) {
    const { user, logout } = useAuth();

    console.log(posts)
    const deletePost = async () => {
        console.log(postStatus, postId)
        let postTable: string;
        let postBucket: string;

        switch(postStatus) {
            case "draft":
                postTable = "testDraft";
                postBucket = "test-draft"
                break
            case "post":
                postTable = "testPost";
                postBucket = "test";
                break
            default: 
                throw new Error("Invalid postStatus value")
        }


        const { error } = await supabase
        .from(postTable)
        .delete()
        .match({post_id: postId, user_id: user?.id})

        const updatedPosts = posts.filter(post => post.post_id !== postId);
        resetPosts(updatedPosts);
        togglePopup();

        if (error) {
        console.error("Error deleting row:", error.message);
        } else {
        console.log("Post deleted successfully!");
        }
    }


    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h1 className="text-md text-black-600 mb-6">
            Are you sure you want to delete this {postStatus}?
            </h1>
            <h2 className="text-sm text-black-600 mb-6">
            When a {postStatus} is deleted, it&apos;s gone forever!
            </h2>
            <div className="flex justify-center gap-6">
              <button
                className="bg-[#fd0000] hover:bg-[#fd0000] text-white px-4 py-2 rounded mr-2"
                onClick={deletePost}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                onClick={togglePopup}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        
        
    )
}

{/* <div style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            //left: '30%',
            top: '45%',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            width: '90%',
            backgroundColor: 'white',
            //height: '60%',
        }}>
            <h1 className="text-md">Are you sure you want to delete this post?</h1>
            <h2 className="text-sm">When a post is deleted, it&apos;s gone forever!</h2>
            <div className="flex justify-around w-full">
            <button onClick={deletePost} className="px-3 py-1 rounded-xl border border-black-500">Delete Post</button>
            <button onClick={togglePopup}>Cancel</button>
            </div>
        </div> */}