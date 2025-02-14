"use client";

import { useState, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { MultiBackend, TouchTransition } from "dnd-multi-backend";
import Image from "next/image";
import { FileItem } from "app/lib/fileUtils";

// ✅ MultiBackend to support both desktop and mobile dragging
const backendOptions = {
  backends: [
    { backend: HTML5Backend, transition: undefined }, // Desktop
    { backend: TouchBackend, options: { enableMouseEvents: true }, transition: TouchTransition }, // Mobile
  ],
};

// 📌 **Draggable Image Component**
const DraggableImage = ({
  file,
  index,
  moveFile,
}: {
  file: FileItem;
  index: number;
  moveFile: (dragIndex: number, hoverIndex: number) => void;
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "IMAGE",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "IMAGE",
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveFile(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => {
        if (node) {
          drag(drop(node));
        }
      }}
      className={`relative w-24 h-24 md:w-36 md:h-36 rounded-lg overflow-hidden shadow-md border ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <Image src={file.name} alt={`Uploaded ${index}`} layout="fill" objectFit="cover" className="rounded-lg" />
    </div>
  );
};

// 📌 **Image Preview with Drag & Drop + Add More Button**
const ImagePreview = ({
  filesUpload,
  onFilesChange,
}: {
  filesUpload: FileItem[];
  onFilesChange: (filesUpdate: FileItem[]) => void;
}) => {
  const [files, setFiles] = useState<FileItem[]>(filesUpload || []);

  const moveFile = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setFiles((prevFiles) => {
        const updatedFiles = [...prevFiles];
        const [movedFile] = updatedFiles.splice(dragIndex, 1);
        updatedFiles.splice(hoverIndex, 0, movedFile);
        onFilesChange(updatedFiles);
        return updatedFiles;
      });
    },
    [onFilesChange]
  );

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        name: URL.createObjectURL(file),
        type: file.type,
      }));

      setFiles([...files, ...newFiles]);
      onFilesChange([...files, ...newFiles]);
    }
  };

  return (
    <DndProvider backend={MultiBackend} options={backendOptions}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-1 md:p-4 bg-gray-100 rounded-md">
        {/* 📌 Image Preview Grid */}
        {files?.map((file, index) => (
          <DraggableImage key={index} file={file} index={index} moveFile={moveFile} />
        ))}

        {/* 📌 Add More Button Inside the Grid */}
        <label className="w-24 h-24 sm:w-36 sm:h-36 flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-200">
          <span className="text-2xl">+</span>
          <span className="text-sm text-gray-500">Add More</span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleAddImages}
          />
        </label>
      </div>
    </DndProvider>
  );
};

export default ImagePreview;
