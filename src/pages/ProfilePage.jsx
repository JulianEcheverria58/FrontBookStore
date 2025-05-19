import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, rechargeBalance } from '../api/userApi';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    age: '',
    gender: '',
    profession: '',
    balance: 0,
    membershipStatus: 'Active',
    membershipNumber: 'LIB-' + Math.floor(100000 + Math.random() * 900000),
    membershipStartDate: new Date().toLocaleDateString()
  });

  const [rechargeAmount, setRechargeAmount] = useState(50000);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Cargar datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        
        setUserData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          city: data.city || 'Bogotá', // Valor por defecto
          country: data.country || 'Colombia', // Valor por defecto
          age: data.age || '',
          gender: data.gender || 'Masculino', // Valor por defecto
          profession: data.profession || '',
          balance: data.membershipBalance || 0,
          membershipStatus: data.membershipStatus || 'Active',
          membershipNumber: data.membershipNumber || 'LIB-' + Math.floor(100000 + Math.random() * 900000),
          membershipStartDate: data.membershipStartDate ? new Date(data.membershipStartDate).toLocaleDateString() : new Date().toLocaleDateString()
        });
        
        setError('');
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Error al cargar el perfil. Por favor intenta nuevamente.');
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [logout, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedData = {
        name: userData.name,
        phone: userData.phone,
        city: userData.city,
        country: userData.country,
        age: userData.age,
        gender: userData.gender,
        profession: userData.profession
      };
      
      await updateProfile(updatedData);
      setIsEditing(false);
      setError('');
      alert('Perfil actualizado exitosamente');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error al actualizar el perfil. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = async () => {
    if (rechargeAmount < 50000 || rechargeAmount > 200000) {
      setError('El monto debe estar entre $50.000 y $200.000');
      return;
    }
    
    try {
      setLoading(true);
      const { newBalance } = await rechargeBalance(rechargeAmount);
      
      setUserData(prev => ({
        ...prev,
        balance: newBalance
      }));
      
      setError('');
      alert(`Recarga exitosa por $${rechargeAmount.toLocaleString()}`);
    } catch (err) {
      console.error('Error recharging balance:', err);
      setError(err.response?.data?.error || 'Error al recargar saldo. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Tarjeta de Membresía */}
        <div className="md:col-span-1">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold">Library Premium</h2>
                <p className="text-blue-200">Miembro desde: {userData.membershipStartDate}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                userData.membershipStatus === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {userData.membershipStatus}
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-blue-200">Número de membresía</p>
              <p className="text-xl font-mono">{userData.membershipNumber}</p>
            </div>
            
            <div className="bg-black bg-opacity-20 p-4 rounded-lg">
              <p className="text-blue-200">Saldo disponible</p>
              <p className="text-3xl font-bold">
                ${userData.balance.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Sección de Recarga */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold mb-4">Recargar saldo</h3>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Monto a recargar</label>
              <input
                type="number"
                min="50000"
                max="200000"
                step="10000"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(Number(e.target.value))}
                className="w-full p-3 border rounded-lg"
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-1">
                Mínimo $50.000 - Máximo $200.000
              </p>
            </div>
            <button
              onClick={handleRecharge}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold ${
                loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {loading ? 'Procesando...' : `Recargar $${rechargeAmount.toLocaleString()}`}
            </button>
          </div>
        </div>

        {/* Información del Perfil */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Información Personal</h2>
              {isEditing ? (
                <div className="space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className={`px-4 py-2 rounded ${
                      loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                  >
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Editar
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Nombres</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    disabled={loading}
                  />
                ) : (
                  <p className="p-3 border-b">{userData.name}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <p className="p-3 border-b">{userData.email}</p>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Teléfono</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    disabled={loading}
                  />
                ) : (
                  <p className="p-3 border-b">{userData.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Ciudad</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={userData.city}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    disabled={loading}
                  />
                ) : (
                  <p className="p-3 border-b">{userData.city}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">País</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="country"
                    value={userData.country}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    disabled={loading}
                  />
                ) : (
                  <p className="p-3 border-b">{userData.country}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Edad</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="age"
                    value={userData.age}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    disabled={loading}
                  />
                ) : (
                  <p className="p-3 border-b">{userData.age}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Sexo</label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={userData.gender}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    disabled={loading}
                  >
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                    <option value="Prefiero no decir">Prefiero no decir</option>
                  </select>
                ) : (
                  <p className="p-3 border-b">{userData.gender}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Profesión</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="profession"
                    value={userData.profession}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    disabled={loading}
                  />
                ) : (
                  <p className="p-3 border-b">{userData.profession}</p>
                )}
              </div>
            </div>
          </div>

          {/* Historial de Compras (opcional) */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Historial de Compras</h2>
            <p className="text-gray-500">Aquí aparecerá tu historial de compras...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;