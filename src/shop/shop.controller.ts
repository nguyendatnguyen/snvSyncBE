import { Body, Controller, Get, HttpStatus, Inject, Param, Patch, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ShopService } from './shop.service';
import { Logger } from 'winston';
import { CreateShopDto } from './dto/create.shop.dto';
import { UpdateShopDto } from './dto/update.shop.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ImageService } from 'src/image/image.service';
import { editFileName, imageFileFilter } from 'src/utils/image-upload.utils';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService,
    private readonly imageService: ImageService,
    @Inject('winston') private readonly logger: Logger) { }

  @Get('')
  async getAll() {

    const result = await this.shopService.getAll();
    return Object.assign({
      data: result,
      statusCode: 201,
      status: `success`,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.shopService.get(Number(id));
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'src/assets/images/upload',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter
    }),
  )
  async Create(@Body() createShopDTO: CreateShopDto, @UploadedFile() file: Express.Multer.File) {
    const check = await this.imageService.checkSizeImage(file.path);
    if (check) {
      const result = await this.shopService.create(createShopDTO, file.path);
      return Object.assign({
        data: result,
        statusCode: 200,
        status: `success`,
      });
    }
    else {
      await this.imageService.deleteImage(file.path);
      return {
        "message": "Size Image is invalid"
      }
    }
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'src/assets/images/upload',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter
    }),
  )
  async Update(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto, @UploadedFile() image?: Express.Multer.File) {
    if (image) {
      const check = await this.imageService.checkSizeImage(image.path);
      if (check) {
        const result = await this.shopService.update(Number(id), updateShopDto, image.path);
        if (Object(result).statusCode == 404) {
          return Object(result);
        }
        else {
          return Object.assign({
            data: result,
            statusCode: 200,
            status: `success`,
          });
        }
      } else {
        await this.imageService.deleteImage(image.path);
        return {
          "message": "Size Image is invalid"
        }
      }
    }
    else{
      const result = await this.shopService.update(Number(id), updateShopDto);
      if (Object(result).statusCode == 404) {
        return Object(result);
      }
      else {
        return Object.assign({
          data: result,
          statusCode: 200,
          status: `success`,
        });
      }
    }
  }

  @Patch('/delete/:id')
  async Delete(@Param('id') id: string) {
    const result = await this.shopService.delete(Number(id));
    if (Object(result).statusCode == 404) {
      return Object(result);
    }
    else {
      return Object.assign({
        statusCode: 200,
        status: `success`,
      });
    }
  }
}


