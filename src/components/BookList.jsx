import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { getBooks } from '../api/bookApi';

const AZURE_STORAGE_URL = 'https://imagesbooks.blob.core.windows.net';
const CONTAINER_NAME = 'bookimages';
const BASE_IMAGE_URL = `${AZURE_STORAGE_URL}/${CONTAINER_NAME}/`;
const DEFAULT_IMAGE = '/images/default-book.jpg';

const BookList = ({ filters = {} }) => {
  const { addToCart } = useCart();
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extrae el año desde diferentes formatos de fecha
  const extractPublicationYear = (dateString) => {
    if (!dateString) return null;

    if (typeof dateString === 'number') {
      return dateString > 1000 && dateString < 2100 ? dateString : null;
    }

    const isoMatch = dateString.toString().match(/^(\d{4})-\d{2}-\d{2}$/);
    if (isoMatch) return parseInt(isoMatch[1], 10);

    const yearOnly = dateString.toString().match(/^\d{4}$/);
    if (yearOnly) return parseInt(yearOnly[0], 10);

    const anyYearMatch = dateString.toString().match(/(?:^|\D)(\d{4})(?:\D|$)/);
    if (anyYearMatch) return parseInt(anyYearMatch[1], 10);

    return null;
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        setAllBooks(data.map(book => {
          let imageUrl = DEFAULT_IMAGE;
          if (book.imageUrl) {
            const trimmed = book.imageUrl.trim();
            if (trimmed.startsWith('http')) {
              imageUrl = trimmed;
            } else {
              imageUrl = `${BASE_IMAGE_URL}${trimmed.toLowerCase()}`;
            }
          }
          return {
            ...book,
            id: book.bookId,
            genre: book.category || 'Sin género',
            year: extractPublicationYear(book.publication_date || book.publication_year || book.year),
            image: imageUrl,
            stock: book.stock || 0,
            rating: book.rating || 0
          };
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = allBooks.filter(book => {
    const searchLower = filters.searchQuery?.toLowerCase();
    if (searchLower &&
      !book.title.toLowerCase().includes(searchLower) &&
      !book.isbn?.toLowerCase().includes(searchLower)
    ) {
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
      !book.author?.toLowerCase().includes(filters.author.toLowerCase())
    ) {
      return false;
    }

    if (filters.year && filters.year !== 'all') {
      const bookYear = book.year;
      if (!bookYear) return false;

      if (filters.year.includes('-')) {
        const [startYear, endYear] = filters.year.split('-').map(Number);
        if (bookYear < startYear || bookYear > endYear) return false;
      } else {
        const targetYear = parseInt(filters.year, 10);
        if (bookYear !== targetYear) return false;
      }
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

  if (filteredBooks.length === 0) return (
    <div className="text-center py-8">
      <div className="text-gray-500 font-medium">No se encontraron libros</div>
      <p className="text-gray-400 mt-1">Intenta con otros criterios de búsqueda</p>
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
                loading="lazy"
              />
            </div>

            <h3 className="font-bold text-lg hover:underline line-clamp-2">{book.title}</h3>
            <p className="text-gray-600 mt-1 line-clamp-1">{book.author || 'Autor desconocido'}</p>
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-500">
                {book.year || 'Año no disponible'}
              </span>
              {book.rating > 0 && (
                <span className="text-yellow-500 text-sm">
                  {'★'.repeat(Math.round(book.rating))}
                </span>
              )}
            </div>
          </Link>

          <div className="mt-4 flex justify-between items-center">
            <span className="font-bold text-lg">
              ${book.price?.toLocaleString('es-ES') || 'N/A'}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart({
                  id: book.id,
                  title: book.title,
                  author: book.author,
                  price: book.price,
                  image: book.image,
                  quantity: 1
                });
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              disabled={book.stock <= 0}
            >
              {book.stock > 0 ? 'Add to cart' : 'Agotado'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookList;
