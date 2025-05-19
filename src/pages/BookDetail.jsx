import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { getBookDetails } from '../api/bookApi';

const BookDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await getBookDetails(id);
        setBook({
          ...data,
          // Mapeamos los nombres si es necesario
          genre: data.category,
          year: data.publicationYear,
          image: data.imageUrl
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error al cargar el libro: {error}
      </div>
    );
  }

  if (!book) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        Libro no encontrado
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Imagen del libro */}
          <div className="md:w-1/3 p-6 flex justify-center bg-gray-50">
            <img
              src={book.imageUrl || '/images/default-book.jpg'}
              alt={book.title}
              className="h-96 object-contain rounded-lg shadow-lg"
              onError={(e) => {
                e.target.src = '/images/default-book.jpg';
                e.target.className = 'h-96 object-contain p-8';
              }}
            />
          </div>
          
          {/* Detalles del libro */}
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">por {book.author}</p>
            
            {/* Badges de información */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {book.category || 'Sin categoría'}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {book.publicationYear || 'Año no disponible'}
              </span>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                {book.rating ? '⭐'.repeat(book.rating) : 'Sin calificación'}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                book.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {book.stock > 0 ? `Disponible (${book.stock})` : 'Agotado'}
              </span>
            </div>
            
            {/* Descripción */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Descripción</h3>
              <p className="text-gray-700">
                {book.description || 'Este libro no tiene descripción disponible.'}
              </p>
            </div>
            
            {/* Detalles adicionales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-semibold text-gray-700">ISBN</h4>
                <p className="text-gray-600">{book.isbn}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Fecha de ingreso</h4>
                <p className="text-gray-600">
                  {new Date(book.dateEntry).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Estado</h4>
                <p className="text-gray-600 capitalize">{book.status?.toLowerCase()}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Páginas</h4>
                <p className="text-gray-600">{book.pageCount || 'N/A'}</p>
              </div>
            </div>
            
            {/* Precio y botón */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t pt-4">
              <div className="mb-4 sm:mb-0">
                <p className="text-sm text-gray-500">Precio</p>
                <p className="text-3xl font-bold text-green-600">
                  ${book.price.toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => addToCart(book)}
                disabled={book.stock <= 0}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  book.stock > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {book.stock > 0 ? 'Añadir al carrito' : 'No disponible'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;