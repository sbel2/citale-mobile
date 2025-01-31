import { useState } from "react";

const CommentPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [comment, setComment] = useState("");
  
    const handleSubmit = () => {
      if (comment.trim()) {
        console.log("Submitting comment:", comment);
        setComment("");
        onClose();
      }
    };
  
    return (
      <div className="absolute bottom-0 left-0 right-0 bg-white shadow-lg">
        <div className="p-4">
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <div className="mt-2 flex justify-end space-x-2">
            <button 
              onClick={onClose} 
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit} 
              className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  };
  

export default CommentPopup;
