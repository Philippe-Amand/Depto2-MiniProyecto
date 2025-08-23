import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { API_BASE_URL } from '../apiConfig';
import { useAuth } from '../context/hooks';

function CheckoutPage() {
  const { propertyId } = useParams(); // Para saber qué propiedad pagar
  const { authTokens } = useAuth();
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/create/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authTokens.access}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ property_id: parseInt(propertyId) })
      });
      
      if (!response.ok) throw new Error('No se pudo iniciar la transacción.');
      
      const data = await response.json();
      if (data.url && data.token) {
        // Forma correcta de redirigir a Webpay
        window.location.href = `${data.url}?token_ws=${data.token}`;
      } else {
        throw new Error('Respuesta inválida desde el servidor.');
      }
    } catch (e) {
      alert(`Error al iniciar el pago: ${e.message}`);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>Confirmar Compra</Typography>
        <Typography sx={{ my: 2 }}>Estás a punto de iniciar el proceso de pago para la propiedad ID: {propertyId}.</Typography>
        <Box>
          <Button variant="contained" color="primary" onClick={handlePayment}>Pagar con Webpay</Button>
          <Button sx={{ ml: 2 }} onClick={() => navigate('/')}>Cancelar</Button>
        </Box>
      </Paper>
    </Container>
  );
}
export default CheckoutPage;