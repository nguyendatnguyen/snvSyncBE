import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { History } from './entities/history.entity';
import { getConnection } from "typeorm";
import { SubHistory } from 'src/sub-history/entities/sub-history.entity';

@Injectable()
export class HistoryService {
    constructor(
        @InjectRepository(History) private historyRepository: Repository<History>,
        @InjectRepository(History) private subhistoryRepository: Repository<SubHistory>) { }

    async getAll() {
        const sql =
        `SELECT syncId,shopName, ngay_up,
            case
                when result.tra > 0 then "Chưa xong"
                when result.tra = 0 then "Đã xong"
            end
                as trang_thai    
        FROM (SELECT syncId,shopName, DATE_FORMAT(created_at,"%Y %M %D %H:%i:%s") as ngay_up,
            (select count(*) from sub_history as s where s.syncId=h.syncId and s.status = 0) as tra
        FROM history as h) as result;
        `;
        const result = await getConnection().manager.query(sql);    
        return result;
    }

    async create(syncId: string, shopName: string) {
        await getConnection()
            .createQueryBuilder()
            .insert()
            .into(History)
            .values([
                { syncId: syncId, status: 0, shopName: shopName },
            ])
            .execute();
    }



}
