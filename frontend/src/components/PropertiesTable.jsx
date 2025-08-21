import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton,
  TablePagination
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

function PropertiesTable({ 
  properties, 
  paginatedProperties, 
  page, 
  rowsPerPage, 
  onPageChange, 
  onRowsPerPageChange 
}) {
  const navigate = useNavigate();
  
  const handleRowClick = (id) => {
    navigate(`/property/${id}`);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader aria-label="properties table">
          <TableHead>
            {/* --- CABECERA DE LA TABLA (AHORA PRESENTE) --- */}
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Dirección</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Precio</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Detalles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* --- CUERPO DE LA TABLA (AHORA PRESENTE) --- */}
            {paginatedProperties.map((property) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={property.id}>
                <TableCell>{property.name}</TableCell>
                <TableCell>{property.address}</TableCell>
                <TableCell>${Number(property.price).toLocaleString()}</TableCell>
                <TableCell>
                  {/* --- AQUÍ ESTÁ EL IconButton --- */}
                  <IconButton onClick={() => handleRowClick(property.id)} aria-label="view details">
                    <HomeIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={properties.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
}

export default PropertiesTable;