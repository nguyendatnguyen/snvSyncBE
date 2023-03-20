import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { HttpService } from '@nestjs/axios';
import * as fs from "fs";
const path = require('path');
const sharp = require('sharp');
const sizeOf = require('image-size');

@Injectable()
export class ImageService {
    constructor(private httpService: HttpService,
        @Inject('winston') private readonly logger: Logger,
    ) { };
    //dowload image tu link anh
    async downloadImage(src: string, unique_string: string = ""): Promise<string> {
        const path = 'src/assets/images/temporary/';
        const imgName = unique_string + Date.now() + 'image.png';
        const resultPatch = path + imgName;
        const writer = fs.createWriteStream(resultPatch);
        const response = await this.httpService.axiosRef({
            url: src,
            method: 'GET',
            responseType: 'stream',
        });
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                resolve(resultPatch);

            });
            writer.on('error', reject);
        });
    }

    //thuc hien ghep anh 
    async compositeImage(img: string, logo: string, unique_string: string = ""): Promise<string> {
        try {
            const path = 'src/assets/images/temporary/';
            const imgName = unique_string + Date.now() + 'image.png';
            const resultPatch = path + imgName;
            await sharp(img)
                .composite([{ input: logo }])
                .toFile(resultPatch);

            return resultPatch;
        } catch (error) {
            this.logger.error('Image Size is Invalid' + error);
        }
    }

    async checkSizeImage(img: string): Promise<boolean> {
        let result = false;
        try {
            const sizeImg = await sizeOf(img)
            if (sizeImg.width = 1080 && sizeImg.height == 1080) {
                result = true;
            }
            return result;
        } catch (err) {
            this.logger.error(err)
        }
        return result;
    };

    async deleteImage(imgUrl: string): Promise<any> {
        try {
            fs.unlinkSync(imgUrl)
        } catch (error) {
            this.logger.error("DELETE-IMAGE ERROR" + error)
        }
    }

    async deleteAllImage(): Promise<any> {
        const directory = 'src/assets/images/temporary/';
        fs.readdir(directory, (err, files) => {
            if (err) throw err;
            for (const file of files) {
                fs.unlink(path.join(directory, file), err => {
                    if (err) throw err;
                });
            }
        });
    }
}
