import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CartIcon from './CartIcon';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-black text-white shadow-sm fixed w-full z-10">
      <div className="flex justify-between items-center h-16 w-full px-4">
        {/* Izquierda: Logo + Título */}
        <div className="flex items-center space-x-2">
          <img src="/images/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
          <Link to="/" className="text-xl font-bold text-white">
            BookStore
          </Link>
        </div>

        {/* Derecha: Botones + Carrito */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-blue-400">Home</Link>

          {user ? (
            <>
              <span className="text-white">Hello, {user.name}</span>
              <Link to="/profile" className="hover:text-blue-400">Profile</Link>
              <button 
                onClick={logout}
                className="hover:text-blue-400"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-400">login</Link>
              <Link to="/register" className="hover:text-blue-400">Registrarse</Link>
            </>
          )}

          <CartIcon className="text-white" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
