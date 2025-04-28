import { useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const BookDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const books = [
    { 
      id: 1,
      isbn: "9780750000000",
      title: "Harry Potter and the Philosopher's Stone",
      author: "J.K. Rowling",
      genre: "fantasy",
      price: 50000,
      image: "/images/books/harry-potter-1.jpg",
      description: "Harry Potter, an eleven-year-old orphan, discovers that he is a wizard and is invited to study at Hogwarts. Even as he escapes a dreary life and enters a world of magic, he finds trouble awaiting him.",
      rating: 4.8,
      year: 1997,
      
    },
    { 
      id: 2,
      isbn: "9780750000001",
      title: "Harry Potter and the Chamber of Secrets",
      author: "J.K. Rowling",
      genre: "fantasy",
      price: 50000,
      image: "/images/books/harry-potter-2.jpg",
      description: "Harry's second year at Hogwarts takes a dark turn when the Chamber of Secrets is opened, unleashing a monster that petrifies students. Harry must uncover the truth behind the chamber and the legend of the Heir of Slytherin.",
      rating: 4.7,
      year: 1998,
  
    },
    { 
      id: 3,
      isbn: "9780750000002",
      title: "Harry Potter and the Prisoner of Azkaban",
      author: "J.K. Rowling",
      genre: "fantasy",
      price: 50000,
      image: "/images/books/harry-potter-3.jpg",
      description: "Harry learns about his parents' past and confronts the escaped prisoner Sirius Black, who may have been involved in their deaths. With the help of new friends and magical creatures, Harry uncovers shocking truths.",
      rating: 4.9,
      year: 1999,
  
    },
    { 
      id: 4,
      isbn: "9780750000003",
      title: "Harry Potter and the Goblet of Fire",
      author: "J.K. Rowling",
      genre: "fantasy",
      price: 50000,
      image: "/images/books/harry-potter-4.jpg",
      description: "Harry is mysteriously selected as a champion in the dangerous Triwizard Tournament, where he must compete against older and more experienced students. Meanwhile, dark forces are gathering strength.",
      rating: 4.8,
      year: 2000,

    },
    { 
      id: 5,
      isbn: "9780750000004",
      title: "Harry Potter and the Order of the Phoenix",
      author: "J.K. Rowling",
      genre: "fantasy",
      price: 50000,
      image: "/images/books/harry-potter-5.jpg",
      description: "Harry faces government opposition as he learns more about the return of Lord Voldemort. With the Ministry of Magic in denial, Harry and his friends form 'Dumbledore's Army' to prepare for the coming battle.",
      rating: 4.7,
      year: 2003,

    },
    { 
      id: 6,
      isbn: "9780750000005",
      title: "Harry Potter and the Half-Blood Prince",
      author: "J.K. Rowling",
      genre: "fantasy",
      price: 50000,
      image: "/images/books/harry-potter-6.jpg",
      description: "Harry learns about Voldemort's past while preparing for the final battle. With the help of an old textbook marked as 'property of the Half-Blood Prince', Harry excels in Potions class, but dark events loom on the horizon.",
      rating: 4.9,
      year: 2005,

    },
    { 
      id: 7,
      isbn: "9780550000000",
      title: "Harry Potter and the Deathly Hallows",
      author: "J.K. Rowling",
      genre: "fantasy",
      price: 50000,
      image: "/images/books/harry-potter-7.jpg",
      description: "Harry, Ron and Hermione set out to destroy Voldemort's Horcruxes in their final adventure. As the wizarding world plunges into war, Harry discovers the truth about the Deathly Hallows and his own destiny.",
      rating: 4.9,
      year: 2007,

    },
    { 
      id: 8,
      isbn: "9780060000000",
      title: "One Hundred Years of Solitude",
      author: "Gabriel García Márquez",
      genre: "magical realism",
      price: 45000,
      image: "/images/books/solitude.jpg",
      description: "The multi-generational story of the Buendía family, whose patriarch, José Arcadio Buendía, founds the town of Macondo, the metaphoric Colombia. The novel blends magical elements with reality in a unique narrative style.",
      rating: 4.7,
      year: 1967,

    },
    { 
      id: 9,
      isbn: "9780060000001",
      title: "The Lion, the Witch and the Wardrobe",
      author: "C.S. Lewis",
      genre: "fantasy",
      price: 40000,
      image: "/images/books/narnia-1.jpg",
      description: "Four siblings discover a magical world through a wardrobe and help defeat the White Witch, who has cursed Narnia with eternal winter. With the help of the great lion Aslan, they fulfill an ancient prophecy.",
      rating: 4.6,
      year: 1950,

    },
    { 
      id: 10,
      isbn: "9780060000002",
      title: "Prince Caspian",
      author: "C.S. Lewis",
      genre: "fantasy",
      price: 40000,
      image: "/images/books/narnia-2.jpg",
      description: "The Pevensie children return to Narnia to help Prince Caspian reclaim his throne from his evil uncle Miraz. They discover that centuries have passed in Narnia since their last visit.",
      rating: 4.4,
      year: 1951,

    },
    { 
      id: 11,
      isbn: "9780060000003",
      title: "The Voyage of the Dawn Treader",
      author: "C.S. Lewis",
      genre: "fantasy",
      price: 40000,
      image: "/images/books/narnia-3.jpg",
      description: "Edmund, Lucy and their cousin Eustace sail to the edge of the world with King Caspian aboard the Dawn Treader. They encounter magical islands, sea serpents, and discover the fate of the seven lost lords.",
      rating: 4.5,
      year: 1952,

    },
    { 
      id: 12,
      isbn: "9780060000004",
      title: "The Silver Chair",
      author: "C.S. Lewis",
      genre: "fantasy",
      price: 40000,
      image: "/images/books/narnia-4.jpg",
      description: "Eustace and his classmate Jill are sent to Narnia to rescue Prince Rilian, who has been missing for years. Their quest takes them underground where they face the evil Witch and her enchantments.",
      rating: 4.3,
      year: 1953,
 
    },
    { 
      id: 13,
      isbn: "9780060000005",
      title: "The Horse and His Boy",
      author: "C.S. Lewis",
      genre: "fantasy",
      price: 40000,
      image: "/images/books/narnia-5.jpg",
      description: "A boy named Shasta and a talking horse flee from a life of servitude in Calormen. Their journey leads them to Narnia and Archenland, where they uncover a plot of invasion and discover Shasta's true identity.",
      rating: 4.2,
      year: 1954,

    },
    { 
      id: 14,
      isbn: "9780060000006",
      title: "The Magician's Nephew",
      author: "C.S. Lewis",
      genre: "fantasy",
      price: 40000,
      image: "/images/books/narnia-6.jpg",
      description: "Digory and Polly witness the creation of Narnia and bring evil to the new world. This prequel tells the origin story of Narnia, the wardrobe, and the White Witch.",
      rating: 4.4,
      year: 1955,

    },
    { 
      id: 15,
      isbn: "9780060000007",
      title: "The Last Battle",
      author: "C.S. Lewis",
      genre: "fantasy",
      price: 40000,
      image: "/images/books/narnia-7.jpg",
      description: "The final battle for Narnia and the end of the magical world. A false Aslan appears as Narnia faces its greatest challenge, and the characters experience the true meaning of the afterlife.",
      rating: 4.3,
      year: 1956,

    },
    { 
      id: 16,
      isbn: "9780540000000",
      title: "The Fellowship of the Ring",
      author: "J.R.R. Tolkien",
      genre: "fantasy",
      price: 60000,
      image: "/images/books/lotr-1.jpg",
      description: "Frodo Baggins begins his quest to destroy the One Ring in the fires of Mount Doom. The first volume introduces the Fellowship and their journey through Middle-earth.",
      rating: 4.8,
      year: 1954,

    },
    { 
      id: 17,
      isbn: "9780540000001",
      title: "The Two Towers",
      author: "J.R.R. Tolkien",
      genre: "fantasy",
      price: 60000,
      image: "/images/books/lotr-2.jpg",
      description: "The Fellowship is broken but the quest to destroy the Ring continues. The story follows multiple threads as the characters face new dangers and prepare for war.",
      rating: 4.7,
      year: 1954,

    },
    { 
      id: 18,
      isbn: "9780540000002",
      title: "The Return of the King",
      author: "J.R.R. Tolkien",
      genre: "fantasy",
      price: 60000,
      image: "/images/books/lotr-3.jpg",
      description: "The final volume where the fate of Middle-earth is decided. The War of the Ring reaches its climax as Frodo approaches Mount Doom and Aragorn claims his birthright.",
      rating: 4.9,
      year: 1955,

    }
  ];

  const book = books.find(b => b.id === parseInt(id)) || books[0];

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Portada */}
        <div className="flex justify-center">
          <img 
            src={book.image} 
            alt={book.title} 
            className="rounded-lg shadow-lg max-h-96 object-contain bg-gray-100 p-4"
            onError={(e) => {
              e.target.src = '/images/default-book.jpg';
              e.target.classList.add('object-contain', 'p-8');
            }}
          />
        </div>
        
        {/* Información */}
        <div>
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="text-gray-600 mt-2">{book.author} ({book.year})</p>
          
          <div className="flex items-center mt-4">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`h-5 w-5 ${i < Math.floor(book.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-2 text-gray-600">{book.rating}/5</span>
          </div>
          
          <div className="mt-6 space-y-4">
            <p className="text-2xl font-bold">${book.price.toLocaleString()}</p>
            <p><span className="font-semibold">ISBN:</span> {book.isbn}</p>
            <p><span className="font-semibold">Genre:</span> {book.genre}</p>
            </div>
          
          <p className="mt-6 text-gray-700">{book.description}</p>
          
          <div className="mt-8">
            <button 
              onClick={() => addToCart(book)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold"
            >
              Add to Cart - ${book.price.toLocaleString()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;