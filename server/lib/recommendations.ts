// server/lib/recommendations.ts
import { prisma } from '@/server/lib/prisma';

export async function getRecommendations(
  productId: string, 
  type: 'similar' | 'complementary',
  limit: number = 4
) {
  // 1. Get the target product's embedding
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.embedding) return [];

  // 2. Perform vector search
  // Cosine distance (<=>) for similarity
  return await prisma.$queryRaw`
    SELECT * FROM "Product"
    WHERE id != ${productId}
    ORDER BY embedding <=> ${product.embedding}::vector
    LIMIT ${limit};
  `;
}