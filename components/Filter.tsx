import React, { useState, useEffect , Suspense } from 'react';
import {useSearchParams, usePathname} from 'next/navigation';

interface FilterProps {
    onFilter: (option: string) => Promise<void>;
}

const FilterButton: React.FC<FilterProps> = ({ onFilter }) => {
  const [filterOption, setFilterOption] = useState('');
  const filterParams = useSearchParams();
  const pathname = usePathname();

  const categories = [
    'All','Outdoor', 'Sport', 'Photography', 'Back Bay', 'Beacon Hill', 'Shopping', 'Market',
    'Music', 'Dating', 'Performance', 'Event', 'Museum', 'Food', 'Art', 'Hackathon'
  ];

  useEffect(() => {
    const option = filterParams.get('option');

    // Check if the current pathname is the home page
    if (pathname === '/') {
        setFilterOption('All'); // Default to 'All' if on home page
    } else if (option) {
        setFilterOption(option); // Set the search query from URL if available
    }
}, [filterParams, pathname]);
  
  //check if user entered a query and calling onsearch to fetch results
  const handleFilterClick = async (option: string) => {
    setFilterOption(option);
    await onFilter(option); // Trigger the filter logic after updating the option
  };

  return (
    <>
    <style jsx>{`
        .hide-scrollbar {
          overflow-x: auto; /* Enable horizontal scrolling */
          -ms-overflow-style: none; /* Internet Explorer and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
        }
      `}</style>
    <div className="flex m-2 xl:justify-center hide-scrollbar">
      {categories.map((category) => (
          <button
              key={category}
              type="button"
              onClick={() => handleFilterClick(category)}
              className={`px-3 py-3 rounded-full text-sm min-w-max ${filterOption === category || (filterOption === '' && category === 'All') ? 'bg-gray-300' : 'bg-white'}`}
          >
              {category}
          </button>
      ))}
    </div>
    </>
  );
};

const Filter = (props: FilterProps) => {
  return (
    <Suspense fallback={null}>
      <FilterButton {...props} />
    </Suspense>
  );
};

const styles = {
  form: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Light grey background
    borderRadius: '25px', // Rounded corners
    padding: '5px 10px', // Add some padding
    width: '100%',
    maxWidth: '200px', // Optional: max width for the search bar
    boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)', // Optional: subtle shadow
  },
  button:{
    marginLeft: '5px',
    padding: '8px',
    borderRadius: '25px',
    // border: '1px solid #ccc',
    fontSize: '16px',
    backgroundColor: 'white',
  },
  clicked_button:{
    marginLeft: '5px',
    padding: '8px',
    borderRadius: '25px',
    // border: '1px solid #ccc',
    fontSize: '16px',
    backgroundColor: '#f0f0f0',
  }
}



export default Filter;