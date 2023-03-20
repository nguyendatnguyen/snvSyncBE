import { OnGlobalQueueCompleted, OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ProductService } from 'src/product/product.service';

@Processor('products_sync')
export class SyncConsumer {

    private readonly logger = new Logger(SyncConsumer.name);

    @Process('sync')
    handleTranscode(job: Job) {
        this.logger.debug('Start sync...');
        this.logger.debug(job.data);
        this.logger.debug('Sync completed');
    }

}