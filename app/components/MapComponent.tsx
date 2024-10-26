import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
    const [markers, setMarkers] = useState<{ lat: number; lon: number; name: string; kode_sta: string; tipe: string; last_latency: number }[]>([]);

    useEffect(() => {
        fetch('/api/markers')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setMarkers(data))
            .catch(error => console.error('Error fetching markers:', error));
    }, []);

    const getMarkerColor = (last_latency: number) => {
        if (last_latency < 2) return '#e27bdd';
        if (last_latency < 5) return '#0506e4';
        if (last_latency < 15) return '#7ca1ed';
        if (last_latency < 60) return '#2de1e1';
        if (last_latency < 900) return '#7de575';
        return 'darkgray';
    };

    const createIcon = (tipe: string, last_latency: number) => {
        const color = getMarkerColor(last_latency);
        const isTriangle = ['Accelerograph REIS', 'Accelerograph Non Collocated', 'Accelerograph Collocated', 'Accelerograph 2020'].includes(tipe);
        
        const svgString = isTriangle
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><polygon points="6,0 0,12 12,12" fill="${color}"/></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="${color}"/></svg>`;

        return new L.Icon({
            iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString),
            iconSize: isTriangle ? [12, 12] : [10, 10],
            iconAnchor: isTriangle ? [6, 12] : [5, 5],
            popupAnchor: isTriangle ? [0, -12] : [0, -5],
        });
    };

    const handleMarkerClick = (marker: any) => {
        const event = new CustomEvent('locationSelected', { detail: marker.id });
        window.dispatchEvent(event);
        console.log('Marker clicked:', marker.id); // Tambahkan log ini
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-8">
                    <MapContainer center={[-6.5, 106.0]} zoom={7} style={{ height: "50vh", width: "100%" }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            className='grayscale'
                        />
                        {markers.map((marker, index) => (
                            <Marker 
                                key={index} 
                                position={[marker.lat, marker.lon]}
                                icon={createIcon(marker.tipe, marker.last_latency)}
                                eventHandlers={{
                                    click: () => handleMarkerClick(marker),
                                }}
                            >
                                <Popup>{marker.kode_sta}</Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default MapComponent;
