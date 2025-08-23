import { useSearchParams, useLocation, Link as RouterLink } from 'react-router-dom';
import { Box, Container, Paper, Typography, Button, Alert } from '@mui/material';

function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const status = searchParams.get('status');
  const details = location.state?.details;
  const message = location.state?.message;

  return (
    <Container sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        {status === 'success' && (
          <>
            <Typography variant="h4" gutterBottom color="success.main">¡Pago Exitoso!</Typography>
            <Typography>Gracias por tu compra. Tu transacción ha sido completada.</Typography>
            {details && <Typography>Monto: ${details.amount}</Typography>}
            {details && <Typography>Orden de Compra: {details.buy_order}</Typography>}
          </>
        )}
        {status === 'failed' && (
            <Alert severity="warning">
                <Typography variant="h4" gutterBottom>Pago Rechazado</Typography>
                <Typography>Tu pago no pudo ser procesado.</Typography>
                {details && <Typography>{details.response_code}: {details.card_detail?.card_number}</Typography>}
            </Alert>
        )}
        {status === 'error' && (
            <Alert severity="error">
                <Typography variant="h4" gutterBottom>Error en la Transacción</Typography>
                <Typography>Ocurrió un error al procesar tu pago: {message}</Typography>
            </Alert>
        )}
        <Button component={RouterLink} to="/" variant="contained" sx={{ mt: 3 }}>Volver al Inicio</Button>
      </Paper>
    </Container>
  );
}
export default PaymentResultPage;