import React, { useState, useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';

interface FilterProps {
  onFilter: (option: string) => Promise<void>;
}

const FilterButton: React.FC<FilterProps> = ({ onFilter }) => {
  const [filterEvents, setFilterEvents] = useState('Event');
  const [filterLocations, setFilterLocations] = useState('Back Bay');
  const filterParams = useSearchParams();
  const pathname = usePathname();

  // Categories grouped into All, Events, and Locations
  const categories = {
    All: ['All', 'Free'],
    Events: ['Event', 'Performance', 'Music', 'Dating', 'Sport', 'Market', 'Museum', 'Food', 'Art', 'Photography'],
    Locations: ['Back Bay', 'Beacon Hill'],
  };

  useEffect(() => {
    const option = filterParams.get('option');

    // Default to 'All' if on home page (this won't affect "All" filter button)
    if (pathname === '/') {
      setFilterEvents('Event'); // Default event filter
      setFilterLocations('Back Bay'); // Default location filter
    } else if (option) {
      // Keep the "All" filter display static while updating the others
      // Do not change the "All" filter when the URL changes.
    }
  }, [filterParams, pathname]);

  // Handle when a dropdown option is selected for Events or Locations
  const handleFilterChange = async (option: string, category: string) => {
    if (category === 'Events') setFilterEvents(option);
    if (category === 'Locations') setFilterLocations(option);
    
    try {
      await onFilter(option); // Trigger the filter logic after updating the option
    } catch (error) {
      console.error('Filter error:', error);
    }
  };

  // Reset filters to "All" when clicking the "All" button
  const handleResetFilters = async () => {
    setFilterEvents('Event');  // Reset event filter
    setFilterLocations('Back Bay');  // Reset location filter
    await onFilter('All');  // Trigger the filter logic for "All"
  };

  return (
    <>
      <style jsx>{`
        .filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          width: 100%;
          max-width: 100%;
          margin: 20px;
          padding: 10px;
          background-color: #ffffff; /* White background */
        }

        .dropdown-container {
          position: relative;
          flex: 1;
          margin-right: 10px;
        }

        .dropdown-button {
          width: 100%;
          padding: 10px;
          background-color: white;
          border: none; /* Removed border */
          text-align: center;
          font-weight: normal;
          font-size: 16px;
          cursor: pointer;
          border-radius: 8px;
          background-color: #ffffff; /* White background to match */
        }

        .dropdown-button:focus {
          outline: none;
        }

        .dropdown {
          display: none;
          position: absolute;
          top: 0; /* No separation */
          left: 0;
          right: 0;
          background-color: white;
          border-radius: 8px;
          box-shadow: none; /* No box shadow */
          z-index: 10;
          min-width: 100%;
          padding: 0;
        }

        .dropdown-container:hover .dropdown {
          display: block;
        }

        .dropdown-item {
          padding: 10px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .dropdown-item:hover {
          background-color: #f0f0f0;
        }

        .dropdown-header {
          padding: 8px 10px;
          background-color: #f9f9f9; /* Light gray background */
          font-weight: bold;
          text-transform: uppercase;
          font-size: 14px;
          color: #333;
        }

        .hidden-select {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 5;
        }
      `}</style>

      <div className="filter-bar">
        {/* Dropdown for All */}
        <div className="dropdown-container">
          <select
            className="hidden-select"
            value="All"  // This is now static as "All"
            onChange={handleResetFilters} // When "All" is clicked, reset the other filters
          >
            {categories.All.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button className="dropdown-button" onClick={handleResetFilters}>{'All'}</button>
          <div className="dropdown">
            <div className="dropdown-header">All</div>
            {categories.All.map((option) => (
              <div
                key={option}
                className="dropdown-item"
                onClick={handleResetFilters} // Reset the filters when clicking "All"
              >
                {option}
              </div>
            ))}
          </div>
        </div>

        {/* Dropdown for Events */}
        <div className="dropdown-container">
          <select
            className="hidden-select"
            value={filterEvents}
            onChange={(e) => handleFilterChange(e.target.value, 'Events')}
          >
            {categories.Events.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <button className="dropdown-button">{filterEvents}</button>
          <div className="dropdown">
            <div className="dropdown-header">Events</div>
            {categories.Events.map((option) => (
              <div
                key={option}
                className="dropdown-item"
                onClick={() => handleFilterChange(option, 'Events')}
              >
                {option}
              </div>
            ))}
          </div>
        </div>

        {/* Dropdown for Locations */}
        <div className="dropdown-container">
          <select
            className="hidden-select"
            value={filterLocations}
            onChange={(e) => handleFilterChange(e.target.value, 'Locations')}
          >
            {categories.Locations.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <button className="dropdown-button">{filterLocations}</button>
          <div className="dropdown">
            <div className="dropdown-header">Locations</div>
            {categories.Locations.map((option) => (
              <div
                key={option}
                className="dropdown-item"
                onClick={() => handleFilterChange(option, 'Locations')}
              >
                {option}
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