import { useState } from "react";
import { X, Heart, ShoppingCart, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getSessionId } from "@/lib/cart";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertReviewSchema, type InsertReview, type Product } from "@shared/schema";
import { z } from "zod";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const reviewFormSchema = insertReviewSchema.extend({
  userName: z.string().min(1, "Name is required"),
  comment: z.string().min(1, "Comment is required"),
  rating: z.number().min(1, "Rating is required").max(5, "Rating must be between 1 and 5"),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const sessionId = getSessionId();

  const { data: reviews = [] } = useQuery({
    queryKey: ["/api/products", product?.id, "reviews"],
    enabled: !!product,
  });

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      userName: "",
      comment: "",
      rating: 5,
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/cart", {
      productId: product?.id,
      quantity: 1,
      sessionId,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
      toast({
        title: "Added to cart",
        description: `${product?.name} has been added to your cart`,
      });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/products/${product?.id}/toggle-favorite`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: product?.isFavorite ? "Removed from favorites" : "Added to favorites",
        description: product?.isFavorite ? "Product removed from your favorites" : "Product added to your favorites",
      });
    },
  });

  const addReviewMutation = useMutation({
    mutationFn: (data: ReviewFormData) => apiRequest("POST", `/api/products/${product?.id}/reviews`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products", product?.id, "reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Review added",
        description: "Your review has been submitted successfully",
      });
      setShowReviewForm(false);
      form.reset();
    },
  });

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? "text-yellow-400 fill-current" : "text-slate-300 dark:text-slate-600"} ${
            interactive ? "cursor-pointer hover:text-yellow-400" : ""
          }`}
          onClick={() => interactive && onRate && onRate(i)}
        />
      );
    }
    return stars;
  };

  const onSubmitReview = (data: ReviewFormData) => {
    addReviewMutation.mutate(data);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              {product.name}
            </h2>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center space-x-1">
                {renderStars(parseFloat(product.rating || "0"))}
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
                ({product.rating || "0"}) {product.reviewCount} reviews
              </span>
            </div>
            
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {product.description}
            </p>
            
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-slate-500 dark:text-slate-400 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            
            <div className="flex space-x-4">
              <Button
                onClick={() => addToCartMutation.mutate()}
                disabled={addToCartMutation.isPending}
                className="flex-1"
              >
                {addToCartMutation.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              
              <Button
                variant="outline"
                onClick={() => toggleFavoriteMutation.mutate()}
                disabled={toggleFavoriteMutation.isPending}
              >
                <Heart className={`h-4 w-4 ${product.isFavorite ? "text-red-500 fill-current" : ""}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Customer Reviews
            </h3>
            <Button
              variant="outline"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              Write a Review
            </Button>
          </div>

          {showReviewForm && (
            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <form onSubmit={form.handleSubmit(onSubmitReview)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="userName">Your Name</Label>
                    <input
                      id="userName"
                      {...form.register("userName")}
                      className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
                      placeholder="Enter your name"
                    />
                    {form.formState.errors.userName && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.userName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>Rating</Label>
                    <div className="flex items-center space-x-1 mt-1">
                      {renderStars(form.watch("rating"), true, (rating) => form.setValue("rating", rating))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="comment">Your Review</Label>
                  <Textarea
                    id="comment"
                    {...form.register("comment")}
                    placeholder="Share your thoughts about this product..."
                    rows={4}
                    className="mt-1"
                  />
                  {form.formState.errors.comment && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.comment.message}</p>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={addReviewMutation.isPending}
                  >
                    {addReviewMutation.isPending && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Submit Review
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                No reviews yet. Be the first to review this product!
              </p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {review.userName}
                      </span>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    {review.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
