import { Controller, Get } from '@nestjs/common';

@Controller('public')
export class PublicController {
    @Get()
    getInfo() {
        return {
            name: 'Furniture Store API',
            version: '1.0',
            endpoints: {
                products: '/public/products',
                categories: '/public/categories',
                cart: '/cart',
                orders: '/public/orders',
            },
        };
    }

    @Get('health')
    health() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            services: {
                database: 'connected',
                storage: 'ready',
            },
        };
    }
}