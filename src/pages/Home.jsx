import React, { useState } from 'react';
import BookFilters from '../components/BookFilter';
import BookList from '../components/BookList';
import BookSearch from '../components/BookSearch';

const Home = () => {
  const [filters, setFilters] = useState({});

  const handleFilterChange = (type, value) => {
    if (type === 'clear') {
      setFilters({});
    } else {
      setFilters(prev => ({ ...prev, [type]: value === 'all' ? undefined : value }));
    }
  };

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BookSearch onSearch={handleSearch} />
      
      <div className="flex flex-col md:flex-row gap-8 mt-6">
        <div className="md:w-1/4">
          <BookFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>
        
        <div className="md:w-3/4">
          <BookList filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default Home;