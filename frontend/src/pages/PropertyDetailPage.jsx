// frontend/src/pages/PropertyDetailPage.jsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../apiConfig'; // Eliminamos API_DOMAIN que no se usa aquí
import { useAuth } from '../context/hooks';
import { 
  Container, 
  Typography, 
  CircularProgress, 
  Alert, 
  Box, 
  Paper, 
  Grid,
  Button 
} from '@mui/material';
import ReactPlayer from 'react-player';
import MapComponent from '../components/MapComponent';

// --- NUEVO: Componente de utilidad para mostrar datos ---
// Esto sigue el principio DRY (Don't Repeat Yourself)
const DataDisplay = ({ label, value, unit = '' }) => (
  <Grid item xs={12} sm={6}>
    <Typography variant="body1">
      <strong>{label}:</strong> {value != null ? `${value}${unit}` : 'No disponible'}
    </Typography>
  </Grid>
);


function PropertyDetailPage() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/`);
        if (!response.ok) throw new Error(`Propiedad no encontrada`);
        const data = await response.json();
        console.log("Datos de la propiedad individual:", data); // ¡Excelente para depurar!
        setProperty(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPropertyDetails();
  }, [propertyId]);

  const handleDownloadReport = async () => {
    // ... (esta función ya estaba correcta y no cambia) ...
    if (!token) {
        alert("Por favor, inicia sesión para descargar el reporte.");
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/report/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('No se pudo generar el reporte.');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const fileName = property?.title ? property.title.replace(/ /g, '_') : propertyId;
        a.download = `informe_propiedad_${fileName}.docx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch(e) {
        console.error("Error al descargar reporte:", e);
        alert(e.message);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" sx={{ p: 4 }}><CircularProgress /></Box>;
  if (error) return <Container sx={{ p: 4 }}><Alert severity="error">{error}</Alert></Container>;
  if (!property) return null; // Renderiza nada si la propiedad aún no ha cargado

  return (
    <Container sx={{ py: 4 }}>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>{property.title}</Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>{property.address}</Typography>
        
        <Typography variant="h3" sx={{ my: 2 }}>
          {property.price != null ? `$${property.price.toLocaleString('es-CL')}` : 'Precio a consultar'}
        </Typography>

        {/* --- NUEVA SECCIÓN DE DETALLES --- */}
        <Grid container spacing={1} sx={{ my: 3 }}>
            {/* Asegúrate de que estos nombres coinciden con tu console.log */}
            <DataDisplay label="Dormitorios" value={property.bedrooms} />
            <DataDisplay label="Baños" value={property.bathrooms} />
            <DataDisplay label="Estacionamientos" value={property.parking_spots} />
            <DataDisplay label="Bodegas" value={property.storage_units} />
            <DataDisplay label="Superficie Total" value={property.surface_total} unit=" m²" />
            <DataDisplay label="Superficie Útil" value={property.surface_useful} unit=" m²" />
        </Grid>

        <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2, mr: 2 }} 
            onClick={() => navigate(`/checkout/${propertyId}`)}
        >
            Proceder al Pago
        </Button>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={handleDownloadReport}>
            Descargar Ficha Técnica (.docx)
        </Button>
      </Paper>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" component="h2" gutterBottom>Video</Typography>
          <Paper sx={{ p: 2, aspectRatio: '16 / 9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isClient && property.youtube_video_url ? (
              <ReactPlayer url={property.youtube_video_url} width="100%" height="100%" controls={true} />
            ) : (
              <Typography color="text.secondary">(No hay video disponible)</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          {/* Aquí iría la imagen si la tuvieras en la API */}
        </Grid>
      </Grid>
      
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>Ubicación</Typography>
        <Paper sx={{ height: '500px', width: '100%' }}>
          <MapComponent properties={[property]} />
        </Paper>
      </Box>
    </Container>
  );
}

export default PropertyDetailPage;