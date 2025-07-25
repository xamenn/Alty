import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema } from "@shared/schema";
import { z } from "zod";

const generateAltTextSchema = z.object({
  productIds: z.array(z.string())
});

const bulkSaveSchema = z.object({
  updates: z.array(z.object({
    id: z.string(),
    altText: z.string()
  }))
});

const updateAltTextSchema = z.object({
  altText: z.string()
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get metrics
  app.get("/api/metrics", async (req, res) => {
    try {
      const metrics = await storage.getMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  // Generate alt text for selected products
  app.post("/api/generate-alt-text", async (req, res) => {
    try {
      const { productIds } = generateAltTextSchema.parse(req.body);
      
      // Simulate AI alt text generation
      const generatedTexts = [
        "Modern brown leather sofa with clean lines, perfect for contemporary living rooms and professional spaces",
        "Solid oak dining table with natural wood grain, seats 6 people comfortably for family meals",
        "Comfortable gray upholstered reading chair with matching ottoman, perfect for cozy reading nook",
        "Modern glass-top coffee table with chrome legs, ideal centerpiece for contemporary living spaces",
        "White minimalist bookshelf with five shelves displaying books and decorative objects in Scandinavian style"
      ];

      const updates = productIds.map((id, index) => ({
        id,
        altText: generatedTexts[index % generatedTexts.length]
      }));

      const updatedProducts = await storage.bulkUpdateProducts(updates);
      
      res.json({ 
        success: true, 
        message: `Generated alt text for ${updatedProducts.length} products`,
        products: updatedProducts 
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to generate alt text" });
    }
  });

  // Bulk save alt text changes
  app.post("/api/bulk-save", async (req, res) => {
    try {
      const { updates } = bulkSaveSchema.parse(req.body);
      const updatedProducts = await storage.bulkUpdateProducts(updates);
      
      res.json({ 
        success: true, 
        message: `Saved ${updatedProducts.length} products`,
        products: updatedProducts 
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to save changes" });
    }
  });

  // Update single product alt text
  app.patch("/api/products/:id/alt-text", async (req, res) => {
    try {
      const { id } = req.params;
      const { altText } = updateAltTextSchema.parse(req.body);
      
      const updatedProduct = await storage.updateProductAltText(id, altText);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: "Failed to update alt text" });
    }
  });

  // Undo functionality (revert to previous state)
  app.post("/api/undo", async (req, res) => {
    try {
      // In a real app, this would revert to a previous state
      // For now, we'll just clear alt text for products that were recently updated
      const products = await storage.getProducts();
      const recentUpdates = products
        .filter(p => p.status === "optimized")
        .slice(0, 5)
        .map(p => ({ id: p.id, altText: "" }));

      const updatedProducts = await storage.bulkUpdateProducts(recentUpdates);
      
      res.json({ 
        success: true, 
        message: `Reverted ${updatedProducts.length} products`,
        products: updatedProducts 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to undo changes" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
