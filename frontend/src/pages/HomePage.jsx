import { useState, useEffect } from 'react';
import MapComponent from "../components/MapComponent";
import { 
  AppBar, 
  Card, 
  CardContent, 
  Container, 
  Grid, 
  Toolbar, 
  Typography,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';

function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://127.0.0.1:8000/api/v1/properties/');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
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
    if (loading) {
      // Usamos Box para centrar el spinner de carga
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return <Alert severity="error">Error al cargar las propiedades: {error}</Alert>;
    }

    return (
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {properties.map(property => (
          // Definimos el tamaño de la tarjeta para diferentes tamaños de pantalla
          <Grid item key={property.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {property.name}
                </Typography>
                <Typography color="text.secondary">
                  {property.address}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1.5 }}>
                  {property.description}
                </Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  ${Number(property.price).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
  <>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">
          Depto2 - Portal Inmobiliario
        </Typography>
      </Toolbar>
    </AppBar>

    {/* Contenedor para las tarjetas de propiedades */}
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Propiedades Disponibles
      </Typography>
      {renderContent()}
    </Container>

    {/* Contenedor para el mapa */}
    <Container sx={{ py: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Ubicación en el Mapa
        </Typography>
        {/* Pasamos la lista de propiedades al componente del mapa */}
        <MapComponent properties={properties} />
    </Container>
  </>
  );

}

export default App;