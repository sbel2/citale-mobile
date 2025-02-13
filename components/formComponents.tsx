import React, { useRef, forwardRef, useImperativeHandle, useState, useCallback, useEffect, ChangeEvent, MouseEvent } from 'react';
import Image from "next/legacy/image";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrop, useDrag } from "react-dnd";


interface MultiSelectChipsInputProps {
  onMultiSelectChange: (
    chosenOptions:string,
    inputKey:string
  ) => void;
  options: string[];
  elementKey: string;
}

interface DatesInputProps {
  onSeasonChange: (
    chosenSeasons:string,
    inputKey:string
  ) => void;
  
  onDateChange: (
    period: (string | null)[]
  ) => void;
}


interface FilesInputProps {
  onFilesChange: (filesUpdate: FileItem[]) => void
}

export type FileItem = {
  name: string;
  type: string;
}

export const MultiSelectChipsInput = forwardRef(( { onMultiSelectChange, options, elementKey} : MultiSelectChipsInputProps, ref ) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  console.log(selectedOptions)

  const toggleOption = (option: string) => {
    setSelectedOptions((prevSelectedOptions) => {
      const updatedOptions = prevSelectedOptions.includes(option) 
        ? prevSelectedOptions.filter((item) => item !== option) 
        : [...prevSelectedOptions, option];
      
      onMultiSelectChange(updatedOptions.join(","), elementKey);

      return updatedOptions;
    });
  } 

  useImperativeHandle(ref, () => ({
    clearSelection() {
      setSelectedOptions([]);
      setTimeout(() => {
        onMultiSelectChange("", elementKey);
      }, 0);
      console.log('cleaned')
    }
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
  const seasons =["Spring", "Summer", "Fall", "Winter"];
  const [hasDate, viewDate] = useState(false)
  const [hasSeason, viewSeason] = useState(false)
  const [startDate, changeStartDate] = useState<string | null>(null)
  const [endDate, changeEndDate] = useState<string | null>(null)

  const handleClearOptions = () => {
    if (multiSelectRef.current) {
      multiSelectRef.current.clearSelection();
    }
    console.log("hello")
  }

  const toggleDateEnter = (e: MouseEvent<HTMLButtonElement>) => {
    console.log(hasSeason, hasDate)
    const target = e.target as HTMLButtonElement;
   
    if (target.id=="season") {
      viewSeason(prevState => {
        const newState = !prevState;
        if (!newState) {
          handleClearOptions();
        }
        return newState;
      }) 
   } else if (target.id=="date") {
      viewDate(prevState => {
        const newState = !prevState;
        if (!newState) {
          changeStartDate(null);
          changeEndDate(null);
        }
        return newState;
      }) 
   }

   console.log(hasSeason, hasDate)
  }

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.id=="startdate") {
      changeStartDate(e.target.value)
      onDateChange([`${e.target.value}`, endDate ? `${endDate}` : null])
    } else if (e.target.id=="endDate") {
      changeEndDate(e.target.value)
      onDateChange([startDate ? `${startDate}` : null , `${e.target.value}`])
    }
    console.log(startDate, endDate)
  }
  
  useEffect(() => {
    console.log("hasSeason changed:", hasSeason);
  }, [hasSeason]);

    return (
        <div>
          <p className="text-gray-700 font-semibold mt-3">Event Timing</p>
          <div className="flex gap-2 mt-3">
            <button id="season" type="button" onClick={toggleDateEnter} className={`px-3 py-1 rounded-2xl text-sm transition ${
            hasSeason ? "bg-gray-700 text-white" : "bg-gray-200 text-black border border-gray-400"
          }`}>
              Seasonal Event
            </button>
            <button id="date" type="button" onClick={toggleDateEnter} className={`px-3 py-1 rounded-2xl text-sm transition ${
            hasDate ? "bg-gray-700 text-white" : "bg-gray-200 text-black border border-gray-400"}`}>
              Limited-Time Event
            </button>
          </div>
          {hasSeason &&  
            <div>
              <MultiSelectChipsInput ref={multiSelectRef} onMultiSelectChange={onSeasonChange} options={seasons} elementKey="season"/>
            </div>
          }
          {hasDate && (
            <div className="mt-6">
              <label htmlFor="startdate" className="block text-gray-700 font-medium">
                Start Date
                <input
                  type="date"
                  id="startdate"
                  name="startdate"
                  value={startDate ? startDate : ''}
                  onChange={handleDateChange}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </label>
              <label htmlFor="endDate" className="block text-gray-700 font-medium mt-4">
                End Date
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={endDate ? endDate : ''}
                  onChange={handleDateChange}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </label>
            </div>
          )}
        </div>
    )
}


const DraggableFile = ({ file, index, moveFile }: { file: FileItem; index: number; moveFile: (dragIndex: number, hoverIndex: number) => void }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "FILE",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "FILE",
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveFile(draggedItem.index, index);
        draggedItem.index = index; // Update dragged index
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
      className={`flex items-center p-2 mb-2 w-fit bg-gray-200 rounded-lg cursor-grab overflow-hidden transition-opacity ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {file.type.startsWith("image") ? (
        <Image src={file.name} alt="File Preview" width={200} height={200} className="rounded-lg" />
      ) : file.type.startsWith("video") ? (
        <video src={file.name} autoPlay loop muted className="rounded-lg h-auto w-full max-w-[300px] object-cover" />
      ) : (
        null
      )}
    </div>
  );
};

const DragDropFileList = ( { filesUpload, onFilesChange }: {filesUpload: FileItem[], onFilesChange: (filesUpdate: FileItem[]) => void } ) => {
  const [files, setFiles] = useState<FileItem[]>(filesUpload);

  const moveFile = useCallback((dragIndex: number, hoverIndex: number) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      const [movedFile] = updatedFiles.splice(dragIndex, 1);
      updatedFiles.splice(hoverIndex, 0, movedFile);
      onFilesChange(updatedFiles);
      console.log(updatedFiles)
      return updatedFiles;
    });
  }, [onFilesChange]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex w-fit max-h-[400px] p-5 rounded-md bg-gray-200 ml-6">
        {files.map((file, index) => (
          <DraggableFile key={index} file={file} index={index} moveFile={moveFile} />
        ))}
      </div>
    </DndProvider>
  );
};


export const FilesInput:  React.FC<FilesInputProps> = ({ onFilesChange}) => {
  console.log("its alive")
  const [filesArray, setFilesArray] = useState<FileItem[]>([]);
  const [showThumbs, setShowThumbs] = useState<boolean>(false);


  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const fileList = e.target.files;
      console.log(fileList);
      setFilesArray([])
      let newFiles:FileItem[] = []
      if (fileList) {
        const fileNames = Array.from(fileList).map((file) => URL.createObjectURL(file))
        const fileTypes = Array.from(filesArray).map((file) => (file.type.startsWith("video/") ? true : false))
        for (const file of fileList) {
          newFiles.push({name: URL.createObjectURL(file), type:file.type})
        }
      setFilesArray(newFiles)
        
      onFilesChange(newFiles)
      setShowThumbs(true);
      }
    }
  }

return (
  <div>
    <label htmlFor="urldata" className="block text-gray-700 font-medium mb-2"> Upload Images and Videos
        <input
            type="file"
            id="urldata"
            name="mediaUrl"
            multiple
            accept=".jpg, .jpeg, .png, .gif, .mp4, .mov"
            onChange={handleFileInput}
            className="block w-full mt-2 p-2 border border-gray-300 rounded-md bg-white focus:ring-red-500 focus:border-red-500"
            required
        />
    </label>
    {showThumbs && (

      <DragDropFileList filesUpload={filesArray} onFilesChange={ onFilesChange }/>

    )
  }
  </div>
)
};