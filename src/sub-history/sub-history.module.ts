import { Module } from '@nestjs/common';
import { SubHistoryService } from './sub-history.service';
import { SubHistoryController } from './sub-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubHistory } from './entities/sub-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubHistory])],
  providers: [SubHistoryService],
  controllers: [SubHistoryController],
  exports: [SubHistoryService]
})
export class SubHistoryModule {}
