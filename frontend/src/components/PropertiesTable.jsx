import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, IconButton, TablePagination, Tooltip,
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, List, ListItem, ListItemText, Link, Typography, CircularProgress 
} from '@mui/material';
// --- ICONOS CORRECTOS ---
import HomeIcon from '@mui/icons-material/Home';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
// ---
import { useAuth } from '../context/hooks';
import { API_BASE_URL, API_DOMAIN } from '../apiConfig';

function PropertiesTable({ 
  properties, paginatedProperties, page, rowsPerPage, 
  onPageChange, onRowsPerPageChange 
}) {
  const navigate = useNavigate();
  const { authTokens } = useAuth();

  // --- Estados para los modales ---
  const [uploadModalOpenFor, setUploadModalOpenFor] = useState(null);
  const [listModalOpenFor, setListModalOpenFor] = useState(null);
  // ---
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);

  const handleRowClick = (id) => navigate(`/property/${id}`);
  
  const handleCloseModals = () => {
    setUploadModalOpenFor(null);
    setListModalOpenFor(null);
    setSelectedFile(null);
    setIsUploading(false);
    setDocuments([]);
  };

  const handleUploadClick = (propertyId) => setUploadModalOpenFor(propertyId);
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${API_BASE_URL}/properties/${uploadModalOpenFor}/documents/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authTokens.access}` },
        body: formData,
      });

      if (!response.ok) throw new Error('La subida del archivo falló');

      alert('¡Archivo subido con éxito!');
      handleCloseModals(); // <--- NOMBRE CORREGIDO
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleListDocsClick = async (propertyId) => {
    // Si no tenemos tokens, no podemos hacer la petición
    if (!authTokens) {
        alert("Por favor, inicia sesión para ver los documentos.");
        return;
    }
      
    setListModalOpenFor(propertyId);
    setIsLoadingDocs(true);
    try {
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/documents/`, {
        method: 'GET', // Seamos explícitos
        headers: {
            'Content-Type': 'application/json',
            // Asegúrate de que enviamos el token de ACCESO
          'Authorization': `Bearer ${authTokens.access}` 
        }
      });
        
      if (response.status === 401) {
          // Podríamos implementar lógica de refresco de token aquí
          throw new Error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
      }
      if (!response.ok) {
        throw new Error('No se pudieron cargar los documentos.');
      }
        
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error al listar documentos:", error);
      alert(error.message); // El alert ahora mostrará el mensaje de error específico
      handleCloseModals(); // Cerramos el modal si hay un error
    } finally {
      setIsLoadingDocs(false);
    }
  };

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Título</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Dirección</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Precio</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Detalles</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProperties.map((property) => (
                <TableRow hover key={property.id}>
                  <TableCell>{property.name}</TableCell>
                  <TableCell>{property.address}</TableCell>
                  <TableCell>${Number(property.price).toLocaleString()}</TableCell>
                {/* COLUMNA ACCIONES (CORREGIDA) */}
                  <TableCell>
                    <Tooltip title="Subir documento">
                      <IconButton onClick={() => handleUploadClick(property.id)}>
                        <FileUploadIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={property.document_count > 0 ? "Descargar documentos" : "No hay documentos"}>
                        {/* La prop 'disabled' se evalúa como un booleano. */}
                        {/* Si el conteo es 0, property.document_count === 0 es true, y el botón se deshabilita. */}
                        <IconButton 
                            onClick={() => handleListDocsClick(property.id)}
                            disabled={property.document_count === 0} 
                        >
                        <FileDownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>

                  {/* COLUMNA DETALLES (CORREGIDA) */}
                  <TableCell>
                    <Tooltip title="Detalles de la propiedad">
                      <IconButton onClick={() => handleRowClick(property.id)}>
                        <HomeIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          // --- CORRECCIÓN #1: Añadimos 'count' que usa la prop 'properties' ---
          count={properties.length} 
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      </Paper>
      
      {/* Modal de Subida (sin cambios) */}
      <Dialog open={!!uploadModalOpenFor} onClose={handleCloseModals}>
        <DialogTitle>Subir Documento</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus margin="dense" id="file-upload" type="file" fullWidth variant="standard"
            onChange={handleFileChange} // <--- FUNCIÓN CONECTADA
          />
        </DialogContent>
                <DialogActions>
          <Button onClick={handleCloseModals}>Cancelar</Button>
          <Button 
            onClick={handleFileUpload} // <--- FUNCIÓN CONECTADA
            disabled={!selectedFile || isUploading} // <--- ESTADO CONECTADO
          >
            {isUploading ? 'Subiendo...' : 'Subir'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- NUEVO MODAL PARA LISTAR/DESCARGAR DOCUMENTOS --- */}
      <Dialog open={!!listModalOpenFor} onClose={handleCloseModals}>
        <DialogTitle>Documentos de la Propiedad</DialogTitle>
        <DialogContent>
          {isLoadingDocs ? (
            <CircularProgress />
          ) : documents.length > 0 ? (
            <List>
              {documents.map(doc => (
                <ListItem key={doc.id}>
                  <ListItemText 
                    primary={
                        <Link 
                        href={`${API_DOMAIN}${doc.file}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        >
                        {doc.file.split('/').pop()}
                        </Link>
                    }
                    />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No hay documentos para esta propiedad.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModals}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PropertiesTable;