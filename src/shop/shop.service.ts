import {  Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageService } from 'src/image/image.service';
import { getConnection, Repository } from 'typeorm';
import { Logger } from 'winston';
import { CreateShopDto } from './dto/create.shop.dto';
import { UpdateShopDto } from './dto/update.shop.dto';
import { Shop } from './entities/shop.entity';


@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop) private shopRepository: Repository<Shop>,
    private readonly imageService: ImageService,
    @Inject('winston') private readonly logger: Logger,
  ) { }

  async getAll(): Promise<Shop[]> {
    const result = await getConnection().manager.query(
      `SELECT * FROM shop where shop.status =1`);    
    return  result;
    
  }

  async get(id: number): Promise<Shop> {

    const result = await this.shopRepository.findOne(id);
    if (!result) {
      throw new NotFoundException(`Shop #${id} not found`);
    }
    return result;
  }

  async create(createShopDTO: CreateShopDto, urlImage: string): Promise<Shop> {
    const shopData: CreateShopDto = {
      name: createShopDTO.name,
      accessToken: createShopDTO.accessToken,
      baseUrl: createShopDTO.baseUrl,
      topDescription: createShopDTO.topDescription,
      description: createShopDTO.description,
      tags: createShopDTO.tags,
      logo: urlImage,
      status: 1
    };
    const shop = this.shopRepository.create(shopData);
    const result = await this.shopRepository.save(shop);
    return result;
  }


  // update
  async update(id: number, updateShopDto: UpdateShopDto,urlImage?: string): Promise<Shop> {
    try {
      const existShop = await this.shopRepository.findOne(id);  
      if(existShop){
        let url ;
        if(urlImage){
          url = urlImage;
        }else{
          url = existShop.logo;
        }
          const originalUrl = existShop.logo;
          existShop.name = updateShopDto.name;
          existShop.baseUrl = updateShopDto.baseUrl;
          existShop.accessToken = updateShopDto.accessToken;
          existShop.topDescription = updateShopDto.topDescription;
          existShop.description = updateShopDto.description;
          existShop.tags = updateShopDto.tags;
          existShop.logo = url;
          await this.shopRepository.save(existShop);
          if(urlImage){
            await this.imageService.deleteImage(originalUrl);      
          }          
          return existShop;
        }
        else{
          return Object.assign({
            data: {},
            statusCode: 404,
            status: (`Shop #${id} not found`)
          });
        }
      }
    catch (error) {
        this.logger.error(error)
      }
    }    

    async delete(id: number): Promise<Shop> {
      try {
        const existShop = await this.shopRepository.findOne(id);
        if(existShop){
            existShop.status = 0
            await this.shopRepository.save(existShop)
            return existShop;
          }
          else{
            return Object.assign({
              data: {},
              statusCode: 404,
              status: (`Shop #${id} not found`)
            });
          }
        }
      catch (error) {
          this.logger.error(error)
        }
      }
}



