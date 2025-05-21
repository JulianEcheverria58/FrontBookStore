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
        console.log('Book image url:', data.imageUrl);
        setBook({
          ...data,
          genre: data.category || 'No category',
          year: data.publicationYear || null,
          image: data.imageUrl || '/images/default-book.jpg',
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
        Error loading book: {error}
      </div>
    );
  }

  if (!book) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        Book not found
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 p-6 flex justify-center bg-gray-50">
            <img
              src={book.image}
              alt={book.title}
              className="h-96 object-contain rounded-lg shadow-lg"
              onError={(e) => {
                e.target.onerror = null; // prevent infinite loop
                e.target.src = '/images/default-book.jpg';
              }}
            />
          </div>

          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author || 'Unknown Author'}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {book.genre}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {book.year || 'Year not available'}
              </span>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                {book.rating ? '⭐'.repeat(Math.round(book.rating)) : 'No rating'}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                book.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {book.stock > 0 ? `In stock (${book.stock})` : 'Out of stock'}
              </span>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Description</h3>
              <p className="text-gray-700">
                {book.description || 'No description available.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-semibold text-gray-700">ISBN</h4>
                <p className="text-gray-600">{book.isbn || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Date Added</h4>
                <p className="text-gray-600">
                  {book.dateEntry ? new Date(book.dateEntry).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Status</h4>
                <p className="text-gray-600 capitalize">{book.status?.toLowerCase() || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Pages</h4>
                <p className="text-gray-600">{book.pageCount || 'N/A'}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t pt-4">
              <div className="mb-4 sm:mb-0">
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-3xl font-bold text-green-600">
                  ${book.price ? book.price.toLocaleString() : 'N/A'}
                </p>
              </div>
              <button
                onClick={() =>
                  addToCart({
                    id: book.bookId || book.id,
                    title: book.title,
                    author: book.author,
                    price: book.price || 0,
                    image: book.image || '/images/default-book.jpg',
                    quantity: 1,
                  })
                }
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                disabled={book.stock <= 0}
              >
                {book.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
