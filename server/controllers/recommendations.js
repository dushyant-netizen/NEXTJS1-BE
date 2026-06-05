const prisma = require('../utils/db');

const getRecommendations = async (req, res) => {
    try {
        const { productId } = req.params;
        
        // Add this check to see what the server is actually receiving
        console.log("Received productId:", productId);

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required in the URL" });
        }

        // Ensure you are using the correct type (Int or String based on your schema)
        // If your schema uses String IDs, remove parseInt()
        const id = productId; 

        const product = await prisma.product.findUnique({
            where: { id: id },
            select: { categoryId: true }
        });

        if (!product) return res.status(404).json({ message: "Product not found" });

        // ... rest of your code
    } catch (error) {
        console.error("RECOMMENDATION_ERROR:", error);
        res.status(500).json({ message: "Server error", details: error.message });
    }
};

module.exports = { getRecommendations };