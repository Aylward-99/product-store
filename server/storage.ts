import { 
  products, 
  categories, 
  reviews, 
  cartItems,
  type Product, 
  type InsertProduct,
  type Category,
  type InsertCategory,
  type Review,
  type InsertReview,
  type CartItem,
  type InsertCartItem
} from "@shared/schema";

export interface IStorage {
  // Product operations
  getProducts(filters?: { category?: string; search?: string; sortBy?: string; minPrice?: number; maxPrice?: number }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  toggleFavorite(id: number): Promise<Product | undefined>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Review operations
  getProductReviews(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Cart operations
  getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private categories: Map<number, Category>;
  private reviews: Map<number, Review>;
  private cartItems: Map<number, CartItem>;
  private currentProductId: number;
  private currentCategoryId: number;
  private currentReviewId: number;
  private currentCartId: number;

  constructor() {
    this.products = new Map();
    this.categories = new Map();
    this.reviews = new Map();
    this.cartItems = new Map();
    this.currentProductId = 1;
    this.currentCategoryId = 1;
    this.currentReviewId = 1;
    this.currentCartId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const defaultCategories = [
      { name: "Electronics", isActive: true },
      { name: "Clothing", isActive: true },
      { name: "Home", isActive: true },
      { name: "Books", isActive: true },
    ];

    defaultCategories.forEach(cat => {
      const category: Category = {
        id: this.currentCategoryId++,
        ...cat,
      };
      this.categories.set(category.id, category);
    });

    // Seed products
    const defaultProducts = [
      {
        name: "Premium Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
        price: "299.00",
        originalPrice: "399.00",
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=800",
        rating: "4.0",
        reviewCount: 127,
        badge: "Best Seller",
        isFavorite: false,
        createdAt: new Date(),
      },
      {
        name: "Smart Watch Pro",
        description: "Advanced fitness tracking with heart rate monitoring and GPS functionality.",
        price: "459.00",
        originalPrice: null,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=800",
        rating: "5.0",
        reviewCount: 89,
        badge: "New",
        isFavorite: false,
        createdAt: new Date(),
      },
      {
        name: "Ultra-thin Laptop",
        description: "Powerful performance in an ultra-portable design. Perfect for professionals on the go.",
        price: "1299.00",
        originalPrice: "1499.00",
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=800",
        rating: "4.2",
        reviewCount: 203,
        badge: "Limited",
        isFavorite: false,
        createdAt: new Date(),
      },
      {
        name: "Smartphone X",
        description: "Latest flagship smartphone with advanced camera system and lightning-fast performance.",
        price: "899.00",
        originalPrice: null,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=800",
        rating: "4.8",
        reviewCount: 456,
        badge: null,
        isFavorite: true,
        createdAt: new Date(),
      },
      {
        name: "Leather Handbag",
        description: "Handcrafted genuine leather handbag with premium quality and timeless design.",
        price: "189.00",
        originalPrice: null,
        category: "Clothing",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=800",
        rating: "4.3",
        reviewCount: 76,
        badge: null,
        isFavorite: false,
        createdAt: new Date(),
      },
      {
        name: "Vintage Camera",
        description: "Classic vintage camera perfect for film photography enthusiasts and collectors.",
        price: "349.00",
        originalPrice: null,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=800",
        rating: "4.9",
        reviewCount: 34,
        badge: "Vintage",
        isFavorite: false,
        createdAt: new Date(),
      },
    ];

    defaultProducts.forEach(prod => {
      const product: Product = {
        id: this.currentProductId++,
        ...prod,
      };
      this.products.set(product.id, product);
    });

    // Seed reviews
    const defaultReviews = [
      {
        productId: 1,
        userName: "John Doe",
        rating: 5,
        comment: "Great product! Really satisfied with the quality and performance.",
        createdAt: new Date(),
      },
      {
        productId: 1,
        userName: "Jane Smith",
        rating: 4,
        comment: "Good headphones, but could be more comfortable for long sessions.",
        createdAt: new Date(),
      },
    ];

    defaultReviews.forEach(rev => {
      const review: Review = {
        id: this.currentReviewId++,
        ...rev,
      };
      this.reviews.set(review.id, review);
    });
  }

  // Product operations
  async getProducts(filters?: { category?: string; search?: string; sortBy?: string; minPrice?: number; maxPrice?: number }): Promise<Product[]> {
    let products = Array.from(this.products.values());

    if (filters?.category && filters.category !== "All Categories") {
      products = products.filter(p => p.category === filters.category);
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }

    if (filters?.minPrice !== undefined) {
      products = products.filter(p => parseFloat(p.price) >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
      products = products.filter(p => parseFloat(p.price) <= filters.maxPrice!);
    }

    // Sort products
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case "Price: Low to High":
          products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          break;
        case "Price: High to Low":
          products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
          break;
        case "Name: A to Z":
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "Rating: High to Low":
          products.sort((a, b) => parseFloat(b.rating || "0") - parseFloat(a.rating || "0"));
          break;
      }
    }

    return products;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const newProduct: Product = {
      id,
      ...product,
      originalPrice: product.originalPrice || null,
      badge: product.badge || null,
      rating: "0",
      reviewCount: 0,
      isFavorite: false,
      createdAt: new Date(),
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...product };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  async toggleFavorite(id: number): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updated = { ...product, isFavorite: !product.isFavorite };
    this.products.set(id, updated);
    return updated;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(c => c.isActive);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const newCategory: Category = { 
      id, 
      ...category, 
      isActive: category.isActive ?? true 
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // Review operations
  async getProductReviews(productId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(r => r.productId === productId);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const newReview: Review = {
      id,
      ...review,
      createdAt: new Date(),
    };
    this.reviews.set(id, newReview);

    // Update product rating and review count
    const product = this.products.get(review.productId);
    if (product) {
      const reviews = await this.getProductReviews(review.productId);
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      const updated = {
        ...product,
        rating: avgRating.toFixed(1),
        reviewCount: reviews.length,
      };
      this.products.set(review.productId, updated);
    }

    return newReview;
  }

  // Cart operations
  async getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]> {
    const items = Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
    return items.map(item => ({
      ...item,
      product: this.products.get(item.productId)!,
    })).filter(item => item.product);
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.productId === cartItem.productId && item.sessionId === cartItem.sessionId
    );

    if (existingItem) {
      // Update quantity
      const updated = { ...existingItem, quantity: existingItem.quantity + (cartItem.quantity || 1) };
      this.cartItems.set(existingItem.id, updated);
      return updated;
    }

    const id = this.currentCartId++;
    const newItem: CartItem = { 
      id, 
      ...cartItem, 
      quantity: cartItem.quantity || 1 
    };
    this.cartItems.set(id, newItem);
    return newItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;

    const updated = { ...item, quantity };
    this.cartItems.set(id, updated);
    return updated;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const itemsToRemove = Array.from(this.cartItems.entries())
      .filter(([_, item]) => item.sessionId === sessionId)
      .map(([id, _]) => id);

    itemsToRemove.forEach(id => this.cartItems.delete(id));
    return true;
  }
}

export const storage = new MemStorage();
