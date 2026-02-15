import { useState, useEffect } from 'react';
import { Typography, Container, Box, Grid, CircularProgress, Alert, Paper } from '@mui/material';
import { API_BASE_URL } from '../apiConfig';
import PropertiesTable from '../components/PropertiesTable';
import MapComponent from '../components/MapComponent';

function HomePage() {
  // 1. Toda la lógica de estado ahora vive aquí
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    // 2. La obtención de datos también vive aquí
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/properties/`);
        if (!response.ok) throw new Error('Error al obtener los datos');
        const data = await response.json();
        setProperties(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);
  
  // 3. Las funciones de paginación se definen aquí
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 4. Calculamos las propiedades visibles para la página actual
  const paginatedProperties = properties.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  // Renderizado condicional
  if (loading) return <Box display="flex" justifyContent="center" sx={{p:4}}><CircularProgress /></Box>;
  if (error) return <Container sx={{p:4}}><Alert severity="error">{error}</Alert></Container>;

  return (
    <Container sx={{ py: 4 }} maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Propiedades Disponibles
      </Typography>
      
      {/* SECCIÓN #1: TABLA */}
      <Box sx={{ mb: 4 }}> {/* Margen inferior para separar de la siguiente sección */}
        <PropertiesTable 
          properties={properties}
          paginatedProperties={paginatedProperties}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      
      {/* SECCIÓN #2: MAPA */}
      <Box>
        <Typography variant="h4" component="h2" gutterBottom>
          Propiedades en el Mapa
        </Typography>
        <Paper sx={{ height: '500px', width: '100%' }}>
            {/* Pasamos solo las propiedades visibles de la página actual */}
            <MapComponent properties={paginatedProperties} />
        </Paper>
      </Box>

    </Container>
  );
}

export default HomePage;