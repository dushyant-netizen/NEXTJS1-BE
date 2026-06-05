const prisma = require('../utils/db');

const getRecommendations = async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { categoryId } = req.query; // Allow optional override from query params
  
      // 1. Fetch the product to get its default categoryId
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { categoryId: true },
      });
  
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
  
      // 2. Use categoryId from query, or fallback to the product's categoryId
      const targetCategoryId = categoryId || product.categoryId;
  
      if (!targetCategoryId) {
        return res.json({ success: true, data: [] });
      }
  
      // 3. Perform the search
      const recommendations = await prisma.product.findMany({
        where: {
          categoryId: targetCategoryId,
          id: { not: productId },
        },
        take: 5,
        select: { id: true, title: true, mainImage: true, price: true, categoryId: true },
      });
  
      return res.status(200).json({ success: true, data: recommendations });
    } catch (error) {
      next(error);
    }
  };

// Make sure this matches exactly
module.exports = { getRecommendations };