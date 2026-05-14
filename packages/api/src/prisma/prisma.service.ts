import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        super({
            log: process.env.NODE_ENV === 'development'
                ? ['query', 'info', 'warn', 'error']
                : ['error', 'warn'],
            datasources: {
                db: {
                    url: process.env.DATABASE_URL,
                },
            },
        });
    }

    async onModuleInit() {
        let retries = 5;
        while (retries > 0) {
            try {
                await this.$connect();
                this.logger.log('✅ Database connected successfully');
                return;
            } catch (error) {
                retries -= 1;
                this.logger.warn(`⚠️ Database connection failed. Retries left: ${retries}`);
                if (retries === 0) {
                    this.logger.error('❌ Could not connect to database after multiple attempts');
                    throw error;
                }
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, (5 - retries) * 1000));
            }
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    // Helper method for transactional operations with retry
    async executeWithRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
        let lastError: Error | undefined;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error: any) {
                lastError = error;

                // Check if it's a connection error that can be retried
                if (error.code === 'P2024' || error.message?.includes('connection')) {
                    this.logger.warn(`Database operation failed (attempt ${attempt}/${maxRetries}): ${error.message}`);

                    if (attempt < maxRetries) {
                        await new Promise(resolve => setTimeout(resolve, attempt * 500));
                        continue;
                    }
                }

                throw error;
            }
        }

        throw lastError;
    }
}
