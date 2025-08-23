import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../apiConfig';
import { Box, CircularProgress, Typography } from '@mui/material';

function PaymentReturnPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token_ws');
    

    // Si Transbank cancela, devuelve otros tokens, los empaquetamos y enviamos a confirmar.
    const requestData = token ? { token_ws: token } : {
      TBK_TOKEN: searchParams.get('TBK_TOKEN'),
      TBK_ORDEN_COMPRA: searchParams.get('TBK_ORDEN_COMPRA'),
      TBK_ID_SESION: searchParams.get('TBK_ID_SESION'),
    };

    const confirmPayment = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/payments/confirm/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
        });
        const data = await response.json();
        
        // Redirigir a la página de resultado con la información
        navigate(`/payment/result?status=${data.status}`, { state: { details: data.details } });

      } catch (e) {
        navigate('/payment/result?status=error', { state: { message: e.message } });
      }
    };

    confirmPayment();
  }, [navigate, searchParams]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>Procesando tu pago, por favor espera...</Typography>
    </Box>
  );
}
export default PaymentReturnPage;