const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

const globalForPrisma = globalThis;

const prismaClientSingleton = () => {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    return new PrismaClient({
        adapter, // This handles the database connection now
    });
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();
module.exports = prisma;