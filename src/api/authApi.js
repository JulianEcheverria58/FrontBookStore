const API_BASE_URL = "http://localhost:8080/api/users";

const authApi = {
  async login(credentials) {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Credenciales inválidas');
        }

        // Almacena los datos del usuario (sin token)
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    } catch (error) {
        console.error('Error en login:', error);
        throw error;
    }
},

  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el registro');
      }

      return {
        success: true,
        user: data.user,
        token: data.token,
        message: data.message || 'Usuario registrado exitosamente'
      };
    } catch (error) {
      console.error('Error en authApi.register:', error);
      throw error;
    }
  },

  async verifyToken(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Token inválido');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en authApi.verifyToken:', error);
      throw error;
    }
  },
  

async getProfile() {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      credentials: 'include', // Importante para enviar cookies/token
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Asegúrate de guardar el token al hacer login
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener perfil');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en authApi.getProfile:', error);
    throw error;
  }
}

  
};

export default authApi;