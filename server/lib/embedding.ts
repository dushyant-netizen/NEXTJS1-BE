// Example: server/lib/embedding.ts
export async function getEmbedding(text: string): Promise<number[]> {
    // Use OpenAI or another provider
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return response.data[0].embedding;
  }