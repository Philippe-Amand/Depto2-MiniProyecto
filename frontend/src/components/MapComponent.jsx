import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // ¡Importante! Importa el CSS de Leaflet.

// Corrije el problema del ícono por defecto que no aparece en React Leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;


// El componente recibe la lista de propiedades como un "prop"
function MapComponent({ properties }) {
  // Filtramos para obtener solo propiedades con coordenadas válidas
  const geoProperties = properties.filter(p => p.latitude && p.longitude);

  // Si no hay propiedades para mostrar, no renderizamos el mapa.
  if (geoProperties.length === 0) {
    return <p>No hay propiedades con geolocalización para mostrar en el mapa.</p>;
  }

  // Usamos la primera propiedad como centro inicial del mapa
  const initialPosition = [geoProperties[0].latitude, geoProperties[0].longitude];

  return (
    <MapContainer 
      center={initialPosition} 
      zoom={13} 
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geoProperties.map(property => (
        <Marker key={property.id} position={[property.latitude, property.longitude]}>
          <Popup>
            <b>{property.name}</b><br />
            {property.address}<br />
            Precio: ${Number(property.price).toLocaleString()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapComponent;
