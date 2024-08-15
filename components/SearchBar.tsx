import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch } from 'react-icons/fi'; // Import a search icon from react-icons

interface SearchBarProps {
  onSearch: (searchQuery: string) => Promise<void>;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search-results?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} style={styles.form}>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Search posts"
        style={styles.input}
      />
      <button type="submit" style={styles.button}>
        <FiSearch />
      </button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Light grey background
    borderRadius: '25px', // Rounded corners
    padding: '5px 10px', // Add some padding
    width: '100%',
    maxWidth: '400px', // Optional: max width for the search bar
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Optional: subtle shadow
  },
  input: {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    padding: '8px',
    fontSize: '16px',
    borderRadius: '25px',
  },
  button: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    color: '#333',
  },
};

export default SearchBar;
