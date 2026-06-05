const prisma = require('../utils/db');

const getRecommendations = async (req, res) => {
    try {
        const { productId } = req.params;

        // 1. Fetch the source product to get its category
        const product = await prisma.product.findUnique({
            where: { id: parseInt(productId) },
            select: { categoryId: true }
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // 2. Fetch similar products in the same category, excluding the current one
        const recommendations = await prisma.product.findMany({
            where: {
                categoryId: product.categoryId,
                id: { not: parseInt(productId) }
            },
            take: 4, // Limit to 4 recommendations
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(recommendations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error fetching recommendations" });
    }
};

module.exports = { getRecommendations };