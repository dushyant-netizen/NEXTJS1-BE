const prisma = require("../utils/db");

async function searchProducts(request, response) {
    try {
        // Fallback check to catch both ?query= and ?search= parameter keys
        const queryStr = request.query.query || request.query.search;
        
        if (!queryStr) {
            return response.status(400).json({ error: "Query parameter is required" });
        }

        const products = await prisma.product.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: queryStr,
                            mode: 'insensitive' // 🔌 Fixes Neon case matching issues!
                        }
                    },
                    {
                        description: {
                            contains: queryStr,
                            mode: 'insensitive' // 🔌 Fixes Neon case matching issues!
                        }
                    }
                ]
            }
        });

        return response.json(products);
    } catch (error) {
        console.error("Error searching products:", error);
        return response.status(500).json({ error: "Error searching products" });
    }
}

module.exports = { searchProducts };