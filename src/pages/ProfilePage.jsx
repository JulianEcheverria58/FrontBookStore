import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, rechargeBalance } from '../api/userApi';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    city: 'Bogotá',
    country: 'Colombia',
    age: '',
    gender: 'Male',
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        if (!user?.email) {
          throw new Error('No authenticated user');
        }

        const data = await getProfile(user.email);

        setProfileData(prev => ({
          ...prev,
          name: data.name || '',
          email: data.email || user.email,
          phone: data.phone || '',
          city: data.city || 'Bogotá',
          country: data.country || 'Colombia',
          age: data.age || '',
          gender: data.gender || 'Male',
          profession: data.profession || '',
          balance: data.membershipBalance || 0,
          membershipStatus: data.membershipStatus || 'Active',
          membershipNumber: data.membershipNumber || prev.membershipNumber,
          membershipStartDate: data.membershipStartDate 
            ? new Date(data.membershipStartDate).toLocaleDateString() 
            : prev.membershipStartDate
        }));

        setError('');
      } catch (err) {
        console.error('Error loading profile:', err);
        setError(err.message || 'Error loading profile');
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user, logout, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedData = {
        name: profileData.name,
        phone: profileData.phone,
        city: profileData.city,
        country: profileData.country,
        age: profileData.age,
        gender: profileData.gender,
        profession: profileData.profession
      };

      await updateProfile(user.email, updatedData);
      setIsEditing(false);
      setError('');
      alert('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.error || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = async () => {
    if (!user?.email) {
      setError('No authenticated user');
      return;
    }

    if (rechargeAmount < 50000 || rechargeAmount > 200000) {
      setError('The amount must be between $50,000 and $200,000');
      return;
    }

    try {
      setLoading(true);
      const { newBalance } = await rechargeBalance(user.email, rechargeAmount);

      setProfileData(prev => ({
        ...prev,
        balance: newBalance
      }));

      setError('');
      alert(`Successfully recharged $${rechargeAmount.toLocaleString()}`);
    } catch (err) {
      console.error('Error recharging balance:', err);
      setError(err.response?.data?.error || 'Error recharging balance');
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
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Membership Card */}
        <div className="md:col-span-1">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold">Library Premium</h2>
                <p className="text-blue-200">Member since: {profileData.membershipStartDate}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                profileData.membershipStatus === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {profileData.membershipStatus}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-blue-200">Membership Number</p>
              <p className="text-xl font-mono">{profileData.membershipNumber}</p>
            </div>

            <div className="bg-black bg-opacity-20 p-4 rounded-lg">
              <p className="text-blue-200">Available Balance</p>
              <p className="text-3xl font-bold">
                ${profileData.balance.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Recharge Section */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold mb-4">Recharge Balance</h3>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Amount to recharge</label>
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
                Min $50,000 - Max $200,000
              </p>
            </div>
            <button
              onClick={handleRecharge}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold ${
                loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {loading ? 'Processing...' : `Recharge $${rechargeAmount.toLocaleString()}`}
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Personal Information</h2>
              {isEditing ? (
                <div className="space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className={`px-4 py-2 rounded ${
                      loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    disabled={loading}
                  />
                ) : (
                  <p className="p-3 border-b">{profileData.name}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <p className="p-3 border-b">{profileData.email}</p>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    disabled={loading}
                  />
                ) : (
                  <p className="p-3 border-b">{profileData.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">City</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={profileData.city}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    disabled={loading}
                  />
                ) : (
                  <p className="p-3 border-b">{profileData.city}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Country</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="country"
                    value={profileData.country}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    disabled={loading}
                  />
                ) : (
                  <p className="p-3 border-b">{profileData.country}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Age</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="age"
                    value={profileData.age}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    disabled={loading}
                  />
                ) : (
                  <p className="p-3 border-b">{profileData.age}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Gender</label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={profileData.gender}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    disabled={loading}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="p-3 border-b">{profileData.gender}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Profession</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="profession"
                    value={profileData.profession}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    disabled={loading}
                  />
                ) : (
                  <p className="p-3 border-b">{profileData.profession}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
