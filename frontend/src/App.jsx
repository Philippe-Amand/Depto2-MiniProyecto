import { Routes, Route, Link, Navigate  } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from './context/hooks';
import IdleTimer from './components/IdleTimer';

// Importar las páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { user, logoutUser } = useAuth();
  return (
    <>
    {user && <IdleTimer />}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
            Depto2
          </Typography>
          
          {user ? (
            // Si el usuario está logueado
            <Box>
              <Typography component="span" sx={{ mr: 2 }}>
                Hola, {user.username}
              </Typography>
              <Button color="inherit" onClick={logoutUser}>Logout</Button>
            </Box>
          ) : (
            // Si el usuario NO está logueado
            <Box>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </Box>
          )}

        </Toolbar>
      </AppBar>
      
      <main>
        <Routes>
          {/* --- RUTA DE LOGIN (PÚBLICA) --- */}
          <Route path="/login" element={<LoginPage />} />
          {/* --- RUTA DE REGISTRO (PÚBLICA) --- */}
          <Route path="/register" element={<RegisterPage />} />
          
          {/* --- RUTA PRINCIPAL (AHORA PROTEGIDA) --- */}
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            } 
          />
          
          {/* --- RUTA DE DETALLE (AHORA PROTEGIDA) --- */}
          <Route 
            path="/property/:propertyId" 
            element={
              <PrivateRoute>
                <PropertyDetailPage />
              </PrivateRoute>
            } 
          />

          {/* OPCIONAL: Una ruta "catch-all" que redirige a login si no se encuentra la ruta */}
          <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
      </main>
    </>
  );
}
export default App;