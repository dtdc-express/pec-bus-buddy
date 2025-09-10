import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapComponentProps {
  className?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    position: { lat: number; lng: number };
    title?: string;
    info?: string;
  }>;
}

const MapComponent = ({ 
  className = "w-full h-96", 
  center = { lat: 30.7749, lng: 76.7194 }, // PEC Chandigarh coordinates
  zoom = 13,
  markers = []
}: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: "AIzaSyAHgoO4y-Re_kfjAwc-nwZgxdw6LZwBzLE",
        version: "weekly",
        libraries: ["places"]
      });

      const { Map } = await loader.importLibrary("maps");
      const { AdvancedMarkerElement } = await loader.importLibrary("marker");

      if (mapRef.current) {
        const map = new Map(mapRef.current, {
          center: center,
          zoom: zoom,
          mapId: "PEC_BUS_MAP"
        });

        // Add markers
        markers.forEach((markerData) => {
          const marker = new AdvancedMarkerElement({
            map,
            position: markerData.position,
            title: markerData.title || "Bus Location"
          });

          if (markerData.info) {
            const infoWindow = new (window as any).google.maps.InfoWindow({
              content: markerData.info
            });

            marker.addListener("click", () => {
              infoWindow.open(map, marker);
            });
          }
        });

        // Add destination marker (PEC Main Gate)
        const destinationMarker = new AdvancedMarkerElement({
          map,
          position: { lat: 30.7749, lng: 76.7194 }, // PEC coordinates
          title: "PEC Main Gate"
        });

        const destinationInfo = new (window as any).google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-bold">PEC Main Gate</h3>
              <p>Punjab Engineering College</p>
              <p>Sector 12, Chandigarh</p>
            </div>
          `
        });

        destinationMarker.addListener("click", () => {
          destinationInfo.open(map, destinationMarker);
        });
      }
    };

    initializeMap().catch(console.error);
  }, [center, zoom, markers]);

  return <div ref={mapRef} className={className} />;
};

export default MapComponent;