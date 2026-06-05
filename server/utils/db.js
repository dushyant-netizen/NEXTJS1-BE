const { PrismaClient } = require("@prisma/client");

// Use a global variable to prevent creating multiple Prisma Client instances 
// during hot-reloads (like with nodemon)
const globalForPrisma = globalThis;

const prismaClientSingleton = () => {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is required');
    }

    return new PrismaClient({
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