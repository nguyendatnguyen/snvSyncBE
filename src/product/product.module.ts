import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from 'src/shop/entities/shop.entity';
import { ShopService } from 'src/shop/shop.service';
import { SyncService } from 'src/sync/sync.service';
import { BullModule } from '@nestjs/bull';
import { SyncConsumer } from 'src/sync/sync.processor';
import { History } from 'src/history/entities/history.entity';
import { HistoryService } from 'src/history/history.service';
import { ImageService } from 'src/image/image.service';
import { SubHistory } from 'src/sub-history/entities/sub-history.entity';
import { SubHistoryService } from 'src/sub-history/sub-history.service';


@Module({
  imports: [
    HttpModule.register({
      timeout: 20000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forFeature([Shop]),
    TypeOrmModule.forFeature([History]),
    TypeOrmModule.forFeature([SubHistory]),
    BullModule.registerQueueAsync({
      name: 'products_sync'
    }),
  ],
  providers: [ProductService, ShopService, SyncService, SyncConsumer, HistoryService,SubHistoryService, ImageService],
  controllers: [ProductController],
  exports: [ProductService]
})
export class ProductModule { }
