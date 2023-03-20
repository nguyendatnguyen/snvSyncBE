import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { CreateShopDto } from "./create.shop.dto";

export class UpdateShopDto  {
    @IsString({ message: 'name is string' })
    @IsNotEmpty({ message: 'name không được để trống' })
    name: string

    @IsString({ message: 'accessToken is string' })
    @IsNotEmpty({ message: 'accessToken không được để trống' })
    @MinLength(38,{ message: 'Độ dài bắt buộc của accessToken là 38 kí tự' })
    @MaxLength(38)
    accessToken: string

    // @IsString({ message: 'baseUrl is string' })
    logo?: string

    @IsString({ message: 'baseUrl is string' })
    @IsNotEmpty({ message: 'baseUrl không được để trống' })
    baseUrl: string

    @IsString({ message: 'topDescription is string' })
    topDescription: string

    @IsString({ message: 'description is string' })
    @IsNotEmpty({ message: 'description không được để trống' })
    description: string

    @IsString()
    tags: string

    
    status?: number
}