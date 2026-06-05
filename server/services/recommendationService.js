const { prisma } = require('../lib/db'); // Ensure this uses the v7 adapter logic

async function getSimilarProducts(productId, limit = 4) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.embedding) return [];

  // SQL query for cosine similarity
  return await prisma.$queryRaw`
    SELECT id, name, description, 1 - (embedding <=> ${product.embedding}::vector) AS similarity
    FROM "Product"
    WHERE id != ${productId}
    AND 1 - (embedding <=> ${product.embedding}::vector) > 0.6  -- Only show matches > 60%
    ORDER BY similarity DESC
    LIMIT ${limit};
  `;
}

module.exports = { getSimilarProducts };