import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const BookList = ({ filters = {} }) => {
  const { addToCart } = useCart();
  
  const allBooks = [
    { 
      id: 1,
      isbn: "9780750000000",
      title: "Harry Potter and the Philosopher's Stone",
      author: "J.K. Rowling",
      genre: "fantasy",
      price: 50000,
      image: "/images/books/harry-potter-1.jpg",     
      year: 1997
    },
    { 
      id: 2,
      isbn: "9780750000001",
      title: "Harry Potter and the Chamber of Secrets",
      author: "J.K. Rowling",
      genre: "fantasy",
      price: 50000,
      image: "/images/books/harry-potter-2.jpg",
      year: 1998
    },
    { 
      id: 3,
      isbn: "9780750000002",
      title: "Harry Potter and the Prisoner of Azkaban",
      author: "J.K. Rowling",
      genre: "fantasy",
      price: 50000,
      image: "/images/books/harry-potter-3.jpg",
      year: 1999
    },
    { 
      id: 4,
      isbn: "9780750000003",
      title: "Harry Potter and the Goblet of Fire",
      author: "J.K. Rowling",
      genre: "fantasy",
      price: 50000,
      image: "/images/books/harry-potter-4.jpg",
      year: 2000
    },
    { 
      id: 5,
      isbn: "9780750000004",
      title: "Harry Potter and the Order of the Phoenix",
      author: "J.K. Rowling",
      genre: "fantasy",
      price: 50000,
      image: "/images/books/harry-potter-5.jpg",
      year: 2003
    },
    { 
      id: 6,
      isbn: "9780750000005",
      title: "Harry Potter and the Half-Blood Prince",
      author: "J.K. Rowling",
      genre: "fantasy",
      price: 50000,
      image: "/images/books/harry-potter-6.jpg",
      year: 2005
    },
    { 
      id: 7,
      isbn: "9780550000000",
      title: "Harry Potter and the Deathly Hallows",
      author: "J.K. Rowling",
      genre: "fantasy",
      price: 50000,
      image: "/images/books/harry-potter-7.jpg", 
      year: 2007
    },
    { 
      id: 8,
      isbn: "9780060000000",
      title: "One Hundred Years of Solitude",
      author: "Gabriel García Márquez",
      genre: "magical realism",
      price: 45000,
      image: "/images/books/solitude.jpg", 
      year: 1967
    },
    { 
      id: 9,
      isbn: "9780060000001",
      title: "The Lion, the Witch and the Wardrobe",
      author: "C.S. Lewis",
      genre: "fantasy",
      price: 40000,
      image: "/images/books/narnia-1.jpg",
      year: 1950
    },
    { 
      id: 10,
      isbn: "9780060000002",
      title: "Prince Caspian",
      author: "C.S. Lewis",
      genre: "fantasy",
      price: 40000,
      image: "/images/books/narnia-2.jpg",
      year: 1951
    },
    { 
      id: 11,
      isbn: "9780060000003",
      title: "The Voyage of the Dawn Treader",
      author: "C.S. Lewis",
      genre: "fantasy",
      price: 40000,
      image: "/images/books/narnia-3.jpg",
      year: 1952
    },
    { 
      id: 12,
      isbn: "9780060000004",
      title: "The Silver Chair",
      author: "C.S. Lewis",
      genre: "fantasy",
      price: 40000,
      image: "/images/books/narnia-4.jpg",
      year: 1953
    },
    { 
      id: 13,
      isbn: "9780060000005",
      title: "The Horse and His Boy",
      author: "C.S. Lewis",
      genre: "fantasy",
      price: 40000,
      image: "/images/books/narnia-5.jpg",
      year: 1954
    },
    { 
      id: 14,
      isbn: "9780060000006",
      title: "The Magician's Nephew",
      author: "C.S. Lewis",
      genre: "fantasy",
      price: 40000,
      image: "/images/books/narnia-6.jpg",
      year: 1955
    },
    { 
      id: 15,
      isbn: "9780060000007",
      title: "The Last Battle",
      author: "C.S. Lewis",
      genre: "fantasy",
      price: 40000,
      image: "/images/books/narnia-7.jpg",
      year: 1956
    },
    { 
      id: 16,
      isbn: "9780540000000",
      title: "The Fellowship of the Ring",
      author: "J.R.R. Tolkien",
      genre: "fantasy",
      price: 60000,
      image: "/images/books/lotr-1.jpg",
      year: 1954
    },
    { 
      id: 17,
      isbn: "9780540000001",
      title: "The Two Towers",
      author: "J.R.R. Tolkien",
      genre: "fantasy",
      price: 60000,
      image: "/images/books/lotr-2.jpg",
      year: 1954
    },
    { 
      id: 18,
      isbn: "9780540000002",
      title: "The Return of the King",
      author: "J.R.R. Tolkien",
      genre: "fantasy",
      price: 60000,
      image: "/images/books/lotr-3.jpg",
      year: 1955
    }
  ];

  // Filtrado
  const filteredBooks = allBooks.filter(book => {
   if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      const matchesTitle = book.title.toLowerCase().includes(searchLower);
      const matchesISBN = book.isbn.toLowerCase().includes(searchLower);
      if (!matchesTitle && !matchesISBN) return false;
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {filteredBooks.map(book => (
        <div key={book.id} className="group border rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300">
          <Link to={`/book/${book.id}`} className="block mb-4">     
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-100 mb-4">
              <img 
                src={book.image} 
                alt={book.title}
                className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = '/images/default-book.jpg';
                  e.target.classList.add('object-contain', 'p-8');
                }}
              />
            </div>
            
            <h3 className="font-bold text-lg hover:underline line-clamp-2">{book.title}</h3>
            <p className="text-gray-600 mt-1">{book.author}</p>
            <p className="text-sm text-gray-500 mt-1">{book.year}</p>
          </Link>
          
          <div className="mt-4 flex justify-between items-center">
            <span className="font-bold text-lg">${book.price.toLocaleString()}</span>
            <button 
              onClick={(e) => {
                e.preventDefault();
                addToCart(book);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookList;