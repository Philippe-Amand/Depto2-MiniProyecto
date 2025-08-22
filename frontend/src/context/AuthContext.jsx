import { createContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
export default AuthContext;// <-- Hacemos esta la exportación por defecto

// 2. Exporta el componente Provider como una exportación nombrada.
export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => 
    localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
  );
  const [user, setUser] = useState(() => {
  const tokens = localStorage.getItem('authTokens');
  if (tokens) {
    // Primero, parseamos el string JSON para convertirlo en un objeto JavaScript.
    const parsedTokens = JSON.parse(tokens);
    // Luego, pasamos SOLO el token de acceso a jwt_decode.
     return jwtDecode(parsedTokens.access);
  }
  return null;
  });
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    const response = await fetch('http://127.0.0.1:8000/api/v1/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: e.target.username.value, password: e.target.password.value }),
    });
    const data = await response.json();

    if (response.ok) {
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem('authTokens', JSON.stringify(data));
      navigate('/');
    } else {
      alert('¡Algo salió mal! Verifica tus credenciales.');
    }
  };

  const logoutUser = () => {

    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    navigate('/login');
  };
  
  const contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };
  

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};




