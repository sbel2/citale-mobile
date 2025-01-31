import { useState } from "react";
import {useComments} from 'app/lib/useComments';

interface CommentPopupProps {
    onClose: () => void;
    post_id: number;
    user_id?: string;
}

const CommentPopup: React.FC<CommentPopupProps> = ({ onClose, post_id, user_id }) => {
    const [comment, setComment] = useState("");
    const { saveComment, isSubmitting } = useComments({ post_id, user_id });
  
    const handleSubmit = async () => {
      if (comment.trim()) {
          try {
              await saveComment(comment);
              setComment("");
              onClose();
          } catch (error) {
              console.error('Failed to submit comment:', error);
          }
      }
    };
  
    return (
      <div className="absolute bottom-0 left-0 right-0 bg-white shadow-lg">
        <div className="p-4">
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What is on your mind?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            disabled={isSubmitting}
          />
          <div className="mt-2 flex justify-end space-x-2">
            <button 
              onClick={onClose} 
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit} 
              className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    );
  };
  

export default CommentPopup;
