import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: '',
    city: '',
    country: '',
    age: '',
    gender: '',
    profession: '',
    balance: 0,
    membershipNumber: 'LIB-' + Math.floor(100000 + Math.random() * 900000)
  });

  const [rechargeAmount, setRechargeAmount] = useState(50000);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Simular carga de datos del usuario
  useEffect(() => {
    // API datos del usuario
    const fetchUserData = async () => {
      // const data = await userService.getProfile();
      const mockData = {
        name: 'Julian Echeverria',
        city: 'Bogotá',
        country: 'Colombia',
        age: 32,
        gender: 'Masculino',
        profession: 'Ingeniero',
        balance: 500000
      };
      setUserData(prev => ({ ...prev, ...mockData }));
    };
    
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // llamada a la API para guardar los cambios
    console.log('Datos guardados:', userData);
    setIsEditing(false);
  };

  const handleRecharge = () => {
    if (rechargeAmount < 50000 || rechargeAmount > 200000) {
      alert('El monto debe estar entre $50.000 y $200.000');
      return;
    }
    
    // Simular recarga
    setUserData(prev => ({
      ...prev,
      balance: prev.balance + rechargeAmount
    }));
    alert(`Recarga exitosa por $${rechargeAmount.toLocaleString()}`);
  };

  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Tarjeta de Membresía */}
        <div className="md:col-span-1">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold">Library Premium</h2>
                <p className="text-blue-200">Miembro desde: 01/2025</p>
              </div>
              <div className="bg-white text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                Activa
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
              />
              <p className="text-sm text-gray-500 mt-1">
                Mínimo $50.000 - Máximo $200.000
              </p>
            </div>
            <button
              onClick={handleRecharge}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold"
            >
              Recargar ${rechargeAmount.toLocaleString()}
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
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
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
                  />
                ) : (
                  <p className="p-3 border-b">{userData.name}</p>
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