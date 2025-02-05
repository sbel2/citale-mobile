import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/supabase/client';
import { IoIosArrowDown } from "react-icons/io";

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

  const dropdownRefs = {
    Events: useRef<HTMLDivElement | null>(null),
    Locations: useRef<HTMLDivElement | null>(null),
    Price: useRef<HTMLDivElement | null>(null),
  };
  const buttonRefs = {
    Events: useRef<HTMLButtonElement | null>(null),
    Locations: useRef<HTMLButtonElement | null>(null),
    Price: useRef<HTMLButtonElement | null>(null),
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        Object.values(dropdownRefs).every(
          (ref) => ref.current && !ref.current.contains(event.target as Node)
        ) &&
        Object.values(buttonRefs).every(
          (ref) => ref.current && !ref.current.contains(event.target as Node)
        )
      ) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: eventsData, error: eventsError } = await supabase.from('posts').select('categories_short');
        const { data: locationsData, error: locationsError } = await supabase.from('posts').select('location_short');
        const { data: priceData, error: priceError } = await supabase.from('posts').select('price');

        if (eventsError || locationsError || priceError) {
          console.error('Error fetching categories:', eventsError || locationsError || priceError);
          return;
        }

        setCategories({
          Events: eventsData ? [...new Set(eventsData.map((item) => item.categories_short).filter(Boolean))].sort() : [],
          Locations: locationsData ? [...new Set(locationsData.map((item) => item.location_short).filter(Boolean))].sort() : [],
          Price: priceData
            ? [...new Set(priceData.map((item) => item.price).filter(Boolean))].sort((a, b) => (a === 'Free' ? -1 : b === 'Free' ? 1 : a.localeCompare(b)))
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
      if (category === 'Events') setFilterEvents(option);
      if (category === 'Locations') setFilterLocations(location);
      if (category === 'Price') setFilterPrice(price);

      updateFilterParams(option, location, price);

      try {
        await onFilter(option, location, price, category);
      } catch (error) {
        console.error('Filter error:', error);
      }
    },
    [onFilter]
  );

  const resetFilters = () => {
    setFilterEvents('All');
    setFilterLocations('All');
    setFilterPrice('All');
    router.push(`${pathname}?`);
  };

  const toggleDropdown = (category: string) => {
    setDropdownOpen(dropdownOpen === category ? null : category);
  };

  const FilterDropdown = ({ category, selected, options }: { category: string; selected: string; options: string[] }) => (
    <div className="relative mx-4">
      <button
        className={`flex items-center justify-center w-32 px-3 py-2.5 text-center text-sm rounded-full transition-colors 
          ${selected !== 'All' ? 'bg-gray-500 text-white' : 'bg-gray-200 hover:bg-gray-300'} 
          gap-3`}
        onClick={() => toggleDropdown(category)}
        ref={buttonRefs[category as keyof typeof buttonRefs]}
      >
        {selected === 'All' ? category : selected}
        <IoIosArrowDown />
      </button>
      {dropdownOpen === category && (
        <div
        className="absolute top-14 left-0 right-0 bg-white rounded drop-shadow-2xl shadow-2xl z-10 overflow-y-auto max-h-48"
          ref={dropdownRefs[category as keyof typeof dropdownRefs]}
        >
          {options.map((option) => (
            <div
              key={option}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                handleFilterChange(
                  category === 'Events' ? option : filterEvents,
                  category === 'Locations' ? option : filterLocations,
                  category === 'Price' ? option : filterPrice,
                  category
                );
                setDropdownOpen(null); // Close dropdown when a category is selected
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );  


  return (
    <div className="bg-white flex justify-center items-center pt-5">
      <FilterDropdown category="Events" selected={filterEvents} options={categories.Events} />
      <FilterDropdown category="Locations" selected={filterLocations} options={categories.Locations} />
      <FilterDropdown category="Price" selected={filterPrice} options={categories.Price} />

      <button
        className="ml-5 w-32 px-4 py-2 bg-[#fd0000] text-white rounded-full cursor-pointer hover:bg-red-600 text-center flex justify-center items-center"
        onClick={resetFilters}
      >
        Reset
      </button>
    </div>
  );
};

const FilterComponent: React.FC<FilterProps> = (props) => (
  <Suspense fallback={<div>Loading filters...</div>}>
    <FilterButton {...props} />
  </Suspense>
);

export default FilterComponent;
