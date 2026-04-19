"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Create numbered markers for destinations
const createNumberedIcon = (number: number, isFirst: boolean, isLast: boolean) => {
  const color = isFirst ? "#3b82f6" : isLast ? "#dc2626" : "#636B2F";
  return L.divIcon({
    className: "numbered-marker",
    html: `
      <div style="
        background-color: ${color};
        color: white;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
      ">${number}</div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

interface Destination {
  id: string;
  name: string;
  time: string;
  lat?: number;
  lng?: number;
}

function MapUpdater({ bounds }: { bounds: L.LatLngBoundsExpression | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
}

interface RouteMapProps {
  destinations: Destination[];
  height?: string;
}

// Generate random coordinates around Ulaanbaatar for demo
function generateDemoCoordinates(destinations: Destination[]): Destination[] {
  const baseCoords = { lat: 47.9184, lng: 106.9177 };
  return destinations.map((dest, index) => ({
    ...dest,
    lat: baseCoords.lat + (Math.random() - 0.5) * 0.05,
    lng: baseCoords.lng + (Math.random() - 0.5) * 0.08,
  }));
}

export function RouteMap({ destinations, height = "400px" }: RouteMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [processedDestinations, setProcessedDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    setIsMounted(true);
    // Generate demo coordinates for destinations
    const validDests = destinations.filter((d) => d.name.trim());
    if (validDests.length > 0) {
      setProcessedDestinations(generateDemoCoordinates(validDests));
    }
  }, [destinations]);

  if (!isMounted) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-secondary"
        style={{ height }}
      >
        <div className="text-muted-foreground">Газрын зураг ачаалж байна...</div>
      </div>
    );
  }

  const validDests = processedDestinations.filter((d) => d.lat && d.lng);

  if (validDests.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-secondary"
        style={{ height }}
      >
        <div className="text-center text-muted-foreground">
          <p className="font-medium">Газруудаа оруулна уу</p>
          <p className="text-sm">Маршрут энд харагдана</p>
        </div>
      </div>
    );
  }

  // Create route points
  const routePoints: [number, number][] = validDests.map((d) => [d.lat!, d.lng!]);

  // Calculate bounds
  const bounds = L.latLngBounds(routePoints);

  // Default center
  const center: [number, number] = validDests.length > 0
    ? [validDests[0].lat!, validDests[0].lng!]
    : [47.9184, 106.9177];

  return (
    <div className="overflow-hidden rounded-lg border border-border" style={{ height }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater bounds={validDests.length > 1 ? bounds : null} />

        {/* Destination markers */}
        {validDests.map((dest, index) => (
          <Marker
            key={dest.id}
            position={[dest.lat!, dest.lng!]}
            icon={createNumberedIcon(index + 1, index === 0, index === validDests.length - 1)}
          >
            <Popup>
              <div className="min-w-[150px] space-y-1 p-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span className="font-bold">{dest.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ирэх цаг: {dest.time}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Route line */}
        {routePoints.length > 1 && (
          <Polyline
            positions={routePoints}
            pathOptions={{
              color: "#636B2F",
              weight: 4,
              opacity: 0.8,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
