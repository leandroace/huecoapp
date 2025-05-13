import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

// 👇 Ícono personalizado
import L from 'leaflet';
import customIconUrl from './assets/pin.svg';

const customIcon = new L.Icon({
  iconUrl: customIconUrl,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

function App() {
  const [huecos, setHuecos] = useState([]);
  const [image, setImage] = useState(null);

  // ✅ Cargar huecos guardados al iniciar
  useEffect(() => {
    const saved = localStorage.getItem("huecos");
    if (saved) {
      setHuecos(JSON.parse(saved));
    }
  }, []);

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
        const newHueco = {
          id: Date.now(),
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          image: img,
        };

        setHuecos((prev) => {
          const updated = [...prev, newHueco];
          localStorage.setItem("huecos", JSON.stringify(updated));
          return updated;
        });
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

  const borrarHuecos = () => {
    if (window.confirm("¿Estás seguro de que quieres borrar todos los huecos?")) {
      localStorage.removeItem("huecos");
      setHuecos([]);
    }
  };

  return (
    <div className="App">
      <h2>Reportar Hueco</h2>

      {/* Botón estilizado para subir foto */}
      <div className="upload-container">
        <input
          type="file"
          id="fileUpload"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="fileUpload" className="upload-button">
          📷 Subir foto del hueco
        </label>
      </div>

      {/* Botón para borrar todos los huecos */}
      <button onClick={borrarHuecos} style={{ marginTop: '10px' }}>
        🗑️ Borrar todos los huecos
      </button>

      <MapContainer center={[3.4372, -76.5225]} zoom={13} style={{ height: '80vh', width:'150%', marginTop: '10px' }}>
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
