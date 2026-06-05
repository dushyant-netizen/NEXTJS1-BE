import path from 'path';
import dotenv from 'dotenv';

// Explicitly point to the .env file inside your server folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { OpenAI } from 'openai';
import { Pool } from 'pg';
// ... rest of your code

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function syncEmbeddings() {
  // 1. Fetch products that don't have an embedding yet
// 1. Fetch products using your exact column names
// 'title' and 'description' are in your list, so we use those
const { rows } = await pool.query(
  'SELECT "id", "title", "description" FROM "Product" WHERE "embedding" IS NULL'
);

for (const product of rows) {
  console.log(`Generating embedding for: ${product.title}`);
  
  // 2. Generate embedding
  const input = `${product.title} ${product.description}`;
  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: input,
  });
  const vector = embeddingResponse.data[0].embedding;

  // 3. Update the database
  // Note: Ensure your database actually has an "embedding" column.
  // If it doesn't, you need to add it via Prisma or a SQL ALTER command.
  await pool.query(
    'UPDATE "Product" SET "embedding" = $1 WHERE "id" = $2',
    [JSON.stringify(vector), product.id]
  );
}
}

syncEmbeddings().catch(console.error);