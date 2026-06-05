const prisma = require('../utils/db');

const getRecommendations = async (req, res) => {
    try {
        const { productId } = req.params; // This is already a String from the URL

        // Remove the parseInt()!
        const product = await prisma.product.findUnique({
            where: { id: productId }, // Pass the String directly
            select: { categoryId: true }
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const recommendations = await prisma.product.findMany({
            where: {
                categoryId: product.categoryId,
                id: { not: productId } // Also use the String here
            },
            take: 4
        });

        res.json(recommendations);
    } catch (error) {
        console.error("DEBUG ERROR:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Make sure this matches exactly
module.exports = { getRecommendations };