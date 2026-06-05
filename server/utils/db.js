const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

const globalForPrisma = globalThis;

const prismaClientSingleton = () => {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    const adapter = new PrismaPg(pool);

    return new PrismaClient({
        adapter,
        log:
            process.env.NODE_ENV === "development"
                ? ["query", "info", "warn", "error"]
                : ["error", "warn"],
    });
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

module.exports = prisma;