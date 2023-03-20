import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, getRepository, Repository } from 'typeorm';
import { SubHistory } from './entities/sub-history.entity';

@Injectable()
export class SubHistoryService {
    constructor(
        @InjectRepository(SubHistory) private subHistoryRepository: Repository<SubHistory>) { }

    async getAll(): Promise<SubHistory[]> {
        return await this.subHistoryRepository.find();
    }

    async get(syncId: string): Promise<any> {
        const result = await getConnection().manager.query(`select  sub.tong_so,
        s.status,
        s.name,DATE_FORMAT(created_at,"%Y %M %D %H:%i:%s") as ngay_up
        from sub_history  as s 
           , (select count(sb.syncId) as tong_so
             from sub_history as sb where sb.jobId Like 'p%' and sb.syncId =?
         ) sub where s.syncId = ?`,[syncId,syncId]);    
     
        return  result;
    }

    async create(syncId: string, jobId: string, name: string) {
        await getConnection()
            .createQueryBuilder()
            .insert()
            .into(SubHistory)
            .values([
                { syncId: syncId, jobId: jobId, status: 0, name: name },
            ])
            .execute();
    }


    async update(syncId: string, jobId: string) {
        await getConnection()
            .createQueryBuilder()
            .update(SubHistory)
            .set({
                status: 1
            })
            .where("syncId = :syncId AND jobId = :jobId", { syncId, jobId })
            .execute();

    }

    async fails(syncId: string, jobId: string) {
         await getConnection()
            .createQueryBuilder()
            .update(SubHistory)
            .set({
                status: 1
            })
            .where("syncId = :syncId AND jobId = :jobId", { syncId, jobId })
            .execute();

    }

}
