const prisma = require("../utils/db");

const getRecommendations = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ success: false, message: "productId missing" });
    }

    // 1. Find current product to get its category
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, categoryId: true }
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // 2. Try to find recommendations in the SAME category
    const recommendations = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: productId } // Exclude current product
      },
      take: 4,
      select: {
        id: true,
        title: true,
        price: true,
        mainImage: true,
        slug: true,
        categoryId: true
      }
    });

    // 3. FALLBACK LOGIC: If we found less than 4, fill the rest with other products
    if (recommendations.length < 4) {
      const existingIds = recommendations.map(p => p.id);
      existingIds.push(productId); // Ensure we don't fetch the current product

      const fallbackProducts = await prisma.product.findMany({
        where: {
          id: { notIn: existingIds }
        },
        take: 4 - recommendations.length,
        select: {
          id: true,
          title: true,
          price: true,
          mainImage: true,
          slug: true,
          categoryId: true
        }
      });

      // Combine both arrays
      recommendations.push(...fallbackProducts);
    }

    // 4. Return standard response
    return res.status(200).json({
      success: true,
      data: recommendations
    });

  } catch (error) {
    console.error("Recommendation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching recommendations"
    });
  }
};

module.exports = { getRecommendations };