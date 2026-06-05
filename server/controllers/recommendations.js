const prisma = require('../utils/db');

const getRecommendations = async (req, res) => {
    try {
        const { productId } = req.params;
        
        // LOGS: Check these in your Render logs
        console.log("Raw ID:", productId);
        console.log("ID Type:", typeof productId);

        // Convert if your database uses Ints
        const id = parseInt(productId); 

        const product = await prisma.product.findUnique({
            where: { id: id },
            select: { categoryId: true }
        });

        if (!product) {
            console.log("No product found in DB for ID:", id);
            return res.status(404).json({ message: "Product not found" });
        }

        // ... rest of your code
    } catch (error) {
        console.error("DEBUG ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
};