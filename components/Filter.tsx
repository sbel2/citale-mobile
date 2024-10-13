import React, { useState, useEffect , Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface FilterProps {
    onFilter: (option: string) => Promise<void>;
}

const LoadingFallback = () => <div>Loading search parameters...</div>;

const FilterButton: React.FC<FilterProps> = ({ onFilter }) => {
  const [filterOption, setFilterOption] = useState('');
  const filterParams = useSearchParams();

  // Set searchQuery from URL on mount
  useEffect(() => {
    const option = filterParams.get('option');
    if (option) {
      setFilterOption(option); // Set the search query from URL if available
    }
  }, [filterParams]);
  
  //check if user entered a query and calling onsearch to fetch results
  const handleFilterClick = async (option: string) => {
    setFilterOption(option);
    await onFilter(option); // Trigger the filter logic after updating the option
  };

  return (
    <form style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
      <button type="button" onClick={() => handleFilterClick('all')} style={filterOption === 'all' ? styles.clicked_button:styles.button }>
        ALL
      </button>
      <button type="button" onClick={() => handleFilterClick('Outdoor')} style={filterOption === 'Outdoor' ? styles.clicked_button:styles.button}>
        Outdoor
      </button>
      <button type="button" onClick={() => handleFilterClick('Music')} style={filterOption === 'Music' ? styles.clicked_button:styles.button}>
        Music
      </button>
      <button type="button" onClick={() => handleFilterClick('Museum')} style={filterOption === 'Museum' ? styles.clicked_button:styles.button}>
        Museum
      </button>
    </form>
  );
};

const Filter = (props: FilterProps) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
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