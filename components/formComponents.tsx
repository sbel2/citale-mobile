import React, { useRef, forwardRef, useImperativeHandle, useState, useCallback, useEffect, ChangeEvent, MouseEvent } from 'react';
import Image from "next/legacy/image";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrop, useDrag } from "react-dnd";
import '@/components/formComponents.css';

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

  style: {
    label: {},
    input: {},
    dateDisplay: {},
    inputLined: {},
  }
}


interface FilesInputProps {
  onFilesChange: (filesUpdate: FileItem[]) => void
  
  style: {
    specialLabel: {},
    specialInput: {},
    input: {},
  }

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
      <div className="flex gap-2 flex-wrap mx-4" style={{margin: "0px 25px"}}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => toggleOption(option)}
            className={`px-3 py-1 rounded-xl`}
            style={{  backgroundColor: selectedOptions.includes(option) ? "#ff0000" : "white",
                      border: selectedOptions.includes(option) ? "1px solid #ff0000" : "1px solid black",
                      color: selectedOptions.includes(option) ? "white" : "black"}
            }
          >
            {option}
          </button>
        ))}
      </div>
  );

});

MultiSelectChipsInput.displayName = "MultiSelectChipsInput";

export const DatesInput: React.FC<DatesInputProps> = ({ onSeasonChange, onDateChange, style }) => {

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
          <p style={style.label}>Event Timing</p>
          <div className='flex justify-start'>
            <button id="season" type="button" onClick={toggleDateEnter} className={hasSeason ? 'timeClicked' : 'timeUnclicked'}>
              Seasonal Event
            </button>
            <button id="date" type="button" onClick={toggleDateEnter} className={hasDate ? 'timeClicked' : 'timeUnclicked'}>
              Limited-Time Event
            </button>
          </div>
          <div style={{width: "100%"}}>
            {hasSeason &&  
              <div className={'block'}>
                <MultiSelectChipsInput ref={multiSelectRef} onMultiSelectChange={onSeasonChange} options={seasons} elementKey="season"/>
              </div>
            }
            {hasDate &&
              <div className={'block'}>
                <label htmlFor="startdate" style={style.label}> Start Date
                      <input
                        type="date"
                        id="startdate"
                        name="startdate"
                        value={startDate ? startDate : ''}
                        onChange={handleDateChange}
                        style={style.inputLined}
                      />
                </label>
                <label htmlFor="endDate" style={style.label}> End Date
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={endDate ? endDate : ''}
                    onChange={handleDateChange}
                    style={style.inputLined}
                  />
                </label>
              </div>
            }
          </div>
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
    <div //get rid of in future
      ref={(node) => {drag(drop(node))}}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px",
        marginBottom: "8px",
        width: "fit-content",
        backgroundColor: "#f2f3f4",
        borderRadius: "16px",
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        overflow: "hidden",
      }}
      className="hide-scrollbar"
    >
      {file.type.startsWith("image") ? (
        <Image src={file.name} alt="File Preview" width={200} height={200} style={{ borderRadius: "16px"}} />
      ) : file.type.startsWith("video") ? (
        <video src={file.name} autoPlay loop muted style={{ borderRadius: "16px", height: "auto", width: "100%", maxWidth: "300px", objectFit: "cover", clipPath: "inset(0 round 16px)", }} />
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
      <div style={{ display: "flex", width: "fit-content", maxHeight: "400px", padding: "20px", borderRadius: "8px", backgroundColor: "#f2f3f4", marginLeft: "25px" }}>
        {files.map((file, index) => (
          <DraggableFile key={index} file={file} index={index} moveFile={moveFile} />
        ))}
      </div>
    </DndProvider>
  );
};


export const FilesInput:  React.FC<FilesInputProps> = ({ onFilesChange, style }) => {
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
    <label htmlFor="urldata" style={style.specialLabel}> Upload Images and Videos
        <input
            type="file"
            id="urldata"
            name="mediaUrl"
            multiple
            accept=".jpg, .jpeg, .png, .gif, .mp4, .mov"
            onChange={handleFileInput}
            style={style.specialInput}
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
