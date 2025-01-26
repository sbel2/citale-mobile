import React, { useRef, forwardRef, useImperativeHandle, useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import { GoogleMap, useLoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import type { Libraries } from '@react-google-maps/api'
import '@/components/formComponents.css';
import { string } from 'zod';

type Library = "places" | "geometry" | "drawing" | "localContext" | "visualization";
const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
const libraries: Libraries = ["places"];

interface AutocompleteLocationProps {
    onLocationChange: (place: {
        name: string;
        formatted_address: string;
    }) => void;
    style: {
        label: {},
        input: {},
        map: {},
    };
}

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

export const AutocompleteLocation: React.FC<AutocompleteLocationProps> = ({ onLocationChange, style  }) => {
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null); 
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleApiKey,
    libraries,
  });

  useEffect(() => {
    // Check if google.maps is available and initialize Autocomplete
    if (isLoaded && !autocomplete) {
      const input = document.getElementById('autocomplete') as HTMLInputElement;
      
      if (input) {
        const autocompleteInstance = new google.maps.places.Autocomplete(input, {
            componentRestrictions: {country: 'US'},
      });
        setAutocomplete(autocompleteInstance);
      
        autocompleteInstance.addListener('place_changed', () => {
            const place = autocompleteInstance.getPlace();
            if (!place.geometry) {
            console.error("No details available for the selected place");
            return;
            }

            const locationData = {
                name: place.name || '',
                formatted_address: place.formatted_address || '',
                geometry: place.geometry,
              };

            setSelectedPlace(locationData);
            onLocationChange(locationData);

            console.log(selectedPlace)
        })
      }
    }
  }, [isLoaded, autocomplete, onLocationChange]);

  if (loadError) return <p>Error loading maps</p>
  if (!isLoaded) return <p>Loading...</p>

  return (
      <div>
        <label htmlFor="autocomplete" style={style.label}> Location
            <input
            id="autocomplete"
            type="text"
            placeholder="Enter a location"
            style={style.input}
            />
        </label>
        {/* Autocomplete is linked to the input field */}
        <div style={style.map}>
            <GoogleMap
            id="map"
            mapContainerStyle={{
                width: '100%',
                height: '300px',
                borderRadius: "15px"
            }}
            center={selectedPlace?.geometry?.location ? {
                lat: selectedPlace.geometry.location.lat(), 
                lng: selectedPlace.geometry.location.lng()
            } : { lat: 42.361145, lng: -71.057083 }}
            zoom= { selectedPlace? 13 : 10}
            >
            {/* Optionally, you can add a marker to the map based on the selected place */}
            {selectedPlace && (
                <Marker
                position={{
                    lat: selectedPlace?.geometry?.location?.lat() ?? 0,
                    lng: selectedPlace?.geometry?.location?.lng() ?? 0,
                }}
                />
            )}
            </GoogleMap>
        </div>
      </div>
  );
};


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

export const DatesInput: React.FC<DatesInputProps> = ({ onSeasonChange, onDateChange, style }) => {

  const { label, input } = style;
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