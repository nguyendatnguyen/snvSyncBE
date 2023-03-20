import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ShopModule } from './shop/shop.module';
import { ProductModule } from './product/product.module';
import { BullModule } from '@nestjs/bull';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { HistoryModule } from './history/history.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ImageModule } from './image/image.module';
import { SubHistoryModule } from './sub-history/sub-history.module';
import * as path from 'path';
import { MulterModule } from '@nestjs/platform-express';
require('dotenv').config();


@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src/assets/'),
      serveRoot: '/assets/'
    }),
    MulterModule.register({
      dest: 'src/assets/images/upload',
    }),
    WinstonModule.forRoot({
      defaultMeta: { service: 'user-service' },
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY/MM/DD HH:mm:ss'
        }),
        winston.format.printf(({ level, message, defaultMeta, timestamp, stack, trace }) => {
          return `${timestamp} [${defaultMeta}] ${level}: ${message} ${stack ? stack : ''} ${trace ? trace : ''}`;
        }),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          dirname: path.join(__dirname, './../log/debug/'), //path to where save loggin result 
          filename: 'debug.log', //name of file where will be saved logging result
          level: 'debug',
        }),
        new winston.transports.File({
          dirname: path.join(__dirname, './../log/error/'),
          filename: 'error.log',
          level: 'error',
        }),
        new winston.transports.File({
          dirname: path.join(__dirname, './../log/info/'),
          filename: 'info.log',
          level: 'info',
        }),
      ],
    }),
    // Dùng khi ko sử dụng ormconfig.json
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 3306,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [
          "dist/migrations/*{.ts,.js}"
        ],
        cli: {
          "migrationsDir": "src/migrations"
        },
        synchronize: false,
        autoLoadEntities: true,
      })
    }),
    // CÁCH 2: Dùng cái này khi sử dụng config DB cho typeorm qua ormconfig.json
    // Phải dùng thêm config ở đây vì config ở ormconfig.json k hỗ trợ các extra props như autoLoadEntities 
    // TypeOrmModule.forRootAsync({
    //   useFactory: async () =>
    //     Object.assign(await getConnectionOptions(), {
    //       autoLoadEntities: true,
    //     }),
    // }),
    ShopModule,   
    ProductModule,
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT) || 6379,
        },
      }),
    }),
    HistoryModule,
    ImageModule,
    SubHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // Chỉ dùng khi config DB cho typeorm qua json (CÁCH 2)
  // constructor(private connection: Connection) { }
}
