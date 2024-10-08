import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FilterProps {
    onFilter: (option: string) => Promise<void>;
}

const FilterButton: React.FC<FilterProps> = ({ onFilter }) => {
  const [filterOption, setFilterOption] = useState('all');
  const router = useRouter();

  const handleFilter = (option: string) => {
    setFilterOption(option)
    if (option.trim()) {
      router.push(`/filter-results?option=${encodeURIComponent(option)}`);
    }
    if (option === 'all'){
      router.push(`/`)
    }
  };

  return (
    <form style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
      <button type="button" onClick={() => handleFilter('all')} style={filterOption === 'all' ? styles.clicked_button:styles.button }>
        ALL
      </button>
      <button type="button" onClick={() => handleFilter('Outdoor')} style={filterOption === 'Outdoor' ? styles.clicked_button:styles.button}>
        Outdoor
      </button>
      <button type="button" onClick={() => handleFilter('Music')} style={filterOption === 'Music' ? styles.clicked_button:styles.button}>
        Music
      </button>
      <button type="button" onClick={() => handleFilter('Museum')} style={filterOption === 'Museum' ? styles.clicked_button:styles.button}>
        Museum
      </button>
    </form>
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

export default FilterButton;