import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../apiConfig';
import { 
  Card, 
  CardContent, 
  Container, 
  Grid, 
  Typography,
  CircularProgress,
  Alert,
  Box 
} from '@mui/material';
import MapComponent from '../components/MapComponent';
import ReactPlayer from 'react-player';

// ========================================================================
// Componente #1: PropertyCard. 
// Su única responsabilidad es renderizar UNA tarjeta.
// Su elemento raíz es la <Card>, NO el <Grid>.
// ========================================================================
const PropertyCard = ({ property }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    // La 'key' y la definición del Grid Item AHORA viven aquí.
    <Grid item xs={12} sm={6} md={4} key={property.id}>
        {/* Eliminamos el height: 100% que causaba el conflicto */}
      <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        
        {isClient && property.youtube_video_url && (
          <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
            <ReactPlayer 
              url={property.youtube_video_url}
              width='100%'
              height='100%'
              style={{ position: 'absolute', top: 0, left: 0 }}
              controls={true}
              light={true}
            />
          </Box>
        )}

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h5" component="div">{property.name}</Typography>
          <Typography color="text.secondary">{property.address}</Typography>
          <Typography variant="body2" sx={{ mt: 1.5 }}>{property.description}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            ${Number(property.price).toLocaleString()}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

// ========================================================================
// Componente #2: HomePage.
// Su responsabilidad es obtener los datos y ORQUESTAR el layout.
// ========================================================================
function HomePage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ... (la lógica de fetchProperties no cambia) ...
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/properties/`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log("Datos de la API recibidos:", data);
        setProperties(data);
      } catch (e) {
        console.error("Error al obtener los datos de la API:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const renderContent = () => {
    if (loading) return <Box display="flex" justifyContent="center" ><CircularProgress /></Box>;
    if (error) return <Alert severity="error">Error: {error}</Alert>;

     return (
      <Grid container spacing={3}>
        {/* El map ahora es más simple, solo renderiza el componente */}
        {properties.map((property) => (
          <PropertyCard property={property} key={property.id} />
        ))}
      </Grid>
    );
  };

  return (
    <>
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Propiedades Disponibles
        </Typography>
        {renderContent()}
      </Container>
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Ubicación en el Mapa
        </Typography>
        <MapComponent properties={properties} />
      </Container>
    </>
  );
}

export default HomePage;