import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { catchError, lastValueFrom, map, of, tap } from 'rxjs';
import { Product } from './interface/product.interface';
import { CreateProductDto } from './dto/create.product.dto';
import { Shop } from 'src/shop/entities/shop.entity';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from 'winston';
import { HistoryService } from 'src/history/history.service';
import { SyncService } from 'src/sync/sync.service';
import { ImageService } from 'src/image/image.service';
import { ShopService } from 'src/shop/shop.service';
import { SubHistoryService } from 'src/sub-history/sub-history.service';

const sharp = require('sharp')

@Injectable()
@Processor('products_sync')
export class ProductService {

  constructor(private httpService: HttpService,
    @Inject('winston') private readonly logger: Logger,
    private readonly syncService: SyncService,
    private readonly imageService: ImageService,
    private readonly shopService: ShopService,
    private readonly subHistoryService: SubHistoryService,
    private readonly historyService: HistoryService) { };

  //lay tat ca san pham  
  async getAll(limit: number = 50, page_info: string = "", arr:any[]=[]): Promise<any[]> {
    try {             
      const token = process.env.TOKEN_SHOPIFY;
      const baseUrl = process.env.PRODUCT_BASE_URL;
      const products = await lastValueFrom(this.httpService.get(`${baseUrl}.json?limit=${limit}&page_info=${page_info}`,
        {
          headers: {
            'X-Shopify-Access-Token': `${token}`,
            'Accept': 'application/json'
          }
        })
        .pipe(       
          map(response => {
            const { next, prev } = this.get_page_info(response);
            return {
              status: 'success',
              data: response.data,
              pagination: {
                next,
                prev,
                limit
              }
            } as ServiceResult<any[]>;
          }), catchError((err) => {
            
            return of({
              status: "error",
              data: {
                message: err.message,
                error: JSON.stringify(err.message)  
              }
            } as ServiceResult<any>);
          })
        ));    
        //add product vào mảng
         products.data.products.forEach(async (product) => {        
            arr.push(product);                
        });           
        //Check điều kiện để dừng đệ quy
        if (products.pagination.next == '')    {
          this.logger.debug('products.pagination.next [TRUE]' + JSON.stringify(products.pagination.next))
          return arr
        }
        else{
          const limit= 50;
          const page_info = products.pagination.next;
          this.logger.debug('products.pagination.next [FALSE]: ' + page_info)
          return this.getAll(limit,page_info, arr);
        }   
                  
    } catch (error) {
      this.logger.error("ProductServer:getAll:error");
    }
  }

  //lay phan trang san pham
  private get_page_info(response) {
    const links = (response.headers.link) ? response.headers.link.split(",") : [];
    const IS_FIRST_REQUEST = 1;
    let prev_link = "";
    let next_link = "";
    if (links.length === IS_FIRST_REQUEST) {
      next_link = links[0];
    } else {
      prev_link = links[0];
      next_link = links[1];
    }
    const prev_regex = /page_info=(.*)>; rel=\"previous\"/.exec(prev_link);
    const prev = (prev_regex) ? prev_regex[1] : "";
    const next_regex = /page_info=(.*)>; rel=\"next\"/.exec(next_link);
    const next = (next_regex) ? next_regex[1] : "";
     return { next, prev };
  }

  async getArrayResponse(){
    
  }

  //lay 1 san pham
  async get(id): Promise<ServiceResult<Product>> {
    try {
      const token = process.env.TOKEN_SHOPIFY;
      const baseUrl = process.env.PRODUCT_BASE_URL;
      const headers = {
        'X-Shopify-Access-Token': `${token}`,
        'Content-Type': 'application/json'
      }
      const product = await lastValueFrom(this.httpService.get(`${baseUrl}` + '/' + `${id}` + '.json',
        { headers })
        .pipe(
          map(response => {
            return {
              status: "success",
              data: response.data.product
            } as ServiceResult<Product>;
          }),
          catchError((err) => {
            return of({
              status: "error",
              data: {
                message: `Không tồn tại sản phẩm có id: ${id}  `,
                error: JSON.stringify(err.message)  
                
              }
            } as ServiceResult<any>);
          })
        )
      );
      return product;

    } catch (error) {
      this.logger.error(error.response.statusCode);
    }
  }

  //tao 1 san pham 
  async create_one_product(productSource: CreateProductDto, accessTokenShop: string, baseUrl: string, topDescription: string, description: string, tags: string)
    : Promise<ServiceResult<Product>> {
    try {
      let dataTag = "";
      if (productSource.tags) {
        dataTag = productSource.tags + "," + tags
      }
      else {
        dataTag = tags
      }
      if (topDescription == null) {
        topDescription = "";
      }

      //Convert Variant thành image_id:null để map với entity tạo Product, nếu có value sẽ lỗi
      productSource.variants = productSource.variants.map(variant => {
        let new_variant = variant;
        new_variant.image_id = null;
        return new_variant;
      })

      const productDestination: CreateProductDto = {
        title: productSource.title,
        body_html: topDescription + productSource.body_html + description,
        vendor: productSource.vendor,
        handle: productSource.handle,
        product_type: productSource.product_type,
        tags: dataTag,
        variants: productSource.variants,
        options: productSource.options
      }

      const payloadProduct = { product: productDestination };
     
      const headers = {
        'X-Shopify-Access-Token': `${accessTokenShop}`,
        'Content-Type': 'application/json'
      }
      const product = await lastValueFrom(this.httpService.post(`${baseUrl}` + '.json',
        payloadProduct,
        { headers })
        .pipe(
          map(response => {
            return {
              status: "success",
              data: response.data.product
            } as ServiceResult<Product>;
          }),   
          catchError((err ) => {            
            return of({       
              status: "error",
              data: {
                message: 'Lỗi khi tạo sản phẩm có tiêu đề ' + productDestination.title,
                error:  JSON.stringify(err.message)       
              }
            } as ServiceResult<any>);
          })
        ));
      
      return product;
    } catch (error) {
      this.logger.error("ProductService:create_one_product catch error", error);
    }
  }

  //Tạo Ảnh 
  async create_image_product(idProduct: number, src: string, accessTokenShop: string, baseUrl: string, position: number, variant_ids: number[])
    : Promise<any> {
    try {     
      const headers = {
        'X-Shopify-Access-Token': `${accessTokenShop}`,
        'Content-Type': 'application/json'
      }
      const payload = {
        image: {
          src: src,
          position: position,
          variant_ids: variant_ids
        }
      }
      const linkPush = `${baseUrl}` + '/' + `${idProduct}` + '/images.json';
      const image = await lastValueFrom(this.httpService.post(linkPush,
        payload,
        { headers })
        .pipe(
          map(response => {
            return {
              "status": "success",
              data: response.data
            }
          }),
          catchError((err) => {
            return of({
              "status": "error",
              data: {
                message: 'Lỗi khi tạo ảnh của sản phẩm : ' + idProduct,
                error:  JSON.stringify(err.message)       
              }
            });
          })
        ));
      return image;
    } catch (error) {
      this.logger.error("ProductService:create_images error" + `${error.response}`);
    }
  }

  async upload_product(productSource: CreateProductDto, idShop: number, sync_id: string = ""): Promise<any> {
    try {
      const dataShop = await this.shopService.get(idShop);
      const result = await this.create_one_product(productSource, dataShop.accessToken, dataShop.baseUrl, dataShop.topDescription, dataShop.description, dataShop.tags);    
      if (result && result.data && result.status === "success") {
        const variant_ids: number[] = [];
        productSource.variants.forEach((item) => {             
          for (let i = 0; i < result.data.variants.length; i++) {
            if (item.title === result.data.variants[i].title && variant_ids.indexOf(result.data.variants[i].id) === -1) {
              variant_ids.push(result.data.variants[i].id);
              break;
            }
          }
        });       
        await this.syncService.addImages(productSource.images, result.data.id, dataShop, result.data.title, sync_id, variant_ids);

      } else {
        this.logger.debug("Sản phẩm tạo thất bại. Tiêu đề: `" + productSource.title + "`. Message: " + `${result.data.message}`);
        this.logger.debug(JSON.stringify(result.data));
      }
      this.logger.info("[END] ProductService:upload_product " + JSON.stringify(result));
      return result;

    } catch (error) {
      this.logger.error(error);
    }
  }

  private async combine_logo_then_upload_to_shopify(id_product: number, dataShop: Shop, origin_img_src: string, position: number, variant_ids: number[], order: string = "",) {
    const logo = dataShop.logo;
    let ngrokImage = "";
    const downloadImg = await this.imageService.downloadImage(origin_img_src, id_product + "_" + order.toString());
    const checkInfoImage = await this.imageService.checkSizeImage(downloadImg);
    if (checkInfoImage) {
      const resultImg = await this.imageService.compositeImage(downloadImg, logo, id_product + "_" + order.toString());
      ngrokImage = process.env.APP_BASE_URL + resultImg.replace("src/", "");
    }
    else {
      ngrokImage = process.env.APP_BASE_URL + downloadImg.replace("src/", "");
    }
    const imageResult = await this.create_image_product(id_product, ngrokImage, dataShop.accessToken, dataShop.baseUrl, position, variant_ids);
    return imageResult;
  }

  // Đưa sản phẩm vào redis
  @Process('product')
  async handleProductJob(job: Job) {
    const data = job.data;
    this.logger.info("[BEGIN] handleProductJob");
    try {
      await this.subHistoryService.create(data.sync_id, data.job_id,data.name);
      let result = await this.upload_product(data.product, data.shop_id, data.sync_id);
      if (result.status === "success") {
        await this.subHistoryService.update(data.sync_id, data.job_id);
      }
      if (result.status === "error") {
        this.logger.error(JSON.stringify(result.data));
        // this.syncService.addProducts([data.product], data.shop_id,data.sync_id);
      }
      this.logger.info(`[END] Tạo sản phẩm... ${data.product.title}`);
    } catch (e) {
      this.logger.error(e.statusCode);
    }
    this.logger.info("[END] handleProductJob");
  }

  //Đưa image vào redis
  @Process('image')
  async handleImageJob(job: Job) {
    const data = job.data;
    this.logger.info("[BEGIN] handleImageJob");
    try {
      let result;
      if (data.image) {
        await this.subHistoryService.create(data.sync_id, data.job_id,data.name);
        result = await this.combine_logo_then_upload_to_shopify(data.product_id, data.dataShop, data.image.src, data.image.position, data.image.variant_ids);
        if (result.status === 'success') {
          this.logger.debug("đã vào THÀNH CÔNG IMAGE");
          await this.subHistoryService.update(data.sync_id, data.job_id);
        } if (result.status === 'error') {
          this.logger.debug("đã vào THẤT BẠI IMAGE");
          await this.subHistoryService.update(data.sync_id, data.job_id);
        }
      } else {
        this.logger.debug(`Lỗi không có hình ảnh tại sản phẩm`);
      }
    } catch (e) {
      this.logger.error(e);
    }

    this.logger.info("[END] handleImageJob");
  }
  

}
