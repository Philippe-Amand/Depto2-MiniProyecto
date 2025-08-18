
// 1. Cambia las importaciones
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Container, Box, TextField, Button, Typography } from '@mui/material';

function LoginPage() {
  // 2. Usa useContext directamente
  const { loginUser } = useContext(AuthContext); 

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Iniciar Sesión</Typography>
        <Box component="form" onSubmit={loginUser} sx={{ mt: 1 }}> {/* Llama a loginUser en el submit */}
          <TextField margin="normal" required fullWidth id="username" label="Usuario" name="username" autoComplete="username" autoFocus />
          <TextField margin="normal" required fullWidth name="password" label="Contraseña" type="password" id="password" autoComplete="current-password" />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Ingresar
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
export default LoginPage;