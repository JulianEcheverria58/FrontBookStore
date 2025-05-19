import React from 'react';

const BookFilters = ({ onFilterChange, filters }) => {
  const genres = ['Fantasy', 'Magical Realism', 'Dystopian', 'Classic', 'Epic Poetry'];
  const priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: '$0 - $20,000', value: '0-20000' },
    { label: '$20,000 - $40,000', value: '20000-40000' },
    { label: '$40,000+', value: '40000-1000000' }
  ];

  const years = [
    { label: 'All Years', value: 'all' },
    { label: 'Before 2000', value: '0-1999' },
    { label: '2000-2010', value: '2000-2010' },
    { label: '2011-2020', value: '2011-2020' },
    { label: '2021+', value: '2021-2030' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-20 z-20">
      <h3 className="font-bold text-lg mb-4">Filters</h3>
      
      <div className="mb-6">
        <h4 className="font-medium mb-2">Genre</h4>
        <select
          className="w-full p-2 border rounded"
          value={filters.genre || 'all'}
          onChange={(e) => onFilterChange('genre', e.target.value)}
        >
          <option value="all">All Genres</option>
          {genres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-2">Price Range</h4>
        <select
          className="w-full p-2 border rounded"
          value={filters.priceRange || 'all'}
          onChange={(e) => onFilterChange('priceRange', e.target.value)}
        >
          {priceRanges.map(range => (
            <option key={range.value} value={range.value}>{range.label}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-2">Author</h4>
        <input
          type="text"
          placeholder="Filter by author"
          className="w-full p-2 border rounded"
          value={filters.author || ''}
          onChange={(e) => onFilterChange('author', e.target.value)}
        />
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-2">Publication Year</h4>
        <select
          className="w-full p-2 border rounded"
          value={filters.year || 'all'}
          onChange={(e) => onFilterChange('year', e.target.value)}
        >
          {years.map(year => (
            <option key={year.value} value={year.value}>{year.label}</option>
          ))}
        </select>
      </div>

      <button
        onClick={() => onFilterChange('clear')}
        className="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default BookFilters;