import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

// 👇 Importa tu ícono personalizado
import L from 'leaflet';
import customIconUrl from './assets/pin.svg'; // asegúrate de que la ruta sea exacta

// 👇 Crea el ícono personalizado
const customIcon = new L.Icon({
  iconUrl: customIconUrl,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

function App() {
  const [huecos, setHuecos] = useState([]);
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      getLocation(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const getLocation = (img) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("Ubicación exacta:", pos.coords.latitude, pos.coords.longitude);
        const newHueco = {
          id: Date.now(),
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          image: img,
        };
        setHuecos((prev) => [...prev, newHueco]);
      },
      (error) => {
        alert("No se pudo obtener la ubicación");
        console.error(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="App">
      <h2>Reportar Hueco</h2>
      <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} />
      <MapContainer center={[3.4372, -76.5225]} zoom={13} style={{ height: '80vh', marginTop: '10px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {huecos.map((hueco) => (
          <Marker key={hueco.id} position={[hueco.lat, hueco.lng]} icon={customIcon}>
            <Popup>
              <img src={hueco.image} alt="Hueco" width="200px" />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
