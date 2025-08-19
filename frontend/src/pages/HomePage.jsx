import { Typography, Container } from '@mui/material';
import PropertiesTable from '../components/PropertiesTable';


// ¡Más adelante aquí importaremos nuestro componente de tabla!
// import PropertiesTable from '../components/PropertiesTable';

function HomePage() {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Propiedades Disponibles
      </Typography>
      
      {/* --- USA EL COMPONENTE DE TABLA --- */}
      <PropertiesTable />

    </Container>
  );
}

export default HomePage;