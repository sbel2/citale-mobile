import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';  // Import styles for react-datepicker

interface FilterProps {
  onFilter: (option: string, location: string, category: string) => Promise<void>;
}

const FilterButton: React.FC<FilterProps> = ({ onFilter }) => {
  const [filterEvents, setFilterEvents] = useState('');
  const [filterLocations, setFilterLocations] = useState('');
  const filterParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const categories = {
    All: ['All', 'Free'],
    Events: ['Outdoor', 'Date', 'Shopping'],
    Locations: ['Boston', 'Cambridge'],
  };

  const updateFilterParams = (newOption: string, newLocation: string) => {
    const queryParams = new URLSearchParams(window.location.search);
  
    // Update the 'option' query parameter if it's not 'All'
    if (newOption !== 'All') {
      queryParams.set('option', newOption);
    } else {
      queryParams.delete('option');
    }
  
    // Update the 'location' query parameter if it's not 'All'
    if (newLocation !== 'All') {
      queryParams.set('location', newLocation);
    } else {
      queryParams.delete('location');
    }
  
    const newUrl = `${pathname}?${queryParams.toString()}`;
    console.log("Updated URL:", newUrl);  // Log for debugging
  
    // Update the URL without triggering a page reload
    router.push(newUrl);
    router.refresh();
  };
  
  // Fetch the current filter values from the URL
  useEffect(() => {
    const option = filterParams.get('option') || 'All';
    const location = filterParams.get('location') || 'All';

    // Set the current filter state based on URL parameters
    if (categories.Events.includes(option)) {
      setFilterEvents(option);
    } else {
      setFilterEvents('All');
    }

    if (categories.Locations.includes(location)) {
      setFilterLocations(location);
    } else {
      setFilterLocations('All');
    }
  }, [filterParams]);
  
  const handleFilterChange = useCallback(async (option: string, location: string, category: string) => {
    // Update the respective filter states based on the selected category
    if (category === 'Events') {
      setFilterEvents(option);  // Update the event filter
    }
    if (category === 'Locations') {
      setFilterLocations(location);  // Update the location filter
    }
  
    // Update the URL with both the selected option (event filter) and location
    updateFilterParams(option, location);
  
    try {
      // Trigger the filtering logic with the selected option and location
      await onFilter(option, location, category);
    } catch (error) {
      console.error('Filter error:', error);
    }
  }, [onFilter]);
  
  

  return (
    <>
      <style jsx>{`
        .filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 20px;
          padding: 10px;
          background-color: #ffffff;
        }
        .dropdown-container {
          position: relative;
          flex: 1;
        }
        .dropdown-button {
          width: 100%;
          padding: 10px;
          background-color: white;
          border: none;
          font-size: 16px;
          cursor: pointer;
          border-radius: 8px;
        }
        .dropdown-button:focus {
          outline: none;
        }
        .dropdown {
          display: none;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          background-color: white;
          border-radius: 8px;
          box-shadow: none;
          z-index: 10;
          min-width: 100%;
        }
        .dropdown-container:hover .dropdown {
          display: block;
        }
        .dropdown-item {
          padding: 10px;
          cursor: pointer;
        }
        .dropdown-item:hover {
          background-color: #f0f0f0;
        }
        .dropdown-header {
          padding: 8px 10px;
          background-color: #f9f9f9;
          font-weight: bold;
          font-size: 14px;
        }
        .date-picker-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>

      <div className="filter-bar">
        {/* Dropdown for Events */}
        <div className="dropdown-container">
          <button className="dropdown-button">
            {filterEvents === 'All' ? 'Events' : filterEvents}
          </button>
          <div className="dropdown">
            <div className="dropdown-header">Events</div>
            {categories.Events.map((option) => (
              <div
                key={option}
                className="dropdown-item"
                onClick={() => handleFilterChange(option, filterLocations, 'Events')}
              >
                {option}
              </div>
            ))}
          </div>
        </div>

        {/* Dropdown for Locations */}
        <div className="dropdown-container">
          <button className="dropdown-button">
            {filterLocations === 'All' ? 'Locations' : filterLocations}
          </button>
          <div className="dropdown">
            <div className="dropdown-header">Locations</div>
            {categories.Locations.map((location) => (
              <div
                key={location}
                className="dropdown-item"
                onClick={() => handleFilterChange(filterEvents, location, 'Locations')}
              >
                {location}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const Filter: React.FC<FilterProps> = (props) => {
  return <FilterButton {...props} />;
};

export default Filter;
