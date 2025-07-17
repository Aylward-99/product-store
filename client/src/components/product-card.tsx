import { useState } from "react";
import { Heart, Eye, ShoppingCart, Edit, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getSessionId } from "@/lib/cart";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
}

export function ProductCard({ product, onView, onEdit }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const sessionId = getSessionId();

  const toggleFavoriteMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/products/${product.id}/toggle-favorite`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: product.isFavorite ? "Removed from favorites" : "Added to favorites",
        description: product.isFavorite ? "Product removed from your favorites" : "Product added to your favorites",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", `/api/products/${product.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product deleted",
        description: "Product has been successfully deleted",
      });
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/cart", {
      productId: product.id,
      quantity: 1,
      sessionId,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
    },
  });

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Best Seller":
        return "bg-emerald-500";
      case "New":
        return "bg-blue-500";
      case "Limited":
        return "bg-orange-500";
      case "Vintage":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const renderStars = (rating: string) => {
    const num = parseFloat(rating);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${i <= num ? "text-yellow-400 fill-current" : "text-slate-300 dark:text-slate-600"}`}
        />
      );
    }
    return stars;
  };

  return (
    <div
      className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Button
              size="icon"
              variant="secondary"
              onClick={() => onView(product)}
              className="bg-white dark:bg-slate-700 shadow-lg hover:scale-110 transition-transform duration-200"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={() => toggleFavoriteMutation.mutate()}
              className="bg-white dark:bg-slate-700 shadow-lg hover:scale-110 transition-transform duration-200"
            >
              <Heart className={`h-4 w-4 ${product.isFavorite ? "text-red-500 fill-current" : ""}`} />
            </Button>
            <Button
              size="icon"
              onClick={() => addToCartMutation.mutate()}
              className="bg-blue-500 text-white shadow-lg hover:scale-110 transition-transform duration-200"
              disabled={addToCartMutation.isPending}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <Badge className={`${getBadgeColor(product.badge)} text-white`}>
              {product.badge}
            </Badge>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          <Button
            size="icon"
            variant="secondary"
            onClick={() => onEdit(product)}
            className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:scale-110 transition-all duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={() => deleteProductMutation.mutate()}
            className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:scale-110 transition-all duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            disabled={deleteProductMutation.isPending}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 truncate">
            {product.name}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleFavoriteMutation.mutate()}
            className="flex-shrink-0"
          >
            <Heart className={`h-4 w-4 ${product.isFavorite ? "text-red-500 fill-current" : "text-slate-400 hover:text-red-500"} transition-colors duration-200`} />
          </Button>
        </div>

        <div className="flex items-center mb-2">
          <div className="flex items-center space-x-1">
            {renderStars(product.rating || "0")}
          </div>
          <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
            ({product.rating || "0"}) {product.reviewCount} reviews
          </span>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-slate-500 dark:text-slate-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <Button
            size="sm"
            onClick={() => addToCartMutation.mutate()}
            disabled={addToCartMutation.isPending}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
