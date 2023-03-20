import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CreateImageDto } from 'src/image/dto/create.image.dto';
import { CreateProductDto } from 'src/product/dto/create.product.dto';
import { Shop } from 'src/shop/entities/shop.entity';
import { Logger } from 'winston';

@Injectable()
export class SyncService {
    constructor(
        @InjectQueue('products_sync') private readonly syncQueue: Queue,
        @Inject('winston') private readonly logger: Logger) { }

    async addProducts(products: CreateProductDto[], shop_id: number, sync_id: string = "") {
        this.logger.info(`PRODUCTS được thêm vào:`);
        products.forEach(async (product, index) => {
            await this.syncQueue.add('product', {
                type: "product",
                product,
                shop_id,
                sync_id,
                job_id: "product-" + Date.now() + index,
                name: product.title
            },
                { delay: 800 });
        })

    }

    async addImages(images: CreateImageDto[], product_id: number, dataShop: Shop, product_title: string = "", sync_id: string = "",variant_ids:number[]) {
        images.forEach(async (image: CreateImageDto, index) => {
            if(image.variant_ids.length == 0){            
                image.variant_ids = [];
            }
            else {
                image.variant_ids = variant_ids;
            }

            await this.syncQueue.add('image', {
                type: "image",
                image,
                product_id,
                dataShop,
                product_title,
                sync_id,
                job_id: "image-" + Date.now() + index,
                name: "Image-" + product_title
                
            },
                { delay: 800 });
        })
    }
    
}
