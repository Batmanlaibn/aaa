"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Store } from "@/lib/types";
import { Star, Clock, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Fix for default marker icons in Leaflet with webpack
const createIcon = (color: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          font-size: 14px;
        ">📍</div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const storeIcon = createIcon("#636B2F");
const userIcon = L.divIcon({
  className: "user-marker",
  html: `
    <div style="
      background-color: #3b82f6;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: 0 2px 8px rgba(59,130,246,0.5);
    "></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Component to update map view when location changes
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface StoreMapProps {
  stores: Store[];
  userLocation: { lat: number; lng: number } | null;
  onStoreSelect?: (store: Store) => void;
  selectedStoreId?: string;
  showRoute?: boolean;
  height?: string;
}

export function StoreMap({
  stores,
  userLocation,
  onStoreSelect,
  selectedStoreId,
  showRoute = false,
  height = "400px",
}: StoreMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Default center: Ulaanbaatar
  const defaultCenter: [number, number] = [47.9184, 106.9177];
  const center: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : defaultCenter;

  // Find selected store for routing
  const selectedStore = stores.find((s) => s.id === selectedStoreId);
  const routePoints: [number, number][] =
    showRoute && userLocation && selectedStore
      ? [
          [userLocation.lat, userLocation.lng],
          [selectedStore.lat, selectedStore.lng],
        ]
      : [];

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

  return (
    <div className="overflow-hidden rounded-lg border border-border" style={{ height }}>
      <MapContainer
        center={center}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater center={center} zoom={14} />

        {/* User location marker */}
        {userLocation && (
          <>
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup>
                <div className="text-center font-medium">Таны байршил</div>
              </Popup>
            </Marker>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={100}
              pathOptions={{
                color: "#3b82f6",
                fillColor: "#3b82f6",
                fillOpacity: 0.1,
              }}
            />
          </>
        )}

        {/* Store markers */}
        {stores.map((store) => (
          <Marker
            key={store.id}
            position={[store.lat, store.lng]}
            icon={storeIcon}
            eventHandlers={{
              click: () => onStoreSelect?.(store),
            }}
          >
            <Popup>
              <div className="min-w-[200px] space-y-2 p-1">
                <h3 className="font-bold text-foreground">{store.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{store.address}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{store.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {store.openTime} - {store.closeTime}
                    </span>
                  </div>
                </div>
                {store.distance && (
                  <div className="text-sm font-medium text-primary">
                    {store.distance.toFixed(1)} км
                  </div>
                )}
                <Link href={`/stores/${store.id}`}>
                  <Button size="sm" className="mt-2 w-full">
                    Дэлгүүр үзэх
                  </Button>
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Route line */}
        {showRoute && routePoints.length === 2 && (
          <Polyline
            positions={routePoints}
            pathOptions={{
              color: "#636B2F",
              weight: 4,
              dashArray: "10, 10",
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
