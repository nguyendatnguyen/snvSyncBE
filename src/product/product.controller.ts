import { Body, Controller, Get, HttpStatus, Inject, Param, Post, Query, Res } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create.product.dto';
import {  Response } from 'express';
import { SyncService } from 'src/sync/sync.service';
import { HistoryService } from 'src/history/history.service';
import { ShopService } from 'src/shop/shop.service';
import { Logger } from 'winston';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService,
                private readonly historyService: HistoryService,
                private readonly syncService: SyncService,
                private readonly shopService: ShopService,
                @Inject('winston') private readonly logger: Logger,){}


    @Get('')  
    async getAll(@Query("limit") limit: string = "", @Query("page_info") page_info: string = "") {
        const SHOPIFY_DEFAULT_LIMIT = 50;
        const limit_number = (limit === "") ? SHOPIFY_DEFAULT_LIMIT : parseInt(limit);  
        return await this.productService.getAll(limit_number, page_info);
    } 

    @Post('/:id')
    async create(@Body() products: CreateProductDto[] ,@Param("id") idShop:number,@Res() res: Response) {    
        const sync_id = Date.now().toString();
        const shop = await this.shopService.get(idShop);
        const shopName =  shop.name;
        await this.syncService.addProducts(products, idShop,sync_id);
        await this.historyService.create(sync_id,shopName);      
        res.status(HttpStatus.OK).json(
            {
                message: "Đã bắt đầu đồng bộ."
            }
        );
    }

    @Get("/:id")
    async get(@Param("id") id: string) {
             
        return await this.productService.get(id);
    }
}
