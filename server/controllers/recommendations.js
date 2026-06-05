const prisma = require("../utils/db");

const getRecommendations = async (req, res) => {
  try {
    const { productId } = req.params;

    console.log("Received productId:", productId);

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId missing"
      });
    }

    // Find current product
    const product = await prisma.product.findUnique({
      where: {
        id: productId
      },
      select: {
        id: true,
        categoryId: true
      }
    });

    console.log("Found product:", product);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Find similar products
    const recommendations = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        NOT: {
          id: productId
        }
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

module.exports = {
  getRecommendations
};