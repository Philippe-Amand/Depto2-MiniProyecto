import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_DOMAIN, API_BASE_URL } from '../apiConfig';
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


function PropertyDetailPage() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const [isClient, setIsClient] = useState(false);


  useEffect(() => {
    // --- ESTE EFECTO ESTABLECE isClient A true DESPUÉS DEL MONTAJE ---
    setIsClient(true);
    
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/`);

        if (!response.ok) {
          throw new Error(`Propiedad no encontrada`);
        }
        const data = await response.json();
        console.log("Datos de la propiedad individual:", data);
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
        if (!token) {
            alert("Por favor, inicia sesión para descargar el reporte.");
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/report/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('No se pudo generar el reporte.');
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `informe_propiedad_${property?.name.replace(/ /g, '_') || propertyId}.docx`;
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
  if (!property) return <Container sx={{ p: 4 }}><Typography>Cargando información de la propiedad...</Typography></Container>;


  return (
    <Container sx={{ py: 4 }}>
      
      {/* --- BLOQUE DE TÍTULO --- */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>{property.name}</Typography>
        <Typography variant="h5" color="text.secondary">{property.address}</Typography>
        <Typography variant="body1" sx={{ my: 2 }}>{property.description}</Typography>
        <Typography variant="h4" sx={{ my: 2 }}>
          Precio: ${Number(property.price).toLocaleString()}
        </Typography>
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

      {/* --- BLOQUE MULTIMEDIA --- */}
     <Box sx={{ mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom>Video</Typography>
            <Paper sx={{ p: 2, height: '100%' }}>
              
              {/* --- LA CONDICIÓN DOBLE ES LA CLAVE --- */}
              {isClient && property.youtube_video_url ? (
                <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                  <ReactPlayer 
                    url={property.youtube_video_url}
                    width="100%" height="100%"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    controls={true}
                  />
                </Box>
              ) : (
                <Typography color="text.secondary">{property.youtube_video_url ? 'Cargando video...' : '(No hay video disponible)'}</Typography>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom>Imagen</Typography>
            <Paper sx={{ p: 2, height: '100%' }}>
              {property.image ? (
                // Usamos la URL completa que llega desde la API directamente
                <Box 
                  component="img"
                  src={property.image}
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

      {/* --- BLOQUE DE MAPA --- */}
      <Box>
        <Paper sx={{ height: '500px', width: '100%', marginTop: 20 }}>
          <MapComponent properties={[property]} />
        </Paper>
      </Box>

    </Container>
  );
}

export default PropertyDetailPage;