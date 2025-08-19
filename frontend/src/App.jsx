import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from './context/hooks';
import IdleTimer from './components/IdleTimer';

// Importar las páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PropertyDetailPage from './pages/PropertyDetailPage';

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
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/property/:propertyId" element={<PropertyDetailPage />} />
        </Routes>
      </main>
    </>
  );
}
export default App;