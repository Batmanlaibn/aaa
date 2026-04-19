"use client";

import { Plus, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import type { Product, Store } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  store: Store;
}

export function ProductCard({ product, store }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  
  const cartItem = items.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("mn-MN").format(price) + "₮";
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative h-32 bg-secondary">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-secondary-foreground/20">
            {product.name.charAt(0)}
          </span>
        </div>
      </div>
      <CardContent className="p-4">
        <h4 className="font-medium text-foreground line-clamp-1">
          {product.name}
        </h4>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-semibold text-primary">
            {formatPrice(product.price)}
          </span>
          {quantity === 0 ? (
            <Button
              size="sm"
              onClick={() => addItem(product, store)}
            >
              <Plus className="mr-1 h-4 w-4" />
              Нэмэх
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={() => updateQuantity(product.id, quantity - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={() => addItem(product, store)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
