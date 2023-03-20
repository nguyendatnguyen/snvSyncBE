import { CreateImageDto } from "src/image/dto/create.image.dto";
import { CreateVariantDto } from "src/variant/dto/create.variant.dto";
import { CreateOptionDto } from "src/option/dto/create.option.dto";


export interface CreateProductDto {
    title: string
    body_html: string
    vendor: string
    handle: string
    product_type: string
    images?: CreateImageDto[]  
    tags?: string
    variants?: CreateVariantDto[],
    options?: CreateOptionDto[]
  }