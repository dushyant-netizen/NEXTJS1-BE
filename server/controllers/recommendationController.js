// controllers/recommendationController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getRecommendations = async (productId, limit = 4) => {
  // 1. Get the current product and its embedding
  const currentProduct = await prisma.product.findUnique({
    where: { id: productId },
    select: { embedding: true }
  });

  if (!currentProduct || !currentProduct.embedding) return [];

  // 2. Perform vector search using pgvector's cosine distance operator (<=>)
  // This finds products most semantically similar to the current one
  const recommendations = await prisma.$queryRaw`
    SELECT id, name, price, description 
    FROM "Product"
    WHERE id != ${productId}
    ORDER BY embedding <=> ${currentProduct.embedding}::vector
    LIMIT ${limit};
  `;

  return recommendations;
};