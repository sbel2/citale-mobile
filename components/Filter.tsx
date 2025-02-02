import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
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
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
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

  const eventsDropdownRef = useRef<HTMLDivElement | null>(null);
  const locationsDropdownRef = useRef<HTMLDivElement | null>(null);
  const priceDropdownRef = useRef<HTMLDivElement | null>(null);
  const eventsButtonRef = useRef<HTMLButtonElement | null>(null);
  const locationsButtonRef = useRef<HTMLButtonElement | null>(null);
  const priceButtonRef = useRef<HTMLButtonElement | null>(null);

  // Detect clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (eventsDropdownRef.current && !eventsDropdownRef.current.contains(event.target as Node)) &&
        (eventsButtonRef.current && !eventsButtonRef.current.contains(event.target as Node)) &&
        (locationsDropdownRef.current && !locationsDropdownRef.current.contains(event.target as Node)) &&
        (locationsButtonRef.current && !locationsButtonRef.current.contains(event.target as Node)) &&
        (priceDropdownRef.current && !priceDropdownRef.current.contains(event.target as Node)) &&
        (priceButtonRef.current && !priceButtonRef.current.contains(event.target as Node))
      ) {
        setDropdownOpen(null); // Close any open dropdown if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            .sort((a, b) => a.localeCompare(b))
            : [],
          Locations: locationsData
            ? [...new Set(locationsData.map((item: { location_short: string }) => item.location_short).filter(Boolean))]
            .sort((a, b) => a.localeCompare(b))
            : [],
          Price: priceData
            ? [
                ...new Set(priceData.map((item: { price: string }) => item.price).filter(Boolean))
              ]
                .sort((a, b) => {
                  if (a === 'Free') return -1;
                  if (b === 'Free') return 1;
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

  // Toggle dropdown visibility
  const toggleDropdown = (category: string) => {
    setDropdownOpen(dropdownOpen === category ? null : category);
  };

  return (
    <>
      <style jsx>{`
        .filter-bar {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 15px 0;
          background-color: #fff;
          border-bottom: 1px solid #ddd;
          margin-bottom: 20px;
        }

        .filter-dropdown {
          position: relative;
          margin: 0 15px;
        }

        .filter-button {
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          border: 2px solid #ccc;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background-color 0.3s, border-color 0.3s;
          width: 180px; /* Fixed width for consistency */
          text-align: center; /* Ensure text is centered */
          background-color: #f1f1f1; /* Light grey background */
        }

        .filter-button:hover {
          background-color: #b0b0b0; /* Dark grey on hover */
        }

        .filter-button.active {
          background-color: rgb(122, 122, 122);
          color: white;
          border-color:rgb(122, 122, 122);
        }

        .filter-button span {
          font-size: 10px; /* Smaller arrow */
          margin-left: 8px; /* Push arrow to the right */
        }

        .dropdown-options {
          position: absolute;
          top: 40px;
          left: 0;
          right: 0;
          background-color: white;
          border: 2px solid #ccc;
          border-radius: 8px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 100;
          max-height: 200px;
          overflow-y: auto;
        }

        .dropdown-item {
          padding: 10px;
          cursor: pointer;
        }

        .dropdown-item:hover {
          background-color: #f0f0f0;
        }

        .reset-button {
          margin-left: 20px;
          padding: 10px 20px; /* Same padding as filter button */
          background-color: #fd0000;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-size: 16px;
          width: 180px; /* Fixed width to match the filter buttons */
          text-align: center; /* Center text */
          display: flex;
          justify-content: center; /* Ensure text is centered */
          align-items: center;
        }

        .reset-button:hover {
          background-color: #ff2222;
        }
      `}</style>

      <div className="filter-bar">
        {/* Events Dropdown */}
        <div className="filter-dropdown" ref={eventsDropdownRef}>
          <button
            className={`filter-button ${dropdownOpen === 'Events' ? 'active' : ''}`}
            onClick={() => toggleDropdown('Events')}
            ref={eventsButtonRef}
          >
            {filterEvents === 'All' ? 'Events' : filterEvents}
            <span>▼</span>
          </button>
          {dropdownOpen === 'Events' && (
            <div className="dropdown-options">
              {categories.Events.map((option) => (
                <div
                  key={option}
                  className="dropdown-item"
                  onClick={() => handleFilterChange(option, filterLocations, filterPrice, 'Events')}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Locations Dropdown */}
        <div className="filter-dropdown" ref={locationsDropdownRef}>
          <button
            className={`filter-button ${dropdownOpen === 'Locations' ? 'active' : ''}`}
            onClick={() => toggleDropdown('Locations')}
            ref={locationsButtonRef}
          >
            {filterLocations === 'All' ? 'Locations' : filterLocations}
            <span>▼</span>
          </button>
          {dropdownOpen === 'Locations' && (
            <div className="dropdown-options">
              {categories.Locations.map((location) => (
                <div
                  key={location}
                  className="dropdown-item"
                  onClick={() => handleFilterChange(filterEvents, location, filterPrice, 'Locations')}
                >
                  {location}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price Dropdown */}
        <div className="filter-dropdown" ref={priceDropdownRef}>
          <button
            className={`filter-button ${dropdownOpen === 'Price' ? 'active' : ''}`}
            onClick={() => toggleDropdown('Price')}
            ref={priceButtonRef}
          >
            {filterPrice === 'All' ? 'Price' : filterPrice}
            <span>▼</span>
          </button>
          {dropdownOpen === 'Price' && (
            <div className="dropdown-options">
              {categories.Price.map((price) => (
                <div
                  key={price}
                  className="dropdown-item"
                  onClick={() => handleFilterChange(filterEvents, filterLocations, price, 'Price')}
                >
                  {price}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reset Button */}
        <button className="reset-button" onClick={resetFilters}>
          Reset Filters
        </button>
      </div>
    </>
  );
};

const FilterComponent: React.FC<FilterProps> = (props) => {
  return (
    <Suspense fallback={<div>Loading filters...</div>}>
      <FilterButton {...props} />
    </Suspense>
  );
};

export default FilterComponent;
