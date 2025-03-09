import React, {forwardRef, useImperativeHandle, useState, useEffect } from 'react';

interface MultiSelectChipsInputProps {
  onMultiSelectChange: (
    chosenOptions:string,
    inputKey:string
  ) => void;
  options: string[];
  elementKey: string;
  defaultValue: string;
}

interface DatesInputProps {
  onDateChange: (
    period: (string | null)[]
  ) => void;
  startDateInit: string;
  endDateInit: string;
}

export const MultiSelectChipsInput = forwardRef(( { onMultiSelectChange, options, elementKey, defaultValue} : MultiSelectChipsInputProps, ref ) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>( defaultValue ? defaultValue.split(",") : []);

  useEffect(() => {
    setSelectedOptions(defaultValue.split(",") || []);
  }, [defaultValue]);

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
    }
  }));

  return (
    <div className="flex flex-wrap gap-2 mx-4 mt-3">
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

export const DatesInput: React.FC<DatesInputProps> = ({ onDateChange, startDateInit, endDateInit }) => {
  const [startDate, changeStartDate] = useState<string | null>(startDateInit);
  const [endDate, changeEndDate] = useState<string | null>(endDateInit);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "startdate") {
      changeStartDate(e.target.value);
      onDateChange([e.target.value, endDate ? endDate : null]);
    } else if (e.target.id === "endDate") {
      changeEndDate(e.target.value);
      onDateChange([startDate ? startDate : null, e.target.value]);
    }
  };

  return (
    <div className="mt-3">
      <p className="text-gray-700 text-sm mb-2">Is this post time sensitive?</p>
      <label htmlFor="startdate" className="text-gray-700 text-sm">
        start date
        <input
          type="date"
          id="startdate"
          name="startdate"
          value={startDate || ""}
          onChange={handleDateChange}
          className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </label>

      <label htmlFor="endDate" className="block text-gray-700 text-sm mt-4">
        end date
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={endDate || ""}
          onChange={handleDateChange}
          className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </label>
    </div>
  );
};