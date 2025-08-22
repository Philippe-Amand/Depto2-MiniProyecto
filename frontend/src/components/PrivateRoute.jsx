import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/hooks';

// Este componente recibe como 'children' el componente que queremos proteger.
function PrivateRoute({ children }) {
  // Usamos nuestro hook de autenticación
  const { user } = useAuth();

  // Si hay un usuario (está logueado), renderizamos el componente hijo.
  // Si no, lo redirigimos a la página de login.
  return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;