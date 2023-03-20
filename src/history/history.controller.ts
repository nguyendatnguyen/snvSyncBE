import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService,
        @Inject('winston') private readonly logger: Logger
    ) { }

    @Get('')
    async getAll() {

        const result =  await this.historyService.getAll();
        return Object.assign({
            data: result,
            statusCode: 200,
            status: `success`,
          });
    }
}
