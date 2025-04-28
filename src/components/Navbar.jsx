import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CartIcon from './CartIcon.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/images/logo.png" 
            alt="Logo Book Store" 
            className="h-10 w-10 object-contain" 
          />
          <span className="text-2xl font-bold">BOOK STORE</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:underline hidden md:block">Inicio</Link>
          
          {user ? (
            <>
              <Link to="/profile" className="hover:underline flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Perfil
              </Link>
              <button 
                onClick={logout}
                className="hover:underline flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Iniciar Sesión</Link>
              <Link to="/register" className="hover:underline bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition-colors">
                Registrarse
              </Link>
            </>
          )}
          
          <CartIcon />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;