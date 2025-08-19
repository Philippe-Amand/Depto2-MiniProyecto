import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../apiConfig';
import { Container, Typography, CircularProgress, Alert } from '@mui/material';

function PropertyDetailPage() {
  // 1. Obtiene el ID de la propiedad desde la URL
  const { propertyId } = useParams();
  
  // 2. Estados para manejar los datos, carga y errores
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. Efecto para buscar los datos de ESTA propiedad cuando el componente se carga
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProperty(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]); // Se ejecuta cada vez que el propertyId cambia

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">Error: {error}</Alert>;
  if (!property) return <Typography>Propiedad no encontrada.</Typography>;

  // 4. Renderiza los detalles de la propiedad
  return (
    <Container>
      <Typography variant="h2" component="h1" gutterBottom>
        {property.name}
      </Typography>
      <Typography variant="h5" color="text.secondary">
        {property.address}
      </Typography>
      <p>{property.description}</p>
      {/* Aquí añadiremos el mapa y el video/imagen más adelante */}
    </Container>
  );
}

export default PropertyDetailPage;