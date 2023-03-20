import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './entities/history.entity';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { SubHistory } from 'src/sub-history/entities/sub-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([History]),
            TypeOrmModule.forFeature([SubHistory])],
  providers: [HistoryService],
  controllers: [HistoryController]
})
export class HistoryModule {}
