import { NextResponse } from "next/server";
import productsData from "@/data/products.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId");

  let products = productsData.products;

  if (storeId) {
    products = products.filter((p) => p.storeId === storeId);
  }

  return NextResponse.json({ products });
}
