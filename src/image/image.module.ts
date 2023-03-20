import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { HttpModule } from '@nestjs/axios';

@Module({imports: [
    HttpModule.register({
              timeout: 5000,
              maxRedirects: 5,
          })],
    providers: [ImageService],
    exports:   [ImageService]
})
export class ImageModule {}
