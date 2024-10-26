import React, { useState, useEffect } from 'react';

interface LocationData {
  id: number;
  kode_sta: string;
  lat: string;
  lon: string;
  kota: string;
  prov: string;
  tipe: string;
  last_latency: string;
}

const LocationDetails: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    const handleLocationSelect = (event: CustomEvent<number>) => {
      fetch(`/api/markers?id=${event.detail}`)
        .then(response => response.json())
        .then((data: LocationData) => {
          setSelectedLocation(data);
        })
        .catch(error => console.error('Error fetching location data:', error));
    };

    window.addEventListener('locationSelected', handleLocationSelect as EventListener);

    return () => {
      window.removeEventListener('locationSelected', handleLocationSelect as EventListener);
    };
  }, []);

  if (!selectedLocation) {
    return <div className="text-center">Pilih lokasi pada peta</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">{selectedLocation.kode_sta}</h2>
      <p><strong>Kota:</strong> {selectedLocation.kota}</p>
      <p><strong>Provinsi:</strong> {selectedLocation.prov}</p>
      <p><strong>Tipe:</strong> {selectedLocation.tipe}</p>
      <p><strong>Koordinat:</strong> {selectedLocation.lat}, {selectedLocation.lon}</p>
      <p><strong>Last Latency:</strong> {selectedLocation.last_latency} ms</p>
    </div>
  );
};

export default LocationDetails;
