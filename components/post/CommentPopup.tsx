import { useState } from "react";
import {useComments} from 'app/lib/useComments';

interface CommentPopupProps {
  onClose: () => void;
  post_id: number;
  user_id?: string;
  onNewComment: (comment: any) => void;
}

const CommentPopup: React.FC<CommentPopupProps> = ({ onClose, post_id, user_id, onNewComment }) => {
    const [comment, setComment] = useState("");
    const { saveComment, isSubmitting } = useComments({ post_id, user_id });
  
    const handleSubmit = async () => {
      if (comment.trim()) {
        try {
          await onNewComment(comment); 
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
          className="flex-1 rounded-[24px] px-4 py-2 border border-gray-200 
            dark:border-gray-700 focus:outline-none focus:ring-2 
            focus:ring-blue-500 dark:bg-gray-800 dark:text-white 
            resize-none overflow-y-auto h-[44px] min-h-[44px] 
            max-h-[132px] transition-all duration-200 w-full"
          placeholder="What is on your mind?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          disabled={isSubmitting}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            const numberOfLines = (target.value.match(/\n/g) || []).length + 1;
            const lineHeight = 35;
            const maxHeight = lineHeight * 15;
            const newHeight = Math.min(lineHeight * numberOfLines, maxHeight);
            target.style.height = `${newHeight}px`;
          }}
        />
          <div className="mt-2 flex justify-end space-x-2">
            <button onClick={onClose} className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-md">Cancel</button>
            <button onClick={handleSubmit} className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md">
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    );
};

export default CommentPopup;
