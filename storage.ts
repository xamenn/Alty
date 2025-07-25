import { type Product, type InsertProduct, type Metrics, type InsertMetrics } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined>;
  updateProductAltText(id: string, altText: string): Promise<Product | undefined>;
  bulkUpdateProducts(updates: { id: string; altText: string }[]): Promise<Product[]>;
  
  // Metrics
  getMetrics(): Promise<Metrics>;
  updateMetrics(metrics: Partial<InsertMetrics>): Promise<Metrics>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private metrics: Metrics;

  constructor() {
    this.products = new Map();
    this.metrics = {
      id: randomUUID(),
      totalImages: 847,
      missingAltText: 142,
      needsWork: 89,
      optimized: 616,
      timeSavedHours: 12,
      lastUpdated: new Date()
    };

    // Initialize with sample products
    this.initializeSampleProducts();
  }

  private initializeSampleProducts() {
    const sampleProducts: Product[] = [
      {
        id: "1",
        title: "Modern Leather Sofa",
        vendor: "Living Room Furniture Co.",
        price: "$1,299.00",
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
        altText: "",
        status: "missing",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "2",
        title: "Oak Dining Table",
        vendor: "Artisan Wood Works",
        price: "$899.00",
        imageUrl: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
        altText: "Table",
        status: "needs-work",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "3",
        title: "Reading Chair & Ottoman",
        vendor: "Comfort Seating Co.",
        price: "$649.00",
        imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
        altText: "Comfortable gray upholstered reading chair with matching ottoman, perfect for cozy reading nook",
        status: "optimized",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "4",
        title: "Glass Coffee Table",
        vendor: "Modern Living Co.",
        price: "$449.00",
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
        altText: "",
        status: "missing",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "5",
        title: "Minimalist Bookshelf",
        vendor: "Scandinavian Design Co.",
        price: "$329.00",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
        altText: "White minimalist bookshelf with five shelves displaying books and decorative objects in Scandinavian style",
        status: "optimized",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const product: Product = {
      ...insertProduct,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.set(product.id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = {
      ...product,
      ...updates,
      updatedAt: new Date()
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async updateProductAltText(id: string, altText: string): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    let status = "optimized";
    if (!altText || altText.trim().length === 0) {
      status = "missing";
    } else if (altText.trim().length < 10) {
      status = "needs-work";
    }

    const updatedProduct = {
      ...product,
      altText,
      status,
      updatedAt: new Date()
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async bulkUpdateProducts(updates: { id: string; altText: string }[]): Promise<Product[]> {
    const updatedProducts: Product[] = [];
    
    for (const update of updates) {
      const product = await this.updateProductAltText(update.id, update.altText);
      if (product) {
        updatedProducts.push(product);
      }
    }

    // Update metrics after bulk update
    await this.recalculateMetrics();
    
    return updatedProducts;
  }

  async getMetrics(): Promise<Metrics> {
    await this.recalculateMetrics();
    return this.metrics;
  }

  async updateMetrics(updates: Partial<InsertMetrics>): Promise<Metrics> {
    this.metrics = {
      ...this.metrics,
      ...updates,
      lastUpdated: new Date()
    };
    return this.metrics;
  }

  private async recalculateMetrics(): Promise<void> {
    const products = Array.from(this.products.values());
    const totalImages = products.length;
    const missingAltText = products.filter(p => p.status === "missing").length;
    const needsWork = products.filter(p => p.status === "needs-work").length;
    const optimized = products.filter(p => p.status === "optimized").length;

    this.metrics = {
      ...this.metrics,
      totalImages,
      missingAltText,
      needsWork,
      optimized,
      lastUpdated: new Date()
    };
  }
}

export const storage = new MemStorage();
