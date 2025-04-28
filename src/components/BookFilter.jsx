const BookFilter = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-4">
      {/* Filtro por Género */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
        <select
          name="genre"
          value={filters.genre || 'all'}
          onChange={handleChange}
          className="w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Genres</option>
          <option value="fantasy">Fantasy</option>
          <option value="magical realism">Magical Realism</option>
          <option value="scifi">Science Fiction</option>
          <option value="romance">Romance</option>
          <option value="dystopian">Dystopian</option>
        </select>
      </div>

      {/* Filtro por Precio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
        <select
          name="priceRange"
          value={filters.priceRange || 'all'}
          onChange={handleChange}
          className="w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Prices</option>
          <option value="30000-40000">$30,000 - $40,000</option>
          <option value="40000-50000">$40,000 - $50,000</option>
          <option value="50000-60000">$50,000 - $60,000</option>
        </select>
      </div>

      {/* Filtro por Autor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
        <input
          type="text"
          name="author"
          placeholder="Filter by author"
          value={filters.author || ''}
          onChange={handleChange}
          className="w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Filtro por Año */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Publication Year</label>
        <select
          name="year"
          value={filters.year || 'all'}
          onChange={handleChange}
          className="w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Years</option>
          <option value="1950-1959">1950s </option>
          <option value="1960-1969">1960s </option>
          <option value="1990-1999">1990s </option>
          <option value="2000-2010">2000s </option>
          <option value="2010-2020">2010s </option>
          <option value="2020-2030">2020s </option>
          </select>
      </div>

      {/* Botón para limpiar filtros */}
      <button
        onClick={() => setFilters({
          genre: 'all',
          priceRange: 'all',
          author: '',
          year: 'all',
          searchQuery: filters.searchQuery // Mantenemos la búsqueda
        })}
        className="w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default BookFilter;