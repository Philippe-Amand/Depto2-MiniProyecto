import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { API_DOMAIN, API_BASE_URL } from '../apiConfig';
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

function PropertyDetailPage() {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsClient(true);
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/`);
        if (!response.ok) throw new Error(`Propiedad no encontrada`);
        const data = await response.json();
        setProperty(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPropertyDetails();
  }, [propertyId]);

  if (loading) return <Box display="flex" justifyContent="center" sx={{ p: 4 }}><CircularProgress /></Box>;
  if (error) return <Container sx={{ p: 4 }}><Alert severity="error">{error}</Alert></Container>;
  if (!property) return <Container sx={{ p: 4 }}><Typography>Propiedad no encontrada.</Typography></Container>;
  
  const propertyImageUrl = property.image ? `${API_DOMAIN}${property.image}` : null;

  return (
    <Container sx={{ py: 4 }}>
      
      {/* 1. BLOQUE DE INFORMACIÓN (RESTAURADO) */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>{property.name}</Typography>
        <Typography variant="h5" color="text.secondary">{property.address}</Typography>
        <Typography variant="body1" sx={{ my: 2 }}>{property.description}</Typography>
        <Typography variant="h4" sx={{ my: 2 }}>
          Precio: ${Number(property.price).toLocaleString()}
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }} 
            onClick={() => navigate(`/checkout/${propertyId}`)}
          >
            Proceder al Pago
          </Button>
        </Typography>
      </Paper>

      {/* 2. BLOQUE MULTIMEDIA */}
      <Box sx={{ mb: 4 }}> {/* Margen inferior para separar del mapa */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom>Video</Typography>
            <Paper sx={{ p: 2, height: '100%' }}>
              {isClient && property.youtube_video_url ? (
                <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                  <ReactPlayer 
                    url={property.youtube_video_url}
                    width="100%" height="100%"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    controls={true} light={true}
                  />
                </Box>
              ) : (
                <Typography color="text.secondary">(No hay video disponible)</Typography>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom>Imagen</Typography>
            <Paper sx={{ p: 2, height: '100%' }}>
              {propertyImageUrl ? (
                <Box 
                  component="img"
                  src={propertyImageUrl}
                  alt={`Imagen de ${property.name}`}
                  sx={{ width: '100%', height: 'auto', borderRadius: 1 }}
                />
              ) : (
                <Typography color="text.secondary">(No hay imagen disponible)</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* 3. BLOQUE DE MAPA */}
      <Box>
        <Typography variant="h4" component="h2" gutterBottom>Ubicación</Typography>
        <Paper sx={{ height: '500px', width: '100%' }}>
          <MapComponent properties={[property]} />
        </Paper>
      </Box>

    </Container>
  );
}

export default PropertyDetailPage;