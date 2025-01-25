import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';  // Import styles for react-datepicker

interface FilterProps {
  onFilter: (option: string, category: string) => Promise<void>;
}

const FilterButton: React.FC<FilterProps> = ({ onFilter }) => {
  const [filterEvents, setFilterEvents] = useState('All');
  const [filterLocations, setFilterLocations] = useState('All');
  const [filterDate, setFilterDate] = useState<Date | null>(null);  // State for date
  const filterParams = useSearchParams();
  const pathname = usePathname();

  const categories = {
    All: ['All', 'Free'],
    Events: ['Event', 'Performance', 'Music', 'Dating', 'Sport', 'Market', 'Museum', 'Food', 'Art', 'Photography'],
    Locations: ['Back Bay', 'Beacon Hill'],
  };

  useEffect(() => {
    const option = filterParams.get('option');
    if (pathname === '/') {
      setFilterEvents('All');
      setFilterLocations('All');
      setFilterDate(null);  // Reset date filter on home page load
    } else if (option) {
      // Example logic to update filters based on URL params
      if (categories.Events.includes(option)) {
        setFilterEvents(option);
      } else if (categories.Locations.includes(option)) {
        setFilterLocations(option);
      }
    }
  }, [filterParams, pathname]);

  const handleFilterChange = useCallback(async (option: string, category: string) => {
    if (category === 'Events') {
      setFilterEvents(option);
    }
    if (category === 'Locations') {
      setFilterLocations(option);
    }

    try {
      await onFilter(option, category);  // Pass category along with option for flexibility
    } catch (error) {
      console.error('Filter error:', error);
    }
  }, [onFilter]);

  const handleResetFilters = async () => {
    setFilterEvents('All');
    setFilterLocations('All');
    setFilterDate(null);  // Reset date filter
    await onFilter('All', 'All');
  };

  const handleDateChange = async (date: Date | null) => {
    setFilterDate(date);
    // Optionally call onFilter with the selected date
    if (date) {
      await onFilter(date.toISOString(), 'Date');
    } else {
      await onFilter('All', 'Date');  // Reset date filter if no date is selected
    }
  };

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
        {/* Dropdown for All */}
        <div className="dropdown-container">
          <button className="dropdown-button" onClick={handleResetFilters}>
            {filterEvents === 'All' && filterLocations === 'All' ? 'All' : 'All'}
          </button>
          <div className="dropdown">
            <div className="dropdown-header">All</div>
            {categories.All.map((option) => (
              <div
                key={option}
                className="dropdown-item"
                onClick={() => handleResetFilters()}
              >
                {option}
              </div>
            ))}
          </div>
        </div>

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
                onClick={() => handleFilterChange(option, 'Events')}
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

        {/* Date Picker */}
        <div className="date-picker-container">
          <DatePicker
            selected={filterDate}
            onChange={handleDateChange}
            placeholderText="Select a Date"
            dateFormat="MMMM d, yyyy"
            className="dropdown-button"
          />
        </div>
      </div>
    </>
  );
};

const Filter: React.FC<FilterProps> = (props) => {
  return <FilterButton {...props} />;
};

export default Filter;
