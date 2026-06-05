const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

const globalForPrisma = globalThis;

const prismaClientSingleton = () => {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is required');
    }

    // 1. Initialize the PostgreSQL Pool
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    // 2. Initialize the PrismaPg adapter (Required for Prisma v7)
    const adapter = new PrismaPg(pool);

    // 3. Pass the adapter to the PrismaClient constructor
    return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" 
            ? ['query', 'info', 'warn', 'error'] 
            : ['error', 'warn'],
    });
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

module.exports = prisma;

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}