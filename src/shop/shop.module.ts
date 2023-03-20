import { HttpModule } from '@nestjs/axios';
import {  Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageService } from 'src/image/image.service';
import { Shop } from './entities/shop.entity';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';


@Module({
  imports: [TypeOrmModule.forFeature([Shop]),HttpModule.register({
    timeout: 20000,
    maxRedirects: 5,
  })],
  controllers: [ShopController],
  providers: [ShopService,ImageService],
  exports: [ShopService]
})
export class ShopModule {}
