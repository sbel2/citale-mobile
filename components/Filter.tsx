import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import 'react-datepicker/dist/react-datepicker.css';
import { createClient } from '@/supabase/client';

// Initialize Supabase client
const supabase = createClient();

interface FilterProps {
  onFilter: (option: string, location: string, price: string, category: string) => Promise<void>;
}

const FilterButton: React.FC<FilterProps> = ({ onFilter }) => {
  const [filterEvents, setFilterEvents] = useState('All');
  const [filterLocations, setFilterLocations] = useState('All');
  const [filterPrice, setFilterPrice] = useState('All');
  const filterParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [categories, setCategories] = useState<{
    Price: string[];
    Events: string[];
    Locations: string[];
  }>({
    Price: [],
    Events: [],
    Locations: [],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: eventsData, error: eventsError } = await supabase
          .from('posts')
          .select('categories_short');

        const { data: locationsData, error: locationsError } = await supabase
          .from('posts')
          .select('location_short');

        const { data: priceData, error: priceError } = await supabase
          .from('posts')
          .select('price');

        if (eventsError || locationsError || priceError) {
          console.error('Error fetching categories:', eventsError || locationsError || priceError);
          return;
        }

        setCategories({
          Events: eventsData
            ? [...new Set(eventsData.map((item: { categories_short: string }) => item.categories_short).filter(Boolean))]
            .sort((a, b) => a.localeCompare(b)) // Sort alphabetically
            : [],
          Locations: locationsData
            ? [...new Set(locationsData.map((item: { location_short: string }) => item.location_short).filter(Boolean))]
            .sort((a, b) => a.localeCompare(b)) // Sort alphabetically
            : [],
          Price: priceData
            ? [
                ...new Set(priceData.map((item: { price: string }) => item.price).filter(Boolean))
              ]
                .sort((a, b) => {
                  // Move "Free" to the top
                  if (a === 'Free') return -1;
                  if (b === 'Free') return 1;

                  // Otherwise, sort alphabetically
                  return a.localeCompare(b);
                })
            : [],
        });
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };

    fetchCategories();
  }, []);

  const updateFilterParams = (newOption: string, newLocation: string, newPrice: string) => {
    const queryParams = new URLSearchParams(window.location.search);

    newOption !== 'All' ? queryParams.set('option', newOption) : queryParams.delete('option');
    newLocation !== 'All' ? queryParams.set('location', newLocation) : queryParams.delete('location');
    newPrice !== 'All' ? queryParams.set('price', newPrice) : queryParams.delete('price');

    router.push(`${pathname}?${queryParams.toString()}`);
  };

  useEffect(() => {
    const option = filterParams.get('option') || 'All';
    const location = filterParams.get('location') || 'All';
    const price = filterParams.get('price') || 'All';

    setFilterEvents(categories.Events.includes(option) ? option : 'All');
    setFilterLocations(categories.Locations.includes(location) ? location : 'All');
    setFilterPrice(categories.Price.includes(price) ? price : 'All');
  }, [filterParams, categories]);

  const handleFilterChange = useCallback(
    async (option: string, location: string, price: string, category: string) => {
      category === 'Events' && setFilterEvents(option);
      category === 'Locations' && setFilterLocations(location);
      category === 'Price' && setFilterPrice(price);

      updateFilterParams(option, location, price);

      try {
        await onFilter(option, location, price, category);
      } catch (error) {
        console.error('Filter error:', error);
      }
    },
    [onFilter]
  );

  // Reset all filters
  const resetFilters = () => {
    setFilterEvents('All');
    setFilterLocations('All');
    setFilterPrice('All');

    // Remove all query parameters
    const queryParams = new URLSearchParams();
    router.push(`${pathname}?${queryParams.toString()}`);
  };

  return (
    <>
      <style jsx>{`
        .filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 10px;
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
        .reset-button {
          margin-left: 10px;
          padding: 10px 15px;
          background-color: #fd0000;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
        .reset-button:hover {
          background-color: #ff2222;
        }
      `}</style>
      <div className="filter-bar">
        {/* Dropdown for Events */}
        <div className="dropdown-container">
          <button className="dropdown-button">{filterEvents === 'All' ? 'Events' : filterEvents}</button>
          <div className="dropdown">
            <div className="dropdown-header">Events</div>
            {categories.Events.map((option) => (
              <div key={option} className="dropdown-item" onClick={() => handleFilterChange(option, filterLocations, filterPrice, 'Events')}>
                {option}
              </div>
            ))}
          </div>
        </div>

        {/* Dropdown for Locations */}
        <div className="dropdown-container">
          <button className="dropdown-button">{filterLocations === 'All' ? 'Locations' : filterLocations}</button>
          <div className="dropdown">
            <div className="dropdown-header">Locations</div>
            {categories.Locations.map((location) => (
              <div key={location} className="dropdown-item" onClick={() => handleFilterChange(filterEvents, location, filterPrice, 'Locations')}>
                {location}
              </div>
            ))}
          </div>
        </div>

        {/* Dropdown for Price */}
        <div className="dropdown-container">
          <button className="dropdown-button">{filterPrice === 'All' ? 'Price' : filterPrice}</button>
          <div className="dropdown">
            <div className="dropdown-header">Price</div>
            {categories.Price.map((price) => (
              <div key={price} className="dropdown-item" onClick={() => handleFilterChange(filterEvents, filterLocations, price, 'Price')}>
                {price}
              </div>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <button className="reset-button" onClick={resetFilters}>
          Reset All Filters
        </button>
      </div>
    </>
  );
};

const Filter: React.FC<FilterProps> = (props) => {
  return <FilterButton {...props} />;
};

export default Filter;
