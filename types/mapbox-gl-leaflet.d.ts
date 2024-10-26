import L from 'leaflet';

declare module 'leaflet' {
    function mapboxGL(options: { style: string; attribution?: string }): L.Layer;
}