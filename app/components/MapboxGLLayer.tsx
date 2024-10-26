import { useEffect } from 'react';
import L from 'leaflet';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-leaflet';
import { useMap } from 'react-leaflet';

// Set a fake Mapbox token
(window as any).mapboxgl.accessToken = 'fake-token';

interface MapboxGLLayerProps {
    style: string;
    attribution?: string;
}

export function MapboxGLLayer({ style, attribution }: MapboxGLLayerProps) {
    const map = useMap();

    useEffect(() => {
        const gl = L.mapboxGL({
            style: style,
            attribution: attribution,
        });
        map.addLayer(gl);

        return () => {
            map.removeLayer(gl);
        };
    }, [map, style, attribution]);

    return null;
}
