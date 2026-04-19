import { NextResponse } from "next/server";
import storesData from "@/data/stores.json";
import type { Store } from "@/lib/types";

function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  let stores: Store[] = storesData.stores;

  // Filter by category
  if (category && category !== "all") {
    stores = stores.filter((store) => store.category === category);
  }

  // Add distance if user location provided
  if (lat && lng) {
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    stores = stores.map((store) => ({
      ...store,
      distance: calculateDistance(userLat, userLng, store.lat, store.lng),
    }));
    // Sort by distance
    stores.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  return NextResponse.json({
    stores,
    categories: storesData.categories,
  });
}
