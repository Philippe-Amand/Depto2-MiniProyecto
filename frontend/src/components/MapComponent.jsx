// frontend/src/components/MapComponent.jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
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

function MapComponent({ properties }) {
  // --- CORRECCIÓN #1: Usa los nombres de campo finales del modelo: 'latitude' y 'longitude' ---
  const geoProperties = properties.filter(p => p.latitude != null && p.longitude != null);

  if (geoProperties.length === 0) {
    return <p>No hay propiedades con geolocalización para mostrar en el mapa.</p>;
  }

  // --- CORRECCIÓN #2: Usa los campos correctos para la posición inicial ---
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
        // --- CORRECCIÓN #3: Usa los campos correctos para la posición de cada marcador ---
        <Marker key={property.id} position={[property.latitude, property.longitude]}>
          <Popup>
            <b>{property.title}</b><br />
            {property.address}<br />
            {property.price ? `Precio: $${Number(property.price).toLocaleString('es-CL')}` : 'Precio: Consultar'}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapComponent;
