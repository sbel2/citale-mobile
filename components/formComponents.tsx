'use client';
import React, { useRef, forwardRef, useImperativeHandle, useState, useCallback, ChangeEvent } from 'react';
import Image from "next/legacy/image";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrop, useDrag } from "react-dnd";

export type FileItem = {
  name: string;
  type: string;
};

interface MultiSelectChipsInputProps {
  onMultiSelectChange: (chosenOptions: string, inputKey: string) => void;
  options: string[];
  elementKey: string;
}

interface DatesInputProps {
  onSeasonChange: (chosenSeasons: string, inputKey: string) => void;
  onDateChange: (period: (string | null)[]) => void;
}

interface FilesInputProps {
  onFilesChange: (filesUpdate: FileItem[]) => void;
}

export const MultiSelectChipsInput = forwardRef(({ onMultiSelectChange, options, elementKey }: MultiSelectChipsInputProps, ref) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleOption = (option: string) => {
    setSelectedOptions((prevSelectedOptions) => {
      const updatedOptions = prevSelectedOptions.includes(option)
        ? prevSelectedOptions.filter((item) => item !== option)
        : [...prevSelectedOptions, option];

      onMultiSelectChange(updatedOptions.join(","), elementKey);
      return updatedOptions;
    });
  };

  useImperativeHandle(ref, () => ({
    clearSelection() {
      setSelectedOptions([]);
      onMultiSelectChange("", elementKey);
    },
  }));

  return (
    <div className="flex flex-wrap gap-2 mx-4 mt-6">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => toggleOption(option)}
          className={`px-3 py-1 rounded-2xl text-sm border transition ${
            selectedOptions.includes(option) 
              ? "bg-red-600 text-white border-red-600" 
              : "bg-white text-black border-gray-400"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
});

MultiSelectChipsInput.displayName = "MultiSelectChipsInput";

export const DatesInput: React.FC<DatesInputProps> = ({ onSeasonChange, onDateChange }) => {
  const multiSelectRef = useRef<{ clearSelection: () => void } | null>(null);
  const seasons = ["Spring", "Summer", "Fall", "Winter"];
  const [hasDate, setHasDate] = useState(false);
  const [hasSeason, setHasSeason] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const toggleMode = (mode: "season" | "date") => {
    if (mode === "season") {
      setHasSeason((prev) => {
        if (prev) multiSelectRef.current?.clearSelection();
        return !prev;
      });
    } else {
      setHasDate((prev) => {
        if (!prev) {
          setStartDate(null);
          setEndDate(null);
        }
        return !prev;
      });
    }
  };

  return (
    <div>
      <p className="text-gray-700 font-semibold mt-3">Event Timing</p>
      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={() => toggleMode("season")}
          className={`px-3 py-1 rounded-2xl text-sm transition ${
            hasSeason ? "bg-gray-700 text-white" : "bg-gray-200 text-black border border-gray-400"
          }`}
        >
          Seasonal Event
        </button>
        <button
          type="button"
          onClick={() => toggleMode("date")}
          className={`px-3 py-1 rounded-2xl text-sm transition ${
            hasDate ? "bg-gray-700 text-white" : "bg-gray-200 text-black border border-gray-400"
          }`}
        >
          Limited-Time Event
        </button>
      </div>
      {hasSeason && <MultiSelectChipsInput ref={multiSelectRef} onMultiSelectChange={onSeasonChange} options={seasons} elementKey="season" />}
      {hasDate && (
        <div className="mt-6">
          <input type="date" value={startDate || ''} onChange={(e) => setStartDate(e.target.value)} className="border rounded-md p-2 mr-2" />
          <input type="date" value={endDate || ''} onChange={(e) => setEndDate(e.target.value)} className="border rounded-md p-2" />
        </div>
      )}
    </div>
  );
};

export const FilesInput: React.FC<FilesInputProps> = ({ onFilesChange }) => {
  const [filesArray, setFilesArray] = useState<FileItem[]>([]);

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({ name: URL.createObjectURL(file), type: file.type }));
      setFilesArray(newFiles);
      onFilesChange(newFiles);
    }
  };

  return (
    <div>
      <label className="block text-gray-700 font-medium">Upload Images and Videos</label>
      <input 
        type="file" 
        multiple 
        accept=".jpg,.jpeg,.png,.gif,.mp4,.mov" 
        onChange={handleFileInput} 
        className="border rounded-md p-2 w-full" 
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {filesArray.map((file, index) => (
          <div key={index} className="w-auto h-auto bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-md mb-5">
            {file.type.startsWith("image") ? (
              <Image 
                src={file.name} 
                alt="File Preview" 
                width={100} 
                height={100} 
                className="rounded-lg w-full h-auto" 
              />
            ) : file.type.startsWith("video") ? (
              <video 
                src={file.name} 
                autoPlay 
                loop 
                muted 
                className="rounded-lg w-full h-auto"
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
