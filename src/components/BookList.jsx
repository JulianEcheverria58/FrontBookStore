import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { getBooks } from '../api/bookApi';

// Configuración de Azure Blob Storage (debe coincidir con BookDetail)
const AZURE_STORAGE_URL = 'https://imagesbooks.blob.core.windows.net';
const CONTAINER_NAME = 'bookimages';
const BASE_IMAGE_URL = `${AZURE_STORAGE_URL}/${CONTAINER_NAME}/`;
const DEFAULT_IMAGE = '/images/default-book.jpg';

const BookList = ({ filters = {} }) => {
  const { addToCart } = useCart();
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        setAllBooks(data.map(book => ({
          ...book,
          id: book.bookId,
          genre: book.category || 'Sin género',
          year: book.dateEntry ? new Date(book.dateEntry).getFullYear() : 'N/A',
          // Procesamiento de imagen consistente con BookDetail
          image: book.imageUrl 
            ? `${BASE_IMAGE_URL}${book.imageUrl.trim().toLowerCase()}`
            : DEFAULT_IMAGE
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Filtrado optimizado
  const filteredBooks = allBooks.filter(book => {
    const searchLower = filters.searchQuery?.toLowerCase();
    if (searchLower && 
        !book.title.toLowerCase().includes(searchLower) && 
        !book.isbn.toLowerCase().includes(searchLower)) {
      return false;
    }
    if (filters.genre && filters.genre !== 'all' && book.genre !== filters.genre) {
      return false;
    }
    if (filters.priceRange && filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (book.price < min || book.price > max) return false;
    }
    if (filters.author && 
        !book.author.toLowerCase().includes(filters.author.toLowerCase())) {
      return false;
    }
    if (filters.year && filters.year !== 'all') {
      const [startYear, endYear] = filters.year.split('-').map(Number);
      if (book.year < startYear || book.year > endYear) return false;
    }
    return true;
  });

  if (loading) return (
    <div className="text-center py-8">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      <p className="mt-2">Cargando libros...</p>
    </div>
  );

  if (error) return (
    <div className="text-center py-8">
      <div className="text-red-500 font-medium">Error al cargar libros</div>
      <p className="text-gray-600 mt-1">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-3 px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
      >
        Reintentar
      </button>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {filteredBooks.map(book => (
        <div key={book.id} className="group border rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300">
          <Link to={`/book/${book.id}`} className="block mb-4">     
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-100 mb-4">
              <img 
                src={book.image} 
                alt={`Portada de ${book.title}`}
                className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = DEFAULT_IMAGE;
                  e.target.classList.add('p-4');
                }}
                loading="lazy" // Optimización de carga
              />
            </div>
            
            <h3 className="font-bold text-lg hover:underline line-clamp-2">{book.title}</h3>
            <p className="text-gray-600 mt-1 line-clamp-1">{book.author}</p>
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-500">{book.year}</span>
              {book.rating > 0 && (
                <span className="text-yellow-500 text-sm">
                  {'★'.repeat(Math.round(book.rating))}
                </span>
              )}
            </div>
          </Link>
          
          <div className="mt-4 flex justify-between items-center">
            <span className="font-bold text-lg">
              ${book.price.toLocaleString('es-ES')}
            </span>
            <button 
              onClick={(e) => {
                e.preventDefault();
                addToCart({
                  id: book.id,
                  title: book.title,
                  author: book.author,
                  price: book.price,
                  imageUrl: book.image
                });
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              disabled={book.stock <= 0}
            >
              {book.stock > 0 ? 'Añadir' : 'Agotado'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookList;