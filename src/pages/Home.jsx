import { useState } from 'react';
import BookSearch from '../components/BookSearch';
import BookFilter from '../components/BookFilter';
import BookList from '../components/BookList';

const Home = () => {
  const [filters, setFilters] = useState({
    genre: 'all',
    priceRange: 'all',
    author: '',
    publicationDate: '',
    searchQuery: ''
  });

  const handleSearch = (query) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: query
    }));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">     
      <div className="w-full md:w-64 lg:w-80 bg-gray-50 p-4 border-r">
        <div className="sticky top-4">
          <h2 className="text-xl font-bold mb-4">Filters</h2>
          <BookFilter filters={filters} setFilters={setFilters} />
        </div>
      </div>

   
      <div className="flex-1 p-4">       
        <BookSearch onSearch={handleSearch} />
        <BookList filters={filters} />
      </div>
    </div>
  );
};

export default Home;