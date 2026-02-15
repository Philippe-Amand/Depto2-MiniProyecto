// frontend/src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL } from '../apiConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => 
    localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
  );
  const [user, setUser] = useState(() => 
    localStorage.getItem('authTokens') ? jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access) : null
  );
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: e.target.username.value, password: e.target.password.value }),
      });
      const data = await response.json();
      if (!response.ok) throw data;

      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem('authTokens', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      alert('Error al iniciar sesión: Verifique usuario o contraseña.');
    }
    
  };
  
  // FUNCIÓN CRÍTICA: Asegúrate de que esta función es correcta
  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    navigate('/login'); // <-- La redirección clave
  };

  const contextData = {
    user,
    token: authTokens?.access,
    loginUser,
    logoutUser, // <-- Se exporta correctamente
  };

  useEffect(() => {
    // ... (el useEffect no cambia)
  }, [authTokens]);

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;




