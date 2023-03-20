import { Controller, Get, Inject, Param } from '@nestjs/common';
import { Logger } from 'winston';
import { SubHistoryService } from './sub-history.service';

@Controller('sub-history')
export class SubHistoryController {
    constructor(private readonly subHistoryService: SubHistoryService,

        @Inject('winston') private readonly logger: Logger,) { }

    @Get("/:sync_id")
    async get(@Param("sync_id") sync_id: string) {

        return await this.subHistoryService.get(sync_id);
    }
}
