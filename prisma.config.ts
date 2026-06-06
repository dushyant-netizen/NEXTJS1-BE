// prisma.config.ts
import { defineConfig } from '@prisma/config';
import { join } from 'path';

// Force Node to read and load the .env file from your project root folder
try {
  if (typeof process.loadEnvFile === 'function') {
    process.loadEnvFile(join(process.cwd(), '.env'));
  } else {
    // Fallback for slightly older Node versions
    require('dotenv').config({ path: join(process.cwd(), '.env') });
  }
} catch (e) {
  console.warn("Notice: Local .env file parsing skipped.");
}

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL, 
  },
});